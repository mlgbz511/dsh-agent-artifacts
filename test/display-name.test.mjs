import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const block = source.match(/const DATE_PREFIX = [\s\S]*?function displayArtifactName[\s\S]*?\n    }/);
assert.ok(block, 'display helper exists');
const make = (stripDatePrefix) => new Function('prefs', block[0] + '\nreturn { stripDatePrefix, displayArtifactName };')({ stripDatePrefix });

test('date prefixes are removed only when a real remainder exists', () => {
  const api = make(true);
  assert.equal(api.stripDatePrefix('2026-11-16_hover.md'), 'hover.md');
  assert.equal(api.stripDatePrefix('2026-11-16-hover.md'), 'hover.md');
  assert.equal(api.stripDatePrefix('20261116_hover.md'), 'hover.md');
  assert.equal(api.stripDatePrefix('2026-11-16.md'), '2026-11-16.md');
  assert.equal(api.stripDatePrefix('2026-11-16'), '2026-11-16');
  assert.equal(api.stripDatePrefix('notes_2026-11-16.md'), 'notes_2026-11-16.md');
});

test('the display switch only changes the rendered name', () => {
  assert.equal(make(true).displayArtifactName({ name: '2026-11-16_hover.md' }), 'hover.md');
  assert.equal(make(false).displayArtifactName({ name: '2026-11-16_hover.md' }), '2026-11-16_hover.md');
  assert.ok(source.includes("prefs.stripDatePrefix !== false"));
});
