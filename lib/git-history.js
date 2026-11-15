/** 只读 git 版本查询：不写仓库、不拼 shell；所有参数走 argv。 */
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const TIMEOUT = 5000;
const MAX_COMMITS = 100;
const VERSION_LIST = 50;
const SHOW_BYTES = 200 * 1024;
const CACHE_TTL = 5_000;
const cache = new Map();

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > CACHE_TTL) {
    cache.delete(key);
    return undefined;
  }
  return hit.value;
}

function cacheSet(key, value) {
  cache.set(key, { at: Date.now(), value });
  return value;
}

/** 沙箱下不能用管道捕获子进程输出：把 stdout 重定向到临时文件再读。 */
async function git(cwd, args) {
  const out = path.join(os.tmpdir(), 'dsa-git-' + crypto.randomBytes(6).toString('hex') + '.out');
  const fd = fs.openSync(out, 'w');
  try {
    await new Promise((resolve, reject) => {
      const child = spawn('git', args, { cwd, stdio: ['ignore', fd, 'ignore'], windowsHide: true });
      const timer = setTimeout(() => { child.kill(); reject(new Error('git timeout')); }, TIMEOUT);
      child.on('error', (error) => { clearTimeout(timer); reject(error); });
      child.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0) resolve();
        else reject(new Error('git exited ' + code));
      });
    });
    return fs.readFileSync(out, 'utf8');
  } finally {
    try { fs.closeSync(fd); } catch { /* already closed */ }
    try { fs.unlinkSync(out); } catch { /* best effort */ }
  }
}

export async function repoRootOf(filePath) {
  let dir = path.dirname(path.resolve(filePath));
  for (let depth = 0; depth < 20; depth += 1) {
    try {
      const stat = await fs.promises.stat(path.join(dir, '.git'));
      if (stat.isDirectory() || stat.isFile()) return dir;
    } catch { /* keep walking */ }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function relPathOf(root, filePath) {
  const rel = path.relative(root, path.resolve(filePath)).replace(/\\/g, '/');
  if (rel === '' || rel.startsWith('../') || path.isAbsolute(rel)) return null;
  return rel;
}

/** 列表用：提交数 / 是否跟踪 / 是否脏；repo 外或非 git 返回 null。 */
export async function gitInfo(filePath) {
  const key = 'info:' + path.resolve(filePath).toLowerCase();
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;
  try {
    const repo = await repoRootOf(filePath);
    if (!repo) return cacheSet(key, null);
    const rel = relPathOf(repo, filePath);
    if (!rel) return cacheSet(key, null);
    const tracked = (await git(repo, ['ls-files', '--error-unmatch', '--', rel]).then(() => true).catch(() => false));
    const status = tracked ? (await git(repo, ['status', '--porcelain', '--', rel]).catch(() => '')).trim() : '';
    const version = tracked
      ? (await git(repo, ['log', '--follow', '--format=%H', '-n', String(MAX_COMMITS), '--', rel]).catch(() => ''))
        .split('\n').filter(Boolean).length
      : 0;
    return cacheSet(key, { repo, rel, tracked, dirty: status !== '', version });
  } catch {
    return cacheSet(key, null);
  }
}

/** 详情用：最近提交列表，旧 → 新编号 v1..vN 由调用方决定。 */
export async function gitVersions(filePath) {
  const info = await gitInfo(filePath);
  if (!info || !info.tracked) return { git: info, commits: [] };
  const key = 'versions:' + path.resolve(filePath).toLowerCase();
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;
  try {
    const out = await git(info.repo, ['log', '--follow', '--date=unix', '--format=%H%x09%ct%x09%s', '-n', String(VERSION_LIST), '--', info.rel]);
    const commits = out.split('\n').filter(Boolean).map((line) => {
      const [hash, time, subject] = line.split('\t');
      return { hash, time: Number(time) * 1000 || 0, subject: subject || '' };
    }).reverse();
    return cacheSet(key, { git: info, commits });
  } catch {
    return cacheSet(key, { git: info, commits: [] });
  }
}

/** 读取某个提交里的文件文本；超限/二进制交给调用方处理。 */
export async function gitShow(filePath, commit) {
  if (!/^[0-9a-f]{7,40}$/i.test(String(commit || ''))) throw new Error('无效的提交');
  const info = await gitInfo(filePath);
  if (!info || !info.tracked) throw new Error('文件不在 git 仓库中');
  const text = await git(info.repo, ['show', `${commit}:${info.rel}`]);
  if (Buffer.byteLength(text, 'utf8') > SHOW_BYTES) throw new Error('版本内容过大');
  if (text.includes('\u0000')) throw new Error('二进制文件不支持预览');
  return { text, commit, path: filePath, bytes: Buffer.byteLength(text, 'utf8') };
}

export function clearGitCache() {
  cache.clear();
}
