import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const start = source.indexOf('    // #region provenance');
const end = source.indexOf('    // #endregion provenance');
assert.ok(start >= 0 && end > start, 'provenance region is marked');
const { provenanceOf } = new Function(`${source.slice(start, end)}
return { provenanceOf };`)();

test('provenance has four values', () => {
  assert.equal(provenanceOf({ kind: 'delivered', sessionId: 's1' }, 's1'), 'delivered');
  assert.equal(provenanceOf({ kind: 'produced', sessionId: 's1' }, 's1'), 'written');
  assert.equal(provenanceOf({ kind: 'workspace' }, 's1'), 'scan');
  assert.equal(provenanceOf({ kind: 'produced', sessionId: 'old' }, 's1'), 'other');
});

test('missing current session and unknown items fall back safely', () => {
  assert.equal(provenanceOf({ kind: 'delivered', sessionId: 's1' }, undefined), 'delivered');
  assert.equal(provenanceOf({ kind: 'produced', sessionId: 's1' }, undefined), 'written');
  assert.equal(provenanceOf(null, 's1'), 'written');
});
