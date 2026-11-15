import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const start = source.indexOf('    // #region kind-model');
const end = source.indexOf('    // #endregion kind-model');
assert.ok(start >= 0 && end > start, 'kind model region is marked');
const { normalizeArtifactKinds, normalizeKindIcons, mergeKindDefinitions, bucketItems, MAX_ARTIFACT_KINDS } = new Function(`${source.slice(start, end)}
return { normalizeArtifactKinds, normalizeKindIcons, mergeKindDefinitions, bucketItems, MAX_ARTIFACT_KINDS };`)();

test('custom artifact kinds normalize, dedupe and cap', () => {
  const value = normalizeArtifactKinds([
    { id: 'custom-notes', label: '  笔记  ', icon: 'markdown', tone: '#c06b8d' },
    { id: 'custom-notes', label: '重复', icon: 'document' },
    { id: 'plan', label: '内置不可改' },
    { id: 'bad id', label: '空格' },
    { id: 'custom-empty', label: '   ' },
    { id: 'custom-x', label: 'x', tone: 'red' },
  ]);
  assert.deepEqual(value, [
    { id: 'custom-notes', label: '笔记', icon: 'markdown', tone: '#c06b8d', custom: true },
    { id: 'custom-x', label: 'x', icon: 'document', tone: '#3aa88f', custom: true },
  ]);
  const many = Array.from({ length: 30 }, (_, index) => ({ id: 'custom-' + index, label: 'T' + index }));
  assert.equal(normalizeArtifactKinds(many).length, MAX_ARTIFACT_KINDS);
});

test('kind icons only keep known ids', () => {
  const valid = new Set(['plan', 'custom-notes']);
  assert.deepEqual(normalizeKindIcons({ plan: 'readme', 'custom-notes': 'markdown', nope: 'code', plan2: '' }, valid), {
    plan: 'readme', 'custom-notes': 'markdown',
  });
});

test('custom kinds merge without replacing built-ins', () => {
  const merged = mergeKindDefinitions(
    [{ id: 'plan' }, { id: 'code' }],
    [{ id: 'custom-notes' }, { id: 'plan' }],
  );
  assert.deepEqual(merged.map((kind) => kind.id), ['plan', 'code', 'custom-notes']);
});

test('bucketItems follows the requested order and appends unknowns', () => {
  const items = [{ k: 'b' }, { k: 'a' }, { k: 'z' }, { k: 'a' }];
  const buckets = bucketItems(items, (item) => item.k, ['a', 'b']);
  assert.deepEqual(buckets.map((bucket) => bucket.key), ['a', 'b', 'z']);
  assert.equal(buckets[0].items.length, 2);
});
