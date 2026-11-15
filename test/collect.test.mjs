import assert from 'node:assert/strict';
import test from 'node:test';
import { typeOf, isSensitive, extensionOf, categoryOf, workspaceCategoryOf } from '../lib/classify.js';
import { collectArtifacts } from '../lib/collect.js';

test('types', () => {
  assert.equal(typeOf('a/b/report.MD'), 'doc');
  assert.equal(typeOf('x.json'), 'config');
  assert.equal(typeOf('x.toml'), 'config');
  assert.equal(typeOf('x.yaml'), 'config');
  assert.equal(typeOf('x.svg'), 'vector');
  assert.equal(typeOf('x.pptx'), 'slides');
  assert.equal(typeOf('x.unknown'), 'other');
  assert.equal(extensionOf('C:\\a\\b.MD'), 'md');
  assert.equal(extensionOf('noext'), '');
});

test('sensitive paths', () => {
  assert.equal(isSensitive('C:\\w\\.env'), true);
  assert.equal(isSensitive('C:\\w\\.env.local'), true);
  assert.equal(isSensitive('C:\\w\\certs\\server.pem'), true);
  assert.equal(isSensitive('C:\demo\\.ssh\\id_rsa'), true);
  assert.equal(isSensitive('C:\\w\\normal.md'), false);
  assert.equal(isSensitive('C:\\w\\environment.md'), false);
});

function call(seq, time, callId, name, args) {
  return { type: 'tool/call', seq, time, data: { turn: 1, callId, name, arguments: JSON.stringify(args) } };
}
function result(seq, time, callId, meta, error) {
  return { type: 'tool/result', seq, time, data: { turn: 1, message: { toolCallId: callId, isError: error ? true : undefined }, meta, error } };
}

test('delivered wins over produced and metadata merges', () => {
  const events = [
    call(1, 100, 'c1', 'write', { file_path: 'E:/w/a.md' }),
    result(2, 110, 'c1', { path: 'E:/w/a.md' }),
    { type: 'deliverables/presented', seq: 3, time: 120, data: { turn: 1, files: [{ path: 'E:/w/a.md', description: '报告' }] } },
  ];
  const { title, artifacts } = collectArtifacts(events, { id: 's1', cwd: 'E:/w' });
  assert.equal(title, 'w');
  assert.equal(artifacts.length, 1);
  assert.equal(artifacts[0].kind, 'delivered');
  assert.equal(artifacts[0].description, '报告');
  assert.equal(artifacts[0].occurrences, 2);
  assert.equal(artifacts[0].history.length, 2);
});

test('failed writes and non-mutating tools are ignored', () => {
  const events = [
    call(1, 100, 'c1', 'write', { file_path: 'E:/w/bad.md' }),
    result(2, 110, 'c1', undefined, { name: 'Error', code: 'E' }),
    call(3, 120, 'c2', 'read', { file_path: 'E:/w/read.md' }),
    result(4, 130, 'c2', { path: 'E:/w/read.md' }),
  ];
  assert.equal(collectArtifacts(events, { id: 's1', cwd: 'E:/w' }).artifacts.length, 0);
});

test('relative paths resolve against cwd, absolute survive, sensitive excluded', () => {
  const events = [
    call(1, 100, 'c1', 'write', { file_path: 'notes/today.md' }),
    result(2, 110, 'c1', { path: 'notes/today.md' }),
  ];
  const { artifacts } = collectArtifacts(events, { id: 's1', cwd: 'C:\\demo' });
  assert.equal(artifacts.length, 0, 'relative recorded paths need an absolute argument to be trusted');

  const absolute = collectArtifacts([
    { type: 'deliverables/presented', seq: 1, time: 100, data: { turn: 1, files: [{ path: 'D:\\out\\a.png' }, { path: 'D:\\out\\.env' }] } },
  ], { id: 's1', cwd: 'C:\\demo' });
  assert.equal(absolute.artifacts.length, 1);
  assert.equal(absolute.artifacts[0].path, 'D:\\out\\a.png');
});

