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
const region = source.slice(source.indexOf('    // #region type-groups'), source.indexOf('    // #endregion type-groups'));
const api = new Function('FILE_ICON_MAP', 'FILE_ICONS', 'language', `${region}
return { defaultTypeGroups, normalizeTypeGroups, resolveTypeGroup, typeIconOf, migrateIconOverrides };`)(FILE_ICON_MAP, icons, 'zh');

test('default groups cover the vendored icon set with unique formats', () => {
  const groups = api.defaultTypeGroups('zh');
  assert.equal(groups.length, Object.keys(icons).length);
  const ids = new Set();
  const extensions = new Set();
  for (const group of groups) {
    assert.ok(icons[group.icon], `${group.id} icon exists`);
    assert.ok(group.label.trim() !== '', `${group.id} label`);
    assert.ok(!ids.has(group.id));
    ids.add(group.id);
    for (const extension of group.extensions) {
      assert.ok(!extensions.has(extension), `${extension} owned once`);
      extensions.add(extension);
    }
  }
  assert.equal(extensions.size, Object.keys(FILE_ICON_MAP).length);
});

test('resolution prefers special names, then extensions, then falls back', () => {
  assert.equal(api.typeIconOf('README.md'), 'readme');
  assert.equal(api.typeIconOf('package.json'), 'nodejs');
  assert.equal(api.typeIconOf('C:\\demo\\notes.md'), 'markdown');
  assert.equal(api.typeIconOf('demo.mp3'), 'audio');
  assert.equal(api.typeIconOf('weird.bin'), null);
  assert.equal(api.typeIconOf('tsconfig.json'), 'typescript');
  assert.equal(api.typeIconOf('tsconfig.build.json'), 'typescript');
  assert.equal(api.typeIconOf('LICENSE.md'), 'license');
  assert.equal(api.typeIconOf('docker-compose.yaml'), 'docker');
  assert.equal(api.resolveTypeGroup('README.md').source, 'special');
  assert.equal(api.resolveTypeGroup('demo.mp3').source, 'extension');
  assert.equal(api.resolveTypeGroup('weird.bin').source, 'fallback');
});

test('normalization drops bad icons and keeps extensions globally unique', () => {
  const groups = api.normalizeTypeGroups([
    { id: 'a', label: 'A', icon: 'markdown', extensions: ['.md', 'MD'], specials: ['README*'] },
    { id: 'b', label: 'B', icon: 'image', extensions: ['md', 'png'], specials: ['README*'] },
    { id: 'c', label: 'C', icon: 'missing', extensions: ['x'] },
    { id: 'a', label: 'Dup', icon: 'audio', extensions: ['mp3'] },
  ], 'zh');
  assert.equal(groups.length, 3);
  assert.deepEqual(groups[0].extensions, ['md']);
  assert.deepEqual(groups[0].specials, ['README*']);
  assert.deepEqual(groups[1].extensions, ['png']);
  assert.deepEqual(groups[1].specials, []);
  assert.equal(groups[2].id, 'audio-2', 'duplicate id falls back to a fresh id');
  assert.equal(groups[2].label, 'Dup');
});

test('migration moves old extension and name overrides into type groups', () => {
  const value = {
    iconOverrides: [
      { level: 'ext', match: '.foo', icon: 'python' },
      { level: 'name', match: 'README.md', icon: 'readme' },
      { level: 'path', match: 'C:\\demo\\x.md', icon: 'markdown' },
    ],
  };
  assert.equal(api.migrateIconOverrides(value), true);
  assert.deepEqual(value.iconOverrides, []);
  const python = value.fileTypes.find((group) => group.icon === 'python');
  assert.ok(python.extensions.includes('foo'));
  const readme = value.fileTypes.find((group) => group.icon === 'readme');
  assert.ok(readme.specials.includes('README.md'));
  assert.equal(api.migrateIconOverrides(value), false, 'already migrated');
});
