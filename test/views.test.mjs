import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');

test('tiles and content are disabled by default', () => {
  assert.ok(source.includes("DISABLEABLE_VIEWS = ['tiles', 'content']"));
  assert.ok(source.includes("disabledViews: ['tiles', 'content']"));
});

test('the view switcher and default-view select both filter disabled views', () => {
  assert.ok(source.includes("].filter(([key]) => !prefs.disabledViews.includes(key));"));
  assert.ok(source.includes(".filter(([id]) => !prefs.disabledViews.includes(id))"));
  assert.ok(source.includes("prefs.disabledViews.includes(next) ? 'details' : next"));
});

test('settings expose both view switches and fall back to details', () => {
  assert.ok(source.includes("label: t().viewTilesEnable"));
  assert.ok(source.includes("label: t().viewContentEnable"));
  assert.ok(source.includes("if (prefs.view === 'tiles') setPref('view', 'details')"));
  assert.ok(source.includes("if (prefs.view === 'content') setPref('view', 'details')"));
});
