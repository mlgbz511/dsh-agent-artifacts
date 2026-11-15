import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { apply } from '../index.js';

function fixture(files) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-'));
  const events = [
    { type: 'session/title', seq: 1, time: 100, data: { title: '测试会话' } },
    { type: 'deliverables/presented', seq: 2, time: 200, data: { turn: 1, files: files.map((file) => ({ path: file, description: '交付说明' })) } },
    { type: 'deliverables/presented', seq: 3, time: 300, data: { turn: 2, files: [{ path: path.join(cwd, '.env') }] } },
  ];
  return { cwd, events };
}

function harness(sessionId, cwd, events) {
  let route;
  const sessions = [
    { header: { id: sessionId, cwd, createdAt: 1 }, live: false, persisted: true },
    { header: { id: 'other', cwd: 'E:\\other', createdAt: 2 }, live: false, persisted: true },
  ];
  const sessionQuery = {
    async listSessions() { return sessions; },
    async readSession(id) {
      if (id !== sessionId) throw new Error('no session');
      return { session: { id, cwd, createdAt: 1 }, inheritedEventCount: 0, events };
    },
  };
  const toolNames = [];
  const scope = {
    connection: { fetch: { register(value) { route = value; return () => { route = undefined; }; } } },
    sessionQuery,
    effect(setup) { return setup(); },
    get(name) { return name === 'sessionQuery' ? sessionQuery : undefined; },
  };
  const agentScope = {
    tools: { register(definition) { toolNames.push('tool:' + definition.name); return () => {}; } },
    systemPrompt: { section(section) { toolNames.push('section:' + section.name); return () => {}; } },
    effect(setup) { return setup(); },
  };
  const deps = [];
  apply({
    inject(required, callback) {
      deps.push(Object.keys(required || {}).join(','));
      if (required && 'connection' in required) callback(scope);
      else if (required && 'tools' in required) callback(agentScope);
    },
  });
  assert.ok(route, 'route registered');
  assert.deepEqual(toolNames.sort(), ['section:agent-artifacts', 'tool:register_artifact']);
  assert.deepEqual(deps.sort(), ['connection,sessionQuery', 'tools,systemPrompt']);
  const call = (payload, headers = {}) => route.fetch(new Request('http://127.0.0.1/api/dsh-agent-artifacts', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-dsh-agent-artifacts': '1', ...headers },
    body: JSON.stringify(payload),
  }));
  return { call, route };
}

const { cwd, events } = fixture([]);
const textFile = path.join(cwd, 'report.md');
fs.writeFileSync(textFile, '# hello\nartifact body\n', 'utf8');

const sessionEvents = [
  events[0],
  { type: 'deliverables/presented', seq: 2, time: 200, data: { turn: 1, files: [{ path: textFile, description: '报告' }, { path: path.join(cwd, '.env') }] } },
];
const { call } = harness('s1', cwd, sessionEvents);

test('workspace items merge, sensitive excluded, session titles set', async () => {
  const response = await call({ operation: 'items', scope: 'workspace' });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.data.items.length, 1);
  const item = body.data.items[0];
  assert.equal(item.name, 'report.md');
  assert.equal(item.kind, 'delivered');
  assert.equal(item.description, '报告');
  assert.equal(item.exists, true);
  assert.equal(item.sessionTitle, '测试会话');
  assert.ok(item.size > 0);
});

test('items returns before git and marks the version cells pending', async () => {
  const response = await call({ operation: 'items', scope: 'session', sessionId: 's1' });
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.data.items[0].git, undefined);
  assert.equal(body.data.items[0].gitPending, true);
});

test('git batch resolves the requested paths and ignores relative paths', async () => {
  const response = await call({ operation: 'git', paths: [textFile, 'relative.md', path.join(cwd, '.env')] });
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.ok(Object.prototype.hasOwnProperty.call(body.data.git, textFile));
  assert.equal(Object.prototype.hasOwnProperty.call(body.data.git, 'relative.md'), false);
});

