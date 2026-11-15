#!/usr/bin/env node
// 源安装（git archive）不会执行 npm 的 files 过滤；缺失的 lib/vendor 会让 Host 静默 inactive。
// 该检查同时用于 prepack 与 CI：文件必须存在、被 Git 跟踪、且未被 ignore。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = [
  'index.js',
  'client.js',
  'package.json',
  'cordis.patch.yml',
  'icon.svg',
  'lib/classify.js',
  'lib/collect.js',
  'lib/git-history.js',
  'lib/path-rebase.js',
  'lib/scan.js',
  'locale/zh.json',
  'locale/en.json',
  'vendor/material-icons',
  'vendor/material-icons/LICENSE',
];

function exists(rel) {
  try { fs.accessSync(path.join(ROOT, rel)); return true; } catch { return false; }
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function importsOf(rel) {
  const source = read(rel);
  const found = new Set();
  const patterns = [
    /(?:from\s+|import\s*\()\s*['"](\.[^'"]+)['"]/g,
    /(?:require\s*\()\s*['"](\.[^'"]+)['"]/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source)) !== null) found.add(match[1]);
  }
  return [...found];
}

function resolveLocal(fromRel, request) {
  const base = path.resolve(path.dirname(path.join(ROOT, fromRel)), request);
  const candidates = [base, base + '.js', base + '.mjs', base + '.json', path.join(base, 'index.js')];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function gitTracked() {
  try {
    const out = execFileSync('git', ['-C', ROOT, 'ls-files', '-z'], { encoding: 'utf8' });
    return new Set(out.split('\u0000').filter(Boolean));
  } catch {
    return null;
  }
}

function gitIgnored(rel) {
  const result = spawnSync('git', ['-C', ROOT, 'check-ignore', '--quiet', rel], { stdio: 'ignore' });
  return result.status === 0;
}

export function verifyPackage() {
  const errors = [];
  for (const rel of REQUIRED) {
    if (!exists(rel)) errors.push('missing required file: ' + rel);
  }

  const vendorDir = path.join(ROOT, 'vendor', 'material-icons');
  if (fs.existsSync(vendorDir)) {
    const icons = fs.readdirSync(vendorDir).filter((name) => name.endsWith('.svg'));
    if (icons.length === 0) errors.push('vendor/material-icons contains no svg icons');
  }

  const sources = ['index.js', 'client.js'];
  for (const rel of fs.readdirSync(path.join(ROOT, 'lib')).filter((name) => name.endsWith('.js'))) {
    sources.push('lib/' + rel);
  }
  for (const rel of sources) {
    if (!exists(rel)) continue;
    for (const request of importsOf(rel)) {
      if (!resolveLocal(rel, request)) errors.push('unresolved local import: ' + rel + ' -> ' + request);
    }
  }

  const pkg = JSON.parse(read('package.json'));
  const files = Array.isArray(pkg.files) ? pkg.files : [];
  for (const entry of ['index.js', 'client.js', 'lib', 'vendor/material-icons', 'locale/*.json', 'cordis.patch.yml']) {
    if (!files.includes(entry)) errors.push('package.json files is missing: ' + entry);
  }

  const tracked = gitTracked();
  if (tracked) {
    for (const rel of REQUIRED) {
      if (!tracked.has(rel) && rel !== 'vendor/material-icons') errors.push('not tracked by git: ' + rel);
    }
    const trackedPath = (entry) => tracked.has(entry) || [...tracked].some((file) => file.startsWith(entry.replace(/\/$/, '') + '/'));
    for (const entry of files) {
      if (entry.includes('*')) continue;
      if (!trackedPath(entry)) errors.push('package files entry is not tracked: ' + entry);
    }
  }

  for (const rel of REQUIRED) {
    if (gitIgnored(rel)) errors.push('ignored by git: ' + rel + ' (fix .gitignore with !' + rel.split('/')[0] + '/)');
  }

  return { ok: errors.length === 0, errors, root: ROOT, tracked: Boolean(tracked) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const result = verifyPackage();
  if (!result.ok) {
    console.error('[verify-package] FAILED');
    for (const error of result.errors) console.error(' - ' + error);
    process.exit(1);
  }
  console.log('[verify-package] OK — required files exist, imports resolve, package entries present' + (result.tracked ? ', git tracking visible' : ''));
}
