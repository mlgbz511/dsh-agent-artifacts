/**
 * Host half of dsh-agent-artifacts.
 * 只读：把会话日志里的 deliverables/presented 与成功的写盘工具结果汇总成工件列表，
 * 通过 connection.fetch 暴露一个本机 JSON 接口给浏览器半边。无第三方依赖。
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { collectArtifacts, REGISTER_TOOLS } from './lib/collect.js';
import { scanWorkspace } from './lib/scan.js';
import { rebaseArtifact } from './lib/path-rebase.js';
import { ARTIFACT_KIND_IDS, UNTAGGED, isAbsolutePath, isImage, isSensitive, isTextLike, normalizeKind } from './lib/classify.js';
import { gitInfo, gitShow, gitVersions } from './lib/git-history.js';

const ENDPOINT = '/api/dsh-agent-artifacts';
const CACHE_TTL_MS = 15_000;
const MAX_SESSIONS = 40;
const MAX_ITEMS = 400;
const MAX_GIT_PATHS = 100;
const GIT_CONCURRENCY = 6;
const PREVIEW_BYTES = 200 * 1024;
const IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_BODY = 64 * 1024;
const HOST_VERSION = (() => {
  try {
    return JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version || null;
  } catch {
    return null;
  }
})();

const IMAGE_MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp',
  gif: 'image/gif', bmp: 'image/bmp', avif: 'image/avif', ico: 'image/x-icon',
};

const cache = new Map();
const inflight = new Map();
const scanCache = new Map();
const SCAN_TTL_MS = 30_000;

function json(value, status = 200) {
  return Response.json(value, {
    status,
    headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
  });
}

function ok(data) {
  return json({ ok: true, data });
}

function fail(code, message, status = 400) {
  return json({ ok: false, error: { code, message } }, status);
}

const WINDOWS = process.platform === 'win32';

function norm(value) {
  const normalized = path.normalize(String(value)).replace(/[\\/]+$/, '');
  return WINDOWS ? normalized.toLowerCase() : normalized;
}

function encodeId(sessionId, artifactPath) {
  return Buffer.from(JSON.stringify({ s: sessionId, p: artifactPath }), 'utf8').toString('base64url');
}

function sortItems(items, sort) {
  const list = [...items];
  if (sort === 'name') return list.sort((left, right) => left.name.localeCompare(right.name));
  if (sort === 'time-asc') return list.sort((left, right) => left.time - right.time);
  if (sort === 'size') return list.sort((left, right) => (right.size || 0) - (left.size || 0));
  return list.sort((left, right) => right.time - left.time);
}

function matchesQuery(artifact, query) {
  if (typeof query !== 'string' || query === '') return true;
  const needle = query.toLowerCase();
  return artifact.path.toLowerCase().includes(needle)
    || artifact.name.toLowerCase().includes(needle)
    || String(artifact.description || '').toLowerCase().includes(needle)
    || String(artifact.sessionTitle || '').toLowerCase().includes(needle);
}

function decodeId(id) {
  if (typeof id !== 'string' || id.length > 4096) return undefined;
  try {
    const parsed = JSON.parse(Buffer.from(id, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed.p !== 'string' || typeof parsed.s !== 'string') return undefined;
    if (!isAbsolutePath(parsed.p)) return undefined;
    if (isSensitive(parsed.p)) return undefined;
    return { sessionId: parsed.s, path: path.normalize(parsed.p) };
  } catch {
    return undefined;
  }
}

async function statOf(fsPath) {
  try {
    const stat = await fs.promises.stat(fsPath);
    return { exists: true, isDirectory: stat.isDirectory(), size: stat.size, mtime: stat.mtimeMs };
  } catch {
    return { exists: false, size: 0, mtime: 0 };
  }
}

function readSessionArtifacts(sessionQuery, sessionId) {
  const cached = cache.get(sessionId);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return Promise.resolve(cached.value);
  const pending = inflight.get(sessionId);
  if (pending) return pending;
  const task = (async () => {
    try {
      const snapshot = await sessionQuery.readSession(sessionId);
      const collected = collectArtifacts(snapshot.events, snapshot.session);
      const value = {
        title: collected.title,
        artifacts: collected.artifacts.map((artifact) => rebaseArtifact({ ...artifact, sessionId, sessionTitle: collected.title })),
      };
      cache.set(sessionId, { at: Date.now(), value });
      return value;
    } catch (error) {
      cache.set(sessionId, { at: Date.now(), value: { title: '无法读取的会话', artifacts: [], error: String(error && error.message || error) } });
      return cache.get(sessionId).value;
    } finally {
      inflight.delete(sessionId);
    }
  })();
  inflight.set(sessionId, task);
  return task;
}

function scanCached(root) {
  const cached = scanCache.get(root);
  if (cached && Date.now() - cached.at < SCAN_TTL_MS) return cached.promise;
  const promise = scanWorkspace(root);
  scanCache.set(root, { at: Date.now(), promise });
  promise.catch(() => scanCache.delete(root));
  return promise;
}

function scanArtifacts(scan) {
  return scan.files.map((file) => ({
    path: file.path,
    name: file.path.split(/[\\/]+/).filter(Boolean).pop() || file.path,
    dir: file.path.slice(0, Math.max(file.path.lastIndexOf('\\'), file.path.lastIndexOf('/'))),
    type: file.type,
    category: file.category,
    kind: 'workspace',
    origin: 'workspace',
    sessionId: undefined,
    sessionTitle: undefined,
    firstTime: file.mtime,
    time: file.mtime,
    occurrences: 1,
    history: [],
    scanned: true,
  }));
}

function listRecentSessions(sessionQuery) {
  return sessionQuery.listSessions().then((records) => {
    const sorted = [...records].sort((left, right) => (right.header.createdAt ?? 0) - (left.header.createdAt ?? 0));
    return sorted.slice(0, MAX_SESSIONS);
  });
}

async function buildWorkspace(sessionQuery, workspace) {
  const records = await listRecentSessions(sessionQuery);
  const cwds = new Map();
  for (const record of records) {
    const cwd = record.header.cwd;
    if (typeof cwd === 'string' && cwd !== '') cwds.set(norm(cwd), cwd);
  }
  const wanted = typeof workspace === 'string' && workspace !== '' ? norm(workspace) : undefined;
  const selected = wanted ? records.filter((record) => typeof record.header.cwd === 'string' && norm(record.header.cwd) === wanted) : records;
  const scanRoot = selected[0]?.header.cwd;
  const sessions = [];
  const merged = new Map();
  for (const record of selected) {
    const result = await readSessionArtifacts(sessionQuery, record.header.id);
    sessions.push({
      id: record.header.id,
      title: result.title,
      cwd: record.header.cwd,
      createdAt: record.header.createdAt,
      count: result.artifacts.length,
      error: result.error,
    });
    for (const artifact of result.artifacts) {
      const key = norm(artifact.path);
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, {
          ...artifact,
          sessionId: record.header.id,
          sessionTitle: result.title,
          sessions: [{ id: record.header.id, title: result.title, time: artifact.time }],
          occurrences: artifact.occurrences,
        });
        continue;
      }
      existing.occurrences += artifact.occurrences;
      existing.time = Math.max(existing.time, artifact.time);
      if (artifact.time >= existing.time && artifact.description) existing.description = artifact.description;
      if (artifact.kind === 'delivered') existing.kind = 'delivered';
      existing.sessions.push({ id: record.header.id, title: result.title, time: artifact.time });
    }
  }
  let scan = undefined;
  if (typeof scanRoot === 'string' && scanRoot !== '' && fs.existsSync(scanRoot)) {
    try {
      const result = await scanCached(scanRoot);
      let added = 0;
      for (const artifact of scanArtifacts(result)) {
        const key = norm(artifact.path);
        if (merged.has(key)) continue;
        merged.set(key, artifact);
        added += 1;
      }
      scan = { root: scanRoot, count: added, truncated: result.truncated };
    } catch (error) {
      scan = { root: scanRoot, count: 0, truncated: false, error: String(error && error.message || error) };
    }
  }
  return {
    artifacts: [...merged.values()],
    meta: { sessions, workspaces: [...cwds.values()], scan, truncated: records.length >= MAX_SESSIONS },
  };
}

async function buildSession(sessionQuery, sessionId, includeScan = false) {
  if (typeof sessionId !== 'string' || sessionId === '') return undefined;
  const result = await readSessionArtifacts(sessionQuery, sessionId);
  let record;
  try {
    const records = await sessionQuery.listSessions();
    record = records.find((candidate) => candidate.header.id === sessionId);
  } catch {
    record = undefined;
  }
  const artifacts = [...result.artifacts];
  let scan = undefined;
  const root = record && record.header.cwd;
  if (includeScan && typeof root === 'string' && root !== '' && fs.existsSync(root)) {
    try {
      const known = new Set(artifacts.map((artifact) => norm(artifact.path)));
      const since = record.header.createdAt && Number.isFinite(record.header.createdAt) ? record.header.createdAt - 60_000 : 0;
      const scanned = await scanCached(root);
      let added = 0;
      for (const artifact of scanArtifacts(scanned)) {
        if (known.has(norm(artifact.path))) continue;
        if (artifact.time < since) continue;
        artifacts.push({ ...artifact, sessionId, sessionTitle: result.title });
        added += 1;
      }
      scan = { root, count: added, truncated: scanned.truncated };
    } catch (error) {
      scan = { root, count: 0, truncated: false, error: String(error && error.message || error) };
    }
  }
  return {
    artifacts,
    meta: {
      sessions: [{ id: sessionId, title: result.title, cwd: record && record.header.cwd, createdAt: record && record.header.createdAt, count: result.artifacts.length, error: result.error }],
      workspaces: record && typeof record.header.cwd === 'string' ? [record.header.cwd] : [],
      scan,
      truncated: false,
    },
  };
}
async function listItems(sessionQuery, payload) {
  const scope = payload.scope === 'session' ? 'session' : 'workspace';
  const built = scope === 'session'
    ? await buildSession(sessionQuery, payload.sessionId, payload.scan === true)
    : await buildWorkspace(sessionQuery, payload.workspace);
  if (!built) return { error: fail('E_NO_SESSION', '缺少会话 id') };

  const kind = payload.kind === 'delivered' || payload.kind === 'produced' || payload.kind === 'workspace' ? payload.kind : undefined;
  const type = typeof payload.type === 'string' && payload.type !== '' && payload.type !== 'all' ? payload.type : undefined;
  const hideCode = payload.hideCode === true;
  const policy = payload.policy === 'explicit' ? 'explicit' : 'writes';
  const filtered = built.artifacts.filter((artifact) => (policy !== 'explicit' || artifact.kind === 'delivered')
    && (!kind || artifact.kind === kind)
    && (!type || artifact.type === type)
    && (!hideCode || (artifact.type !== 'code' && artifact.type !== 'config'))
    && matchesQuery(artifact, typeof payload.query === 'string' ? payload.query.trim().slice(0, 200) : ''));
  const sorted = sortItems(filtered, payload.sort).slice(0, MAX_ITEMS);

  const offset = Number.isInteger(payload.offset) && payload.offset > 0 ? payload.offset : 0;
  const limit = Number.isInteger(payload.limit) && payload.limit > 0 ? Math.min(payload.limit, 100) : 60;
  const page = sorted.slice(offset, offset + limit);

  const stats = await Promise.all(page.map((artifact) => statOf(artifact.path)));
  const items = page.map((artifact, index) => {
    const stat = stats[index];
    const { history, sessions, ...rest } = artifact;
    return {
      ...rest,
      category: normalizeKind(artifact.category) || UNTAGGED,
      gitPending: true,
      sessionId: artifact.sessionId,
      id: encodeId(scope === 'session' ? String(artifact.sessionId || payload.sessionId || '') : '', artifact.path),
      exists: stat.exists && !stat.isDirectory,
      size: stat.size,
      mtime: stat.mtime,
      sessions: sessions ? sessions.slice(0, 12) : undefined,
    };
  });

  const types = [...new Set(filtered.map((artifact) => artifact.type))].sort();
  return {
    items,
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
    facets: {
      types,
      delivered: filtered.filter((a) => a.kind === 'delivered').length,
      produced: filtered.filter((a) => a.kind === 'produced').length,
      workspace: filtered.filter((a) => a.kind === 'workspace').length,
    },
    meta: { ...built.meta, version: HOST_VERSION, policy },
  };
}

async function readGitBatch(payload) {
  const requested = Array.isArray(payload.paths) ? payload.paths : [];
  const paths = [];
  const seen = new Set();
  for (const raw of requested) {
    if (typeof raw !== 'string' || !isAbsolutePathLike(raw) || isSensitive(raw)) continue;
    const key = path.resolve(raw).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    paths.push(raw);
    if (paths.length >= MAX_GIT_PATHS) break;
  }
  const git = {};
  let cursor = 0;
  const worker = async () => {
    while (cursor < paths.length) {
      const value = paths[cursor++];
      git[value] = await gitInfo(value).catch(() => null);
    }
  };
  await Promise.all(Array.from({ length: Math.min(GIT_CONCURRENCY, paths.length) }, worker));
  return { git };
}

async function readDetail(sessionQuery, payload) {
  const decoded = decodeId(payload.id);
  if (!decoded) return { error: fail('E_BAD_ID', '无效的工件 id') };

  let artifact;
  if (decoded.sessionId === '') {
    const built = await buildWorkspace(sessionQuery, payload.workspace);
    artifact = built.artifacts.find((candidate) => norm(candidate.path) === norm(decoded.path));
  } else {
    // 详情不受面板「显示其他对话工件」开关影响：点开已列出的扫描项时仍要能解析。
    const built = await buildSession(sessionQuery, decoded.sessionId, true);
    artifact = built && built.artifacts.find((candidate) => norm(candidate.path) === norm(decoded.path));
  }
  if (!artifact) return { error: fail('E_NOT_FOUND', '工件不在当前索引里') };
  if (isSensitive(artifact.path)) return { error: fail('E_SENSITIVE', '敏感文件不可预览', 403) };

  const stat = await statOf(artifact.path);
  if (!stat.exists || stat.isDirectory) {
    return { item: { ...artifact, exists: false, category: normalizeKind(artifact.category) || UNTAGGED }, preview: { missing: true } };
  }
  const git = await gitInfo(artifact.path).catch(() => null);
  const fact = { ...artifact, category: normalizeKind(artifact.category) || UNTAGGED, git, exists: true, size: stat.size, mtime: stat.mtime };

  const extension = artifact.path.split('.').pop()?.toLowerCase() ?? '';
  if (isImage(artifact.path) && stat.size <= IMAGE_BYTES) {
    const bytes = await fs.promises.readFile(artifact.path);
    const mime = IMAGE_MIME[extension] ?? 'application/octet-stream';
    return { item: fact, preview: { image: 'data:' + mime + ';base64,' + bytes.toString('base64'), bytes: stat.size } };
  }
  if (isTextLike(artifact.path)) {
    const handle = await fs.promises.open(artifact.path, 'r');
    try {
      const length = Math.min(stat.size, PREVIEW_BYTES);
      const buffer = Buffer.alloc(length);
      await handle.read(buffer, 0, length, 0);
      const text = buffer.toString('utf8');
      return { item: fact, preview: { text, truncated: stat.size > PREVIEW_BYTES, bytes: stat.size } };
    } finally {
      await handle.close();
    }
  }
  return { item: fact, preview: { binary: true, bytes: stat.size } };
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

function hostParts(value) {
  const text = String(value || '').toLowerCase();
  if (text.startsWith('[')) {
    const end = text.indexOf(']');
    return [text.slice(0, end + 1), end >= 0 ? text.slice(end + 2) : ''];
  }
  const index = text.lastIndexOf(':');
  return index > 0 ? [text.slice(0, index), text.slice(index + 1)] : [text, ''];
}

/** 同源判定：Host 头优先；localhost/127.0.0.1 在同端口时视为同源。 */
function sameOrigin(origin, request) {
  let parsed;
  try { parsed = new URL(origin); } catch { return false; }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
  const hostHeader = request.headers.get('host');
  let requestHost = hostHeader || '';
  if (requestHost === '') {
    try { requestHost = new URL(request.url).host; } catch { return false; }
  }
  const [originHost, originPort] = hostParts(parsed.host);
  const [requestName, requestPort] = hostParts(requestHost);
  if (originHost === requestName && originPort === requestPort) return true;
  return LOOPBACK_HOSTS.has(originHost) && LOOPBACK_HOSTS.has(requestName) && originPort === requestPort;
}

