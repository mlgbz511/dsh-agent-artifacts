import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { scanWorkspace } from '../lib/scan.js';

function workspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-scan-'));
  const write = (relative, content = 'x') => {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
  };
  write('report.md');
  write('docs/implementation_plan.md');
  write('docs/notes.txt');
  write('assets/shot.png');
  write('prototype/index.html');
  write('script.py');
  write('schema.json');
  write('node_modules/pkg/readme.md');
  write('.cache/keep.md');
  write('.env');
  write('docs/certs/server.pem');
  write('.dsh/sessions/x/session.json');
  write('.gemini/knowledge/x.md');
  return root;
}

test('scan collects documents, images and prototypes only', async () => {
  const root = workspace();
  const result = await scanWorkspace(root);
  const names = result.files.map((file) => path.relative(root, file.path).split(path.sep).join('/')).sort();
  assert.ok(names.includes('report.md'));
  assert.ok(names.includes('docs/implementation_plan.md'));
  assert.ok(names.includes('docs/notes.txt'));
  assert.ok(names.includes('assets/shot.png'));
  assert.ok(names.includes('prototype/index.html'));
  assert.ok(names.some((name) => name.endsWith('readme.md')) === false, 'node_modules is skipped');
  assert.ok(names.some((name) => name.endsWith('.cache/keep.md')) === false, 'dot directories are skipped');
  assert.ok(names.some((name) => name.endsWith('.env')) === false, 'sensitive names are skipped');
  assert.ok(names.some((name) => name.endsWith('.pem')) === false, 'sensitive extensions are skipped');
  assert.ok(names.includes('script.py') === false, 'source code is not an artifact');
  assert.ok(names.some((name) => name.startsWith('.dsh/')) === false, 'tool session dirs are skipped');
  assert.ok(names.some((name) => name.startsWith('.gemini/')) === false, 'tool data dirs are skipped');
  assert.ok(names.includes('schema.json') === false, 'config files are not artifacts');
  const plan = result.files.find((file) => file.path.endsWith('implementation_plan.md'));
  assert.equal(plan.category, 'document', 'workspace files never get deliverable kinds');
  assert.equal(plan.type, 'doc');
  assert.equal(result.truncated, false);
});

test('scan respects the entry cap', async () => {
  const root = workspace();
  const result = await scanWorkspace(root, { maxResults: 2 });
  assert.equal(result.files.length, 2);
  assert.equal(result.truncated, true);
});
