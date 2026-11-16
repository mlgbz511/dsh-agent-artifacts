import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const block = source.match(/function relativeDisplayPath[\s\S]*?function displayPathOf[\s\S]*?\n    }/);
assert.ok(block, 'path helper exists');
const make = (pathDisplay) => new Function('prefs', block[0] + '\nreturn { relativeDisplayPath, displayPathOf };')({ pathDisplay });

test('paths inside the workspace become relative with forward slashes', () => {
  const api = make('relative');
  assert.equal(api.relativeDisplayPath('E:\\workSpace\\proj\\docs\\a.md', 'E:\\workSpace\\proj'), 'docs/a.md');
  assert.equal(api.relativeDisplayPath('E:/workSpace/proj/README.md', 'E:/workSpace/proj/'), 'README.md');
  assert.equal(api.relativeDisplayPath('e:\\WORKSPACE\\proj\\src\\a.js', 'E:\\workSpace\\proj'), 'src/a.js');
});

test('outside paths and full mode keep the absolute path', () => {
  const api = make('relative');
  const outside = 'D:\\other\\a.md';
  assert.equal(api.relativeDisplayPath(outside, 'E:\\workSpace\\proj'), outside);
  assert.equal(make('full').displayPathOf({ path: 'E:\\workSpace\\proj\\a.md' }, 'E:\\workSpace\\proj'), 'E:\\workSpace\\proj\\a.md');
  assert.equal(api.relativeDisplayPath('E:\\workSpace\\proj\\a.md', ''), 'E:\\workSpace\\proj\\a.md');
});

test('all five views and detail use the shared display path', () => {
  assert.ok(source.includes("h('span', { className: 'dsa-path' }, displayPathOf(item, workspaceRoot))"));
  assert.ok(source.includes("h('span', { className: 'dsa-listPath' }, displayPathOf(item, workspaceRoot))"));
  assert.ok(source.includes("h('span', { className: 'dsa-tileDesc' }, showPath ? displayPathOf(item, workspaceRoot)"));
  assert.ok(source.includes("h('span', { className: 'dsa-iconPath' }, displayPathOf(item, workspaceRoot))"));
  assert.ok(source.includes("h('span', { className: 'dsa-contentDesc' }, showPath ? displayPathOf(item, workspaceRoot)"));
  assert.ok(source.includes("item ? displayPathOf(item, root) : ''"));
});