const ARTIFACT_CATEGORIES = ARTIFACT_KIND_IDS;

export const ARTIFACT_TOOL = {
  name: 'register_artifact',
  description: 'Register a file as an artifact of this Session: it appears under the finished turn and in the Artifacts sidebar page, with an optional description and category. Use it for files produced outside write/edit (for example by Bash), and for plans, walkthroughs, design notes, prototypes, and screenshots. It records the path; it does not create the file. Prefer present for final deliverables.',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'File path, absolute or relative to the session workspace.' },
      description: { type: 'string', description: 'One short line describing the artifact.' },
      category: { type: 'string', enum: ARTIFACT_CATEGORIES, description: 'Required review purpose: plan, walkthrough, change, diagram, evidence, preview, document, code, other. Choose by how a human should review the file, not by file format.' },
    },
    required: ['path', 'category'],
    additionalProperties: false,
  },
  output: {
    schema: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        category: { type: 'string' },
        registered: { type: 'boolean' },
      },
      required: ['path', 'category', 'registered'],
      additionalProperties: false,
    },
    render(args, value) {
      const category = value && value.category ? '（' + value.category + '）' : '';
      return [{ type: 'text', text: '已登记工件 ' + String(value && value.path || '') + category }];
    },
  },
  async execute(args) {
    const path = args && typeof args.path === 'string' ? args.path.trim() : '';
    if (path === '') throw new Error('path 不能为空');
    if (path.includes('\0')) throw new Error('path 含非法字符');
    if (isSensitive(path)) throw new Error('敏感文件不可登记');
    const category = args && ARTIFACT_CATEGORIES.includes(args.category) ? args.category : UNTAGGED;
    if (args && args.description !== undefined && typeof args.description !== 'string') throw new Error('description 必须是字符串');
    return { path, category, registered: true };
  },
};

