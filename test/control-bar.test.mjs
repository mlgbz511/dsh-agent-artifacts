import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');

test('the compact control bar keeps five views and three groupings', () => {
  const group = source.match(/const GROUP_ICONS = \{([\s\S]*?)\n    \};/);
  const view = source.match(/const VIEW_ICONS = \{([\s\S]*?)\n    \};/);
  assert.ok(group, 'GROUP_ICONS exists');
  assert.ok(view, 'VIEW_ICONS exists');
  assert.deepEqual([...group[1].matchAll(/^      (\w+):/gm)].map((match) => match[1]), ['purpose', 'file', 'session']);
  assert.deepEqual([...view[1].matchAll(/^      (\w+):/gm)].map((match) => match[1]), ['details', 'list', 'tiles', 'icons', 'content']);
});

test('the control bar is sticky and icon buttons expose labels', () => {
  assert.ok(source.includes("'.dsa-controls{position:sticky;top:0;"));
  assert.ok(source.includes("className: 'dsa-iconSegBtn'"));
  assert.ok(source.includes("className: 'dsa-iconSegBtn', title: label, 'aria-label': label"));
  assert.ok(source.includes("className: 'dsa-segLine'"));
  assert.ok(!source.includes("className: 'dsa-viewBtn'"), 'text view buttons are gone');
  assert.ok(!source.includes("className: 'dsa-groupByBtn'"), 'text group buttons are gone');
});


test('sticky group headers stay opaque and clear of table column headers', () => {
  assert.ok(source.includes('.dsa-groupToggle{width:100%;border:0;background:var(--dsw-alias-bg-base);color:inherit;font:inherit;height:36px;'));
  assert.ok(source.includes('.dsa-dtable th{position:sticky;top:36px;'));
  assert.ok(source.includes('.dsa-group{position:sticky;top:0;z-index:2;'));
});
