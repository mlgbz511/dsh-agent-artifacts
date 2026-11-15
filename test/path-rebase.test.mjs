import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_PATH_REWRITES, rebaseArtifact, rebaseArtifactPath } from '../lib/path-rebase.js';

const rewrites = [['E:\\old\\plugin', 'E:\\new\\plugin']];

test('rewrites only known roots and only when the new file exists', () => {
  assert.equal(rebaseArtifactPath('E:\\old\\plugin\\docs\\a.md', rewrites, () => true), 'E:\\new\\plugin\\docs\\a.md');
  assert.equal(rebaseArtifactPath('E:\\old\\plugin\\docs\\a.md', rewrites, () => false), 'E:\\old\\plugin\\docs\\a.md', 'missing target stays');
  assert.equal(rebaseArtifactPath('E:\\old\\other\\a.md', rewrites, () => true), 'E:\\old\\other\\a.md', 'other roots stay');
  assert.equal(rebaseArtifactPath('E:\\old\\plugin2\\a.md', rewrites, () => true), 'E:\\old\\plugin2\\a.md', 'prefix boundary');
});

test('artifact metadata follows the rebased path', () => {
  const artifact = { path: 'E:\\old\\plugin\\docs\\a.md', name: 'a.md', dir: 'E:\\old\\plugin\\docs', kind: 'produced' };
  const next = rebaseArtifact(artifact, rewrites, () => true);
  assert.equal(next.path, 'E:\\new\\plugin\\docs\\a.md');
  assert.equal(next.name, 'a.md');
  assert.equal(next.dir, 'E:\\new\\plugin\\docs');
  assert.equal(next.kind, 'produced');
  assert.equal(rebaseArtifact(artifact, rewrites, () => false), artifact);
});

test('default rewrite points the old install at the workspace copy', () => {
  assert.deepEqual(DEFAULT_PATH_REWRITES, [['C:\demo\workspace\\dsh-agent-artifacts', 'C:\demo\workspace']]);
});