const PROMPT_TEXT = 'Artifacts: every file you deliver or produce is tracked under the finished turn and in the Artifacts sidebar page. Call register_artifact for files created outside write/edit (for example by Bash) and for plans, walkthroughs, design notes, previews, and screenshots, so the user can find them there. Always pass category (plan, walkthrough, change, diagram, evidence, preview, document, code, other): it is the review purpose, not the file format.';

function registerAgentSurface(ctx, scope) {
  scope.effect(() => scope.tools.register(ARTIFACT_TOOL));
  scope.effect(() => scope.systemPrompt.section({ name: 'agent-artifacts', order: 9100, text: PROMPT_TEXT }));
}

function isAbsolutePathLike(value) {
  return typeof value === 'string' && (path.isAbsolute(value) || /^[a-z]:[\\/]/i.test(value));
}

function launchDetached(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true });
    child.once('error', reject);
    child.once('spawn', () => {
      child.unref();
      resolve();
    });
  });
}

async function revealInExplorer(filePath) {
  const stat = await statOf(filePath);
  if (!stat.exists || stat.isDirectory) throw new Error('文件不存在');
  const target = path.resolve(filePath);
  if (process.platform === 'win32') {
    // cmd start 让 Explorer 在交互桌面启动；windowsHide 只藏 cmd 控制台，不藏 Explorer。
    await launchDetached('cmd.exe', ['/c', 'start', '', 'explorer.exe', '/select,' + target]);
  } else {
    const command = process.platform === 'darwin' ? 'open' : 'xdg-open';
    await launchDetached(command, [path.dirname(target)]);
  }
  return { revealed: true };
}

