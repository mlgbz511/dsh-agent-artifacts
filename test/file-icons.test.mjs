import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');

function block(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `${startMarker} block is present`);
  return source.slice(start + startMarker.length, end);
}

const icons = new Function(`return {${block('const FILE_ICONS = {', '\n    };')}};`)();
const FILE_ICON_MAP = new Function(`return {${block('const FILE_ICON_MAP = {', '\n    };')}};`)();
const FILE_NAME_RULES = new Function(`return [${block('const FILE_NAME_RULES = [', '\n    ];')}];`)();
const resolveStart = source.indexOf('    // #region icon-resolve');
const resolveEnd = source.indexOf('    // #endregion icon-resolve');
assert.ok(resolveStart >= 0 && resolveEnd > resolveStart, 'resolver region is marked');
const resolveFileIcon = new Function('FILE_ICON_MAP', 'FILE_NAME_RULES', 'FILE_ICONS',
  `${source.slice(resolveStart, resolveEnd)}\nreturn resolveFileIcon;`)(FILE_ICON_MAP, FILE_NAME_RULES, icons);
const fileIconOf = (path, overrides) => {
  const resolved = resolveFileIcon(path, overrides || [], icons);
  return resolved ? resolved.icon : null;
};

test('every mapped icon exists in the vendored set', () => {
  assert.ok(Object.keys(icons).length >= 40);
  for (const [ext, id] of Object.entries(FILE_ICON_MAP)) {
    assert.ok(icons[id], `${ext} -> missing icon ${id}`);
  }
  const nameIcons = FILE_NAME_RULES.map(([, id]) => id);
  for (const id of nameIcons) assert.ok(icons[id], `name rule -> missing icon ${id}`);
});

test('special filenames win over extensions', () => {
  assert.equal(fileIconOf('README.md'), 'readme');
  assert.equal(fileIconOf('LICENSE'), 'license');
  assert.equal(fileIconOf('package.json'), 'nodejs');
  assert.equal(fileIconOf('tsconfig.json'), 'typescript');
  assert.equal(fileIconOf('.gitignore'), 'git');
  assert.equal(fileIconOf('Dockerfile'), 'docker');
  assert.equal(fileIconOf('pnpm-lock.yaml'), 'lock');
  assert.equal(fileIconOf('Makefile'), 'makefile');
  assert.equal(fileIconOf('C:\\demo\\notes.md'), 'markdown');
  assert.equal(fileIconOf('flow.mmd'), 'mermaid');
  assert.equal(fileIconOf('unknown.bin'), null);
});

test('icon payload stays under budget and parses as svg', () => {
  let total = 0;
  for (const [id, svg] of Object.entries(icons)) {
    assert.ok(svg.startsWith('<svg'), id);
    assert.ok(svg.includes('viewBox'), id);
    assert.ok(!/<script|on\w+\s*=|\bjavascript:/i.test(svg), `${id} must stay inert`);
    total += svg.length;
  }
  assert.ok(total < 80 * 1024, `payload ${total} within 80 KB`);
});

test('custom overrides follow path > name > ext precedence', () => {
  const regionStart = source.indexOf('    // #region icon-resolve');
  const regionEnd = source.indexOf('    // #endregion icon-resolve');
  assert.ok(regionStart >= 0 && regionEnd > regionStart, 'resolver region is marked');
  const region = source.slice(regionStart, regionEnd);
  const resolve = new Function('FILE_ICON_MAP', 'FILE_NAME_RULES', 'FILE_ICONS',
    `${region}\nreturn resolveFileIcon;`)(FILE_ICON_MAP, FILE_NAME_RULES, icons);
  const path = 'C:\\demo\\README.md';

  assert.deepEqual(resolve('notes.md', [], icons), { icon: 'markdown', source: 'extension' });
  assert.deepEqual(resolve('README.md', [], icons), { icon: 'readme', source: 'special' });
  assert.deepEqual(resolve('README.md', [{ level: 'name', match: 'readme.md', icon: 'python' }], icons),
    { icon: 'python', source: 'name' }, 'name override beats built-in special name');
  assert.deepEqual(resolve('notes.md', [{ level: 'ext', match: '.MD', icon: 'react' }], icons),
    { icon: 'react', source: 'ext' }, 'extension override normalizes case and dot');
  assert.deepEqual(resolve(path, [
    { level: 'ext', match: '.md', icon: 'react' },
    { level: 'name', match: 'readme.md', icon: 'python' },
    { level: 'path', match: path, icon: 'pdf' },
  ], icons), { icon: 'pdf', source: 'path' }, 'path override wins');
  assert.deepEqual(resolve('README.md', [{ level: 'name', match: 'readme.md', icon: 'missing' }], icons),
    { icon: 'readme', source: 'special' }, 'unknown icon id is skipped');
  assert.deepEqual(resolve('app.log', [], icons), { icon: 'document', source: 'extension' }, 'log maps to document');
});

test('vendored icon files match the inlined ids', () => {
  const dir = new URL('../vendor/material-icons/', import.meta.url);
  const files = fs.readdirSync(dir).filter((name) => name.endsWith('.svg')).map((name) => name.slice(0, -4)).sort();
  assert.deepEqual(Object.keys(icons).sort(), files);
});
