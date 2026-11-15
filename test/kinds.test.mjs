import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { ARTIFACT_KIND_IDS, categoryOf, normalizeKind } from '../lib/classify.js';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const match = source.match(/const KINDS = (\[[\s\S]*?\n    \]);/);
assert.ok(match, 'client KINDS table is present');
const KINDS = new Function(`return ${match[1]};`)();

test('client kind table matches the host kind ids', () => {
  assert.deepEqual(KINDS.map((kind) => kind.id), [...ARTIFACT_KIND_IDS, 'untagged']);
  assert.equal(new Set(KINDS.map((kind) => kind.id)).size, KINDS.length);
  for (const kind of KINDS) {
    assert.ok(['deliverable', 'visual', 'page', 'file'].includes(kind.group), `unknown group ${kind.group}`);
  }
});

test('every kind has zh/en labels and descriptions', () => {
  const zhStart = source.indexOf('      zh: {');
  const enStart = source.indexOf('      en: {');
  assert.ok(zhStart > 0 && enStart > zhStart, 'locale blocks are present');
  const zhBlock = source.slice(zhStart, enStart);
  const enBlock = source.slice(enStart, source.indexOf('    };', enStart));
  for (const kind of KINDS) {
    for (const key of [kind.labelKey, kind.descriptionKey]) {
      assert.match(zhBlock, new RegExp(`\\b${key}: '`), `${key} needs zh text`);
      assert.match(enBlock, new RegExp(`\\b${key}: '`), `${key} needs en text`);
    }
  }
});

test('legacy category ids normalize into the new kind table', () => {
  assert.equal(normalizeKind('prototype'), 'preview');
  assert.equal(normalizeKind('interactive'), 'preview');
  assert.equal(normalizeKind('diff'), 'change');
  assert.equal(normalizeKind('screenshot'), 'evidence');
  assert.equal(normalizeKind('recording'), 'evidence');
  assert.equal(normalizeKind('design'), 'document');
  assert.equal(normalizeKind('task'), 'document');
  assert.equal(normalizeKind('plan'), 'plan');
  for (const legacy of ['prototype', 'interactive', 'diff', 'screenshot', 'recording', 'design', 'task']) {
    assert.ok(ARTIFACT_KIND_IDS.includes(normalizeKind(legacy)));
  }
});

test('host classification stays inside the kind table', () => {
  const samples = {
    'implementation_plan.md': 'plan',
    'walkthrough.md': 'walkthrough',
    'changes.diff': 'change',
    'flow.mmd': 'diagram',
    'shot.png': 'evidence',
    'demo.webm': 'evidence',
    'index.html': 'preview',
    'report.pdf': 'document',
    'server.py': 'code',
    'notes.bin': 'other',
  };
  for (const [file, expected] of Object.entries(samples)) {
    assert.equal(categoryOf(file), expected, file);
    assert.ok(ARTIFACT_KIND_IDS.includes(categoryOf(file)), `${file} must map to a known kind`);
  }
});