test('session scope only reads that session', async () => {
  const response = await call({ operation: 'items', scope: 'session', sessionId: 's1' });
  const body = await response.json();
  assert.equal(body.data.items.length, 1);
  assert.equal(body.data.meta.sessions.length, 1);
});

test('detail returns text preview for an existing artifact', async () => {
  const items = await (await call({ operation: 'items', scope: 'session', sessionId: 's1' })).json();
  const response = await call({ operation: 'detail', id: items.data.items[0].id, sessionId: 's1', workspace: cwd });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.match(body.data.preview.text, /artifact body/);
  assert.equal(body.data.item.exists, true);
});

test('detail refuses forged ids and unknown artifacts', async () => {
  const forged = Buffer.from(JSON.stringify({ s: 's1', p: 'C:\\Windows\\win.ini' })).toString('base64url');
  const body = await (await call({ operation: 'detail', id: forged, sessionId: 's1' })).json();
  assert.equal(body.ok, false);
  assert.equal(body.error.code, 'E_NOT_FOUND');
});

test('missing file is reported without reading it', async () => {
  const missing = path.join(cwd, 'gone.md');
  const local = harness('s2', cwd, [
    { type: 'deliverables/presented', seq: 1, time: 100, data: { turn: 1, files: [{ path: missing }] } },
  ]);
  const items = await (await local.call({ operation: 'items', scope: 'session', sessionId: 's2' })).json();
  const gone = items.data.items.find((item) => item.name === 'gone.md');
  assert.equal(gone.exists, false);
  const detail = await (await local.call({ operation: 'detail', id: gone.id, sessionId: 's2' })).json();
  assert.equal(detail.data.preview.missing, true);
});

test('endpoint rejects requests without the plugin header', async () => {
  const response = await call({ operation: 'status' }, { 'x-dsh-agent-artifacts': '0' });
  assert.equal(response.status, 403);
});

test('unknown operation is a client error', async () => {
  const body = await (await call({ operation: 'drop-tables' })).json();
  assert.equal(body.error.code, 'E_BAD_OPERATION');
});

test('workspace scope merges scanned files with session artifacts', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-root-'));
  fs.writeFileSync(path.join(root, 'report.md'), '# report\n', 'utf8');
  fs.writeFileSync(path.join(root, 'script.py'), 'print(1)\n', 'utf8');
  const local = harness('s3', root, [
    { type: 'deliverables/presented', seq: 1, time: 100, data: { turn: 1, files: [{ path: path.join(root, 'delivered.md') }] } },
  ]);
  fs.writeFileSync(path.join(root, 'delivered.md'), '# delivered\n', 'utf8');
  const body = await (await local.call({ operation: 'items', scope: 'workspace', workspace: root })).json();
  if (!body.data) console.error('BODY', JSON.stringify(body));
  const byName = new Map(body.data.items.map((item) => [item.name, item]));
  assert.equal(byName.get('report.md').kind, 'workspace');
  assert.equal(byName.get('delivered.md').kind, 'delivered');
  assert.equal(byName.has('script.py'), false, 'source code stays out');
  assert.ok(body.data.meta.scan);
  assert.equal(body.data.meta.scan.root, root);
  assert.ok(body.data.facets.workspace >= 1);
});

