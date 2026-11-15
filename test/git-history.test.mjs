import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { clearGitCache, gitInfo, gitShow, gitVersions, repoRootOf } from '../lib/git-history.js';

function repo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-git-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'ignore' });
  git('init');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'Test');
  git('config', 'commit.gpgsign', 'false');
  return { root, git };
}

test('git info counts commits, marks dirty files and reads old revisions', async () => {
  const { root, git } = repo();
  const file = path.join(root, 'docs', 'notes.md');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, 'one\n');
  git('add', '.');
  git('commit', '-m', 'first');
  fs.writeFileSync(file, 'two\n');
  git('add', '.');
  git('commit', '-m', 'second');

  assert.equal(await repoRootOf(file), root, 'repo root is discovered');
  const clean = await gitInfo(file);
  assert.equal(clean.tracked, true);
  assert.equal(clean.dirty, false);
  assert.equal(clean.version, 2);

  fs.writeFileSync(file, 'working\n');
  clearGitCache();
  const dirty = await gitInfo(file);
  assert.equal(dirty.dirty, true, 'uncommitted change is marked');
  assert.equal(dirty.version, 2, 'uncommitted content is not a commit');

  const history = await gitVersions(file);
  assert.equal(history.commits.length, 2);
  assert.equal(history.commits[0].subject, 'first');
  assert.equal(history.commits[1].subject, 'second');
  const old = await gitShow(file, history.commits[0].hash);
  assert.equal(old.text, 'one\n');
});

test('non-git and untracked files have no history', async () => {
  const outside = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-plain-')), 'a.md');
  fs.writeFileSync(outside, 'x');
  assert.equal(await repoRootOf(outside), null);
  assert.equal(await gitInfo(outside), null);

  const { root } = repo();
  const untracked = path.join(root, 'draft.md');
  fs.writeFileSync(untracked, 'draft');
  const info = await gitInfo(untracked);
  assert.equal(info.tracked, false);
  assert.equal(info.version, 0);
  const history = await gitVersions(untracked);
  assert.deepEqual(history.commits, []);
});

test('invalid commits and paths outside the repo are rejected', async () => {
  const { root, git } = repo();
  const file = path.join(root, 'a.md');
  fs.writeFileSync(file, 'a');
  git('add', '.');
  git('commit', '-m', 'a');
  await assert.rejects(() => gitShow(file, 'not-a-commit'));
  await assert.rejects(() => gitShow(file, '../../etc/passwd'));
});
