import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const start = source.indexOf('    // #region workspace-scope');
const end = source.indexOf('    // #endregion workspace-scope');
assert.ok(start >= 0 && end > start, 'workspace scope region is marked');
const { normalizePathKey, isInsideWorkspace } = new Function(`${source.slice(start, end)}
return { normalizePathKey, isInsideWorkspace };`)();

test('paths inside the workspace pass, outside paths fail', () => {
  const root = 'C:\\demo\\workspace';
  assert.equal(isInsideWorkspace('C:\\demo\\workspace\\a.md', root), true);
  assert.equal(isInsideWorkspace('C:/demo/workspace/docs/plans/a.md', root), true);
  assert.equal(isInsideWorkspace('C:\\demo\\workspace', root), true);
  assert.equal(isInsideWorkspace('C:\\demo\\workspace2\\a.md', root), false, 'prefix trap');
  assert.equal(isInsideWorkspace('D:\\elsewhere\\a.md', root), false);
});

test('windows paths compare case-insensitively and empty root matches all', () => {
  const root = 'C:\\Demo\\Workspace';
  assert.equal(isInsideWorkspace('c:\\demo\\workspace\\a.md', root), true);
  assert.equal(normalizePathKey('C:\\a\\b\\'), 'c:/a/b');
  assert.equal(isInsideWorkspace('C:\\anything', ''), true);
});