test('session scope scans its workspace and hides code/config by default', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-session-'));
  const write = (name) => fs.writeFileSync(path.join(root, name), '# x\n', 'utf8');
  write('report.md');
  write('notes.md');
  write('code.py');
  const produced = (name, callId) => [
    { type: 'tool/call', seq: 1, time: 100, data: { turn: 1, callId, name: 'write', arguments: JSON.stringify({ path: path.join(root, name) }) } },
    { type: 'tool/result', seq: 2, time: 110, data: { turn: 1, message: { toolCallId: callId }, meta: { path: path.join(root, name) } } },
  ];
  const local = harness('s5', root, [...produced('notes.md', 'w1'), ...produced('code.py', 'w2')]);
  const plain = await (await local.call({ operation: 'items', scope: 'session', sessionId: 's5' })).json();
  assert.equal(plain.data.items.map((item) => item.name).includes('report.md'), false, 'workspace scan is opt-in');

  const hidden = await (await local.call({ operation: 'items', scope: 'session', sessionId: 's5', hideCode: true, scan: true })).json();
  const hiddenNames = hidden.data.items.map((item) => item.name);
  assert.ok(hiddenNames.includes('report.md'), 'recent scanned document is included');
  assert.ok(hiddenNames.includes('notes.md'));
  assert.equal(hiddenNames.includes('code.py'), false, 'code is hidden by default');
  assert.equal(hiddenNames.includes('script.py'), false);
  const report = hidden.data.items.find((item) => item.name === 'report.md');
  const detail = await (await local.call({ operation: 'detail', id: report.id, sessionId: 's5' })).json();
  assert.equal(detail.ok, true, 'scanned artifacts carry a usable id');
  assert.equal(typeof detail.data.preview.text, 'string');

  const shown = await (await local.call({ operation: 'items', scope: 'session', sessionId: 's5', scan: true })).json();
  assert.ok(shown.data.items.map((item) => item.name).includes('code.py'), 'code returns when the filter is off');
});

test('same-origin browser requests pass, cross-site origins fail', async () => {
  const ok = await call({ operation: 'items', scope: 'workspace' }, { origin: 'http://127.0.0.1' });
  assert.equal(ok.status, 200, 'browser same-origin request is allowed');

  const cross = await call({ operation: 'items', scope: 'workspace' }, { origin: 'http://evil.example' });
  assert.equal(cross.status, 403);
  const body = await cross.json();
  assert.equal(body.error.code, 'E_FORBIDDEN');

  const noHeader = await harness('s1', cwd, sessionEvents).route.fetch(new Request('http://127.0.0.1/api/dsh-agent-artifacts', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://127.0.0.1' },
    body: JSON.stringify({ operation: 'items', scope: 'workspace' }),
  }));
  assert.equal(noHeader.status, 403, 'custom header is still required');
});

test('localhost and 127.0.0.1 on the same port count as same origin', async () => {
  const { route: localRoute } = harness('s1', cwd, sessionEvents);
  const ok = await localRoute.fetch(new Request('http://localhost:56092/api/dsh-agent-artifacts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-dsh-agent-artifacts': '1',
      origin: 'http://127.0.0.1:56092',
    },
    body: JSON.stringify({ operation: 'items', scope: 'workspace' }),
  }));
  assert.equal(ok.status, 200, 'loopback aliases with the same port are allowed');

  const otherPort = await localRoute.fetch(new Request('http://localhost:56092/api/dsh-agent-artifacts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-dsh-agent-artifacts': '1',
      origin: 'http://localhost:50470',
    },
    body: JSON.stringify({ operation: 'items', scope: 'workspace' }),
  }));
  assert.equal(otherPort.status, 403, 'different ports are different origins');
});

test('items report host version and honor strict policy', async () => {
  const version = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
  const wide = await (await call({ operation: 'items', scope: 'session', sessionId: 's1' })).json();
  assert.equal(wide.ok, true);
  assert.equal(wide.data.meta.version, version);

  const strict = await (await call({ operation: 'items', scope: 'session', sessionId: 's1', policy: 'explicit' })).json();
  assert.equal(strict.ok, true);
  assert.ok(strict.data.items.every((item) => item.kind === 'delivered'), 'strict keeps delivered items only');
});

test('reveal validates the path before touching Explorer', async () => {
  const relative = await call({ operation: 'reveal', path: 'report.md' });
  assert.equal(relative.status, 400, 'relative paths are rejected');

  const missing = await call({ operation: 'reveal', path: path.join(cwd, 'not-there.md') });
  const body = await missing.json();
  assert.equal(body.ok, false);
  assert.equal(body.error.code, 'E_REVEAL');
});
