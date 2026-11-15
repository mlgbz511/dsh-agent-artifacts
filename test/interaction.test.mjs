import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const start = source.indexOf('    // #region interaction');
const end = source.indexOf('    // #endregion interaction');
assert.ok(start >= 0 && end > start, 'interaction region is marked');
const { clampMenuPosition, nextSortValue, defaultDirection } = new Function(`${source.slice(start, end)}
return { clampMenuPosition, nextSortValue, defaultDirection };`)();

test('menu clamps into the viewport', () => {
  assert.deepEqual(clampMenuPosition(1000, 800, 190, 148, 500, 400), { left: 302, top: 244 });
  assert.deepEqual(clampMenuPosition(-20, -20, 190, 148, 500, 400), { left: 8, top: 8 });
});

test('sorting cycles default, reversed, then restores the fallback', () => {
  const fallback = { key: 'time', dir: -1 };
  assert.equal(defaultDirection('time'), -1);
  assert.equal(defaultDirection('name'), 1);

  assert.deepEqual(nextSortValue({ key: 'time', dir: -1 }, 'name', 0, fallback), { key: 'name', dir: 1 });
  assert.deepEqual(nextSortValue({ key: 'name', dir: 1 }, 'name', 1, fallback), { key: 'name', dir: -1 });
  assert.deepEqual(nextSortValue({ key: 'name', dir: -1 }, 'name', 2, fallback), fallback);
});

test('the version column is not sortable', () => {
  assert.ok(source.includes("const sortable = id !== 'source' && id !== 'version';"));
});
