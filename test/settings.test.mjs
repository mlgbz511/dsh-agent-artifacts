import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const kindStart = source.indexOf('    // #region kind-model');
const kindEnd = source.indexOf('    // #endregion kind-model');
assert.ok(kindStart >= 0 && kindEnd > kindStart, 'kind model region is marked');
const start = source.indexOf('    // #region prefs');
const end = source.indexOf('    // #endregion prefs');
assert.ok(start >= 0 && end > start, 'prefs region is marked');
const region = source.slice(kindStart, kindEnd) + '\n' + source.slice(start, end);
const { defaultPrefs, normalizePrefs, readLegacyPrefs } = new Function(`${region}\nreturn { defaultPrefs, normalizePrefs, readLegacyPrefs };`)();

test('default prefs cover every field', () => {
  const value = defaultPrefs();
  assert.equal(value.v, 1);
  assert.deepEqual(value.entries, { rail: false, guide: true, turnTail: false, sessionView: false });
  assert.equal(value.scan, false);
  assert.equal(value.hideCodeDefault, true);
  assert.deepEqual(value.hiddenKinds, []);
  assert.deepEqual(value.iconOverrides, []);
  assert.equal(value.view, 'details');
  assert.equal(value.font, 'md');
  assert.equal(value.showPath, false);
  assert.deepEqual(value.sort, { key: 'time', dir: -1 });
  assert.equal(value.density, 'comfortable');
  assert.equal(value.settingsTab, 'entry');
  assert.equal(value.pathScope, 'workspace');
  assert.equal(value.groupBy, 'purpose');
  assert.deepEqual(value.collapsedGroups, []);
  assert.deepEqual(value.artifactKinds, []);
  assert.deepEqual(value.kindIcons, {});
  assert.notEqual(defaultPrefs().entries, value.entries, 'defaults are fresh objects');
});

test('normalize drops invalid values and keeps valid ones', () => {
  const value = normalizePrefs({
    entries: { rail: true, guide: 'yes', turnTail: false },
    view: 'nope', font: 'xl', showPath: true,
    hiddenKinds: ['code', 'code', 7, '', 'other'],
    sort: { key: 'name', dir: 1 },
    density: 'compact', settingsTab: 'display', pathScope: 'all',
    groupBy: 'bogus', artifactKinds: [{ id: 'custom-notes', label: '笔记', icon: 'markdown', tone: '#c06b8d' }],
    kindIcons: { plan: 'readme', 'custom-notes': 'markdown', nope: 'code' },
  });
  assert.equal(value.entries.rail, true);
  assert.equal(value.entries.guide, true, 'invalid entry falls back to default');
  assert.equal(value.entries.turnTail, false);
  assert.equal(value.view, 'details');
  assert.equal(value.font, 'xl');
  assert.equal(value.showPath, true);
  assert.deepEqual(value.hiddenKinds, ['code', 'other']);
  assert.deepEqual(value.sort, { key: 'name', dir: 1 });
  assert.equal(value.density, 'compact');
  assert.equal(value.settingsTab, 'display');
  assert.equal(value.pathScope, 'all');
  assert.equal(value.groupBy, 'purpose', 'invalid grouping falls back to artifact type');
  assert.equal(value.artifactKinds.length, 1);
  assert.deepEqual(value.kindIcons, { plan: 'readme', 'custom-notes': 'markdown' });
});

test('icon overrides normalize, dedupe and cap at 200', () => {
  const value = normalizePrefs({
    iconOverrides: [
      { level: 'ext', match: 'FOO', icon: 'python' },
      { level: 'ext', match: '.foo', icon: 'react' },
      { level: 'name', match: 'README.md', icon: 'readme' },
      { level: 'path', match: 'C:\\demo\\a.md', icon: 'markdown' },
      { level: 'bogus', match: 'x', icon: 'python' },
      { level: 'ext', match: '', icon: 'python' },
      { level: 'ext', match: '.bar', icon: 42 },
    ],
  });
  assert.deepEqual(value.iconOverrides, [
    { level: 'ext', match: '.foo', icon: 'python' },
    { level: 'name', match: 'readme.md', icon: 'readme' },
    { level: 'path', match: 'C:\\demo\\a.md', icon: 'markdown' },
  ]);
  const many = Array.from({ length: 205 }, (_, index) => ({ level: 'ext', match: '.x' + index, icon: 'python' }));
  assert.equal(normalizePrefs({ iconOverrides: many }).iconOverrides.length, 200);
});

test('legacy keys migrate into the unified prefs', () => {
  const store = new Map([
    ['dsh-agent-artifacts-locations', JSON.stringify({ rail: true, guide: false, turnTail: true, sessionView: false })],
    ['dsh-agent-artifacts-scan', 'on'],
    ['dsh-agent-artifacts-show-path', 'on'],
    ['dsh-agent-artifacts-view-mode', 'tiles'],
    ['dsh-agent-artifacts-font-size', 'lg'],
    ['dsh-agent-artifacts-hidden-kinds', JSON.stringify(['code', 'missing-kind'])],
  ]);
  const storage = { getItem: (key) => (store.has(key) ? store.get(key) : null) };
  const legacy = readLegacyPrefs(storage);
  assert.equal(legacy.saw, true);
  assert.deepEqual(legacy.prefs.entries, { rail: true, guide: false, turnTail: true, sessionView: false });
  assert.equal(legacy.prefs.scan, true);
  assert.equal(legacy.prefs.showPath, true);
  assert.equal(legacy.prefs.view, 'tiles');
  assert.equal(legacy.prefs.font, 'lg');
  assert.deepEqual(legacy.prefs.hiddenKinds, ['code', 'missing-kind']);
  assert.ok(legacy.snapshot.locations);
});

test('legacy editable type table maps disabled entries to hidden kinds', () => {
  const storage = { getItem: (key) => key === 'dsh-agent-artifacts-types'
    ? JSON.stringify([{ id: 'plan', enabled: false }, { id: 'custom-x', enabled: false }, { id: 'code', enabled: true }])
    : null };
  const legacy = readLegacyPrefs(storage);
  assert.deepEqual(legacy.prefs.hiddenKinds, ['plan', 'custom-x']);
});

test('client version matches package.json', () => {
  const match = source.match(/const PLUGIN_VERSION = '([^']+)';/);
  assert.ok(match, 'PLUGIN_VERSION exists');
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(match[1], pkg.version);
});
