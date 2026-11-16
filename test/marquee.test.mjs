import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');

test('all five artifact views use the hover marquee name', () => {
  for (const className of ['dsa-name', 'dsa-tileName', 'dsa-iconName', 'dsa-contentName']) {
    assert.ok(source.includes(`h(MarqueeName, { className: '${className}'`), className + ' uses MarqueeName');
  }
  assert.ok(source.includes("className: 'dsa-name', text: displayFileName(item.name)"));
});

test('marquee only runs for overflowing names after a short delay', () => {
  assert.ok(source.includes('const overflow = inner.scrollWidth - box.clientWidth;'));
  assert.ok(source.includes('if (overflow <= 2) return;'));
  assert.ok(source.includes('}, 180);'));
  assert.ok(source.includes("Math.max(1.4, Math.min(5, overflow / 38))"));
});

test('marquee respects reduced motion and ping-pongs', () => {
  assert.ok(source.includes('animation:dsa-name-marquee var(--dsa-dur,2s) ease-in-out infinite alternate'));
  assert.ok(source.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(source.includes('.dsa-marqueeOn .dsa-marqueeInner{animation:none;transform:none}'));
});


test('icon names are single-line ellipsis before hover', () => {
  assert.ok(source.includes('.dsa-marqueeName.dsa-iconName{display:flex;align-items:center;justify-content:center;height:1.7em;width:100%}'));
  assert.ok(source.includes('.dsa-marqueeName.dsa-iconName .dsa-marqueeInner{display:block;-webkit-line-clamp:unset;white-space:nowrap;'));
});


test('icon marquee starts at the first character', () => {
  assert.ok(source.includes('.dsa-marqueeName.dsa-iconName.dsa-marqueeOn{justify-content:flex-start}'));
  assert.ok(source.includes('.dsa-marqueeName.dsa-iconName.dsa-marqueeOn .dsa-marqueeInner{text-align:left}'));
});
