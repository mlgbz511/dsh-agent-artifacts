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
const typeRegion = source.slice(source.indexOf('    // #region type-groups'), source.indexOf('    // #endregion type-groups'));
const tableRegion = source.slice(source.indexOf('    // #region table-columns'), source.indexOf('    // #endregion table-columns'));
const api = new Function('FILE_ICON_MAP', 'FILE_ICONS', 'language', `${typeRegion}\n${tableRegion}
return { defaultTypeGroups, defaultTableColumns, normalizeTableColumns, displayFileName, typeTagOf, sourceTagOf };`)(FILE_ICON_MAP, icons, 'zh');

test('table columns default to name, kind, source, time', () => {
  const value = api.defaultTableColumns();
  assert.deepEqual(value.order, ['name', 'kind', 'version', 'source', 'time']);
  assert.deepEqual(value.hidden, ['source'], 'origin column is hidden by default');
  assert.equal(value.widths.name, 240);
  assert.equal(value.widths.version, 74);
  assert.equal(value.widths.time, 124);
});

test('column normalization fills, clamps and keeps one visible', () => {
  const value = api.normalizeTableColumns({
    order: ['time', 'bogus', 'name', 'time'],
    hidden: ['time', 'kind', 'name', 'source', 'nope'],
    widths: { name: 10, time: 9999, kind: 112 },
  });
  assert.deepEqual(value.order, ['time', 'version', 'name', 'kind', 'source']);
  assert.equal(value.widths.name, 150, 'clamped to min');
  assert.equal(value.widths.time, 600, 'clamped to max');
  assert.equal(value.widths.kind, 112);
  assert.ok(value.order.some((id) => !value.hidden.includes(id)), 'at least one visible');
  assert.equal(value.hidden.length, value.order.length - 1);
});

test('display name strips leading date prefixes only', () => {
  assert.equal(api.displayFileName('2026-11-15_file-type-groups.html'), 'file-type-groups.html');
  assert.equal(api.displayFileName('2026-11-15-file-type-groups.md'), 'file-type-groups.md');
  assert.equal(api.displayFileName('icon-mapping.md'), 'icon-mapping.md');
  assert.equal(api.displayFileName('notes_2026-11-15.md'), 'notes_2026-11-15.md');
  assert.equal(api.displayFileName('2026-11-15'), '2026-11-15');
});

test('type tag uses file type groups and source tag splits submit/scan', () => {
  const groups = api.defaultTypeGroups('zh');
  const readme = api.typeTagOf('README.md', groups);
  assert.equal(readme.group.id, 'readme');
  assert.equal(readme.tone.length, 2);
  assert.equal(api.typeTagOf('weird.bin', groups), null);
  assert.equal(api.sourceTagOf({ kind: 'workspace' }), 'scan');
  assert.equal(api.sourceTagOf({ kind: 'delivered' }), 'submit');
  assert.equal(api.sourceTagOf(null), 'submit');
});