test('newest first and title folding', () => {
  const events = [
    { type: 'session/title', seq: 1, time: 100, data: { title: '旧标题' } },
    { type: 'deliverables/presented', seq: 2, time: 200, data: { turn: 1, files: [{ path: 'E:/w/1.md' }] } },
    { type: 'session/title', seq: 3, time: 300, data: { title: '新标题' } },
    { type: 'deliverables/presented', seq: 4, time: 400, data: { turn: 2, files: [{ path: 'E:/w/2.md' }] } },
  ];
  const { title, artifacts } = collectArtifacts(events, { id: 's1', cwd: 'E:/w' });
  assert.equal(title, '新标题');
  assert.deepEqual(artifacts.map((a) => a.name), ['2.md', '1.md']);
});

test('PTC dispatched writes become produced artifacts with the root call turn', () => {
  const events = [
    { type: 'tool/call', seq: 1, time: 100, data: { turn: 3, callId: 'c0', name: 'run_code', arguments: JSON.stringify({ code: 'x' }) } },
    { type: 'tool/ptc-dispatch', seq: 2, time: 110, data: { rootCallId: 'c0', name: 'ops_write_file', arguments: { path: 'docs/governance-map.md', content: '# x' }, isError: false } },
    { type: 'tool/ptc-dispatch', seq: 3, time: 120, data: { rootCallId: 'c0', name: 'ops_write_file', arguments: { path: 'docs/broken.md' }, isError: true } },
    { type: 'tool/ptc-dispatch', seq: 4, time: 130, data: { rootCallId: 'c0', name: 'ops_read_files', arguments: { path: 'docs/read.md' } } },
  ];
  const { artifacts } = collectArtifacts(events, { id: 's1', cwd: 'C:\\demo' });
  assert.equal(artifacts.length, 1);
  assert.equal(artifacts[0].path, 'C:\\demo\\docs\\governance-map.md');
  assert.equal(artifacts[0].turn, 3);
  assert.equal(artifacts[0].kind, 'produced');
  assert.equal(artifacts[0].origin, 'agent');
  assert.equal(artifacts[0].category, 'untagged', 'write without an explicit purpose is untagged');
});

test('artifact categories use purpose ids and legacy migration', () => {
  assert.equal(categoryOf('implementation_plan.md'), 'plan');
  assert.equal(categoryOf('walkthrough.md'), 'walkthrough');
  assert.equal(categoryOf('design-v3.md'), 'document');
  assert.equal(categoryOf('index.html'), 'preview');
  assert.equal(categoryOf('shot.png'), 'evidence');
  assert.equal(categoryOf('server.py'), 'code');
  assert.equal(categoryOf('report.md'), 'document');
  assert.equal(categoryOf('changes.diff'), 'change');
  assert.equal(categoryOf('flow.mmd'), 'diagram');
  assert.equal(workspaceCategoryOf('flow.mmd'), 'other', 'scanned diagrams are not agent diagrams');
  assert.equal(workspaceCategoryOf('implementation_plan.md'), 'document');
  assert.equal(workspaceCategoryOf('notes.py'), 'code');
  assert.equal(categoryOf('architecture.png'), 'diagram');
  assert.equal(categoryOf('demo.webm'), 'evidence');
});

test('register_artifact counts as delivered and overrides category', () => {
  const events = [
    { type: 'tool/call', seq: 1, time: 100, data: { turn: 4, callId: 'r1', name: 'register_artifact', arguments: JSON.stringify({ path: 'E:/w/notes.md', description: '走查记录', category: 'walkthrough' }) } },
    { type: 'tool/result', seq: 2, time: 110, data: { turn: 4, message: { toolCallId: 'r1' } } },
  ];
  const { artifacts } = collectArtifacts(events, { id: 's1', cwd: 'C:\demo' });
  assert.equal(artifacts.length, 1);
  assert.equal(artifacts[0].kind, 'delivered');
  assert.equal(artifacts[0].category, 'walkthrough');
  assert.equal(artifacts[0].description, '走查记录');
  assert.equal(artifacts[0].turn, 4);
});

test('register_artifact tool rejects sensitive paths', async () => {
  const { ARTIFACT_TOOL } = await import('../index.js');
  assert.equal(ARTIFACT_TOOL.name, 'register_artifact');
  const value = await ARTIFACT_TOOL.execute({ path: 'E:/w/plan.md', category: 'plan' });
  assert.deepEqual(value, { path: 'E:/w/plan.md', category: 'plan', registered: true });
  await assert.rejects(() => ARTIFACT_TOOL.execute({ path: 'E:/w/.env' }));
  await assert.rejects(() => ARTIFACT_TOOL.execute({ path: '   ' }));
});