function registerEndpoint(scope) {
  return scope.effect(() => scope.connection.fetch.register({
    path: ENDPOINT,
    methods: ['POST'],
    requestBody: 'buffered',
    async fetch(request) {
      if (request.headers.get('x-dsh-agent-artifacts') !== '1') {
        return fail('E_FORBIDDEN', '工件接口只接受 Harness 页面请求', 403);
      }
      // Web UI 经普通浏览器访问时会带 Origin；Host 可能是 localhost 或 127.0.0.1。
      const origin = request.headers.get('origin');
      if (origin && !sameOrigin(origin, request)) {
        return fail('E_FORBIDDEN', '工件接口拒绝跨站请求', 403);
      }
      if (!request.headers.get('content-type')?.startsWith('application/json')) {
        return fail('E_UNSUPPORTED_MEDIA', '需要 application/json', 415);
      }
      try {
        const body = await request.text();
        if (body.length > MAX_BODY) return fail('E_TOO_LARGE', '请求体过大', 413);
        const payload = JSON.parse(body) ?? {};
        const sessionQuery = scope.sessionQuery;
        switch (payload.operation) {
          case 'status':
            return ok({ endpoint: ENDPOINT, cachedSessions: cache.size, cacheTtlMs: CACHE_TTL_MS, maxSessions: MAX_SESSIONS });
          case 'items': {
            const result = await listItems(sessionQuery, payload);
            return result.error ?? ok(result);
          }
          case 'git': {
            return ok(await readGitBatch(payload));
          }
          case 'detail': {
            const result = await readDetail(sessionQuery, payload);
            return result.error ?? ok(result);
          }
          case 'versions': {
            if (typeof payload.path !== 'string' || !isAbsolutePathLike(payload.path)) {
              return fail('E_BAD_PATH', '需要绝对路径');
            }
            if (isSensitive(payload.path)) return fail('E_SENSITIVE', '敏感文件不可读取', 403);
            return ok(await gitVersions(payload.path));
          }
          case 'version': {
            if (typeof payload.path !== 'string' || !isAbsolutePathLike(payload.path)) {
              return fail('E_BAD_PATH', '需要绝对路径');
            }
            if (isSensitive(payload.path)) return fail('E_SENSITIVE', '敏感文件不可读取', 403);
            if (typeof payload.commit !== 'string') return fail('E_BAD_COMMIT', '需要提交 id');
            try {
              return ok(await gitShow(payload.path, payload.commit));
            } catch (error) {
              return fail('E_GIT', String(error && error.message || error));
            }
          }
          case 'reveal': {
            if (typeof payload.path !== 'string' || !isAbsolutePathLike(payload.path)) {
              return fail('E_BAD_PATH', '需要绝对路径');
            }
            if (isSensitive(payload.path)) return fail('E_SENSITIVE', '敏感文件不可定位', 403);
            try {
              return ok(await revealInExplorer(payload.path));
            } catch (error) {
              return fail('E_REVEAL', String(error && error.message || error));
            }
          }
          case 'refresh':
            cache.clear();
            scanCache.clear();
            return ok({ cleared: true });
          default:
            return fail('E_BAD_OPERATION', '未知操作');
        }
      } catch (error) {
        return fail('E_INTERNAL', String(error && error.message || error), 500);
      }
    },
  }));
}

export function apply(ctx) {
  ctx.inject({ connection: true, sessionQuery: true }, (scope) => registerEndpoint(scope));
  ctx.inject({ tools: true, systemPrompt: true }, (scope) => registerAgentSurface(ctx, scope));
}
