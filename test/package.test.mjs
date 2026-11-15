import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyPackage } from '../scripts/verify-package.mjs';

test('the git source package is complete and importable', () => {
  const result = verifyPackage();
  assert.deepEqual(result.errors, []);
  assert.equal(result.ok, true);
  assert.equal(result.tracked, true, 'git tracking is visible in the repository');
});
