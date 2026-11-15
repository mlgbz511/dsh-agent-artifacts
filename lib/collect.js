/** 会话日志 → 工件列表：纯函数，不碰磁盘、不依赖宿主类型。 */
import path from 'node:path';
import { ARTIFACT_KIND_IDS, UNTAGGED, displayDir, displayName, isAbsolutePath, isSensitive, normalizeKind, typeOf } from './classify.js';

/** 只有这些工具的成功结果才算「agent 生成的文件」。 */
export const WRITE_TOOLS = new Set([
  'write', 'edit', 'apply_patch', 'str_replace_editor',
  'ops_write_file', 'ops_edit_file', 'ops_move', 'ops_copy',
]);

const CATEGORY_VALUES = new Set([...ARTIFACT_KIND_IDS, UNTAGGED]);

/** 显式登记工具：参数即事实，不需要 meta.path。 */
export const REGISTER_TOOLS = new Set(['register_artifact']);

const KEY_CASE_INSENSITIVE = process.platform === 'win32';

function keyOf(fsPath) {
  const normalized = path.normalize(fsPath).replace(/[\\/]+$/, '');
  return KEY_CASE_INSENSITIVE ? normalized.toLowerCase() : normalized;
}

function resolveRecorded(input, cwd) {
  if (typeof input !== 'string' || input.trim() === '') return undefined;
  if (input.includes('\0')) return undefined;
  if (isAbsolutePath(input)) return path.normalize(input);
  if (!cwd) return undefined;
  return path.normalize(path.resolve(cwd, input));
}

function foldTitle(events, header) {
  let title = undefined;
  for (const event of events) {
    if (event.type !== 'session/title') continue;
    const value = event.data && event.data.title;
    if (typeof value === 'string' && value.trim() !== '') title = value.trim();
  }
  if (title) return title;
  if (header && header.cwd) return displayName(header.cwd);
  return '未命名会话';
}

function parseArguments(raw) {
  if (typeof raw !== 'string' || raw.length > 65536) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * @param {readonly {type:string, seq:number, time:number, data:any}[]} events 已按 seq 升序
 * @param {{id:string, cwd?:string, createdAt?:number}} header
 */
export function collectArtifacts(events, header) {
  const title = foldTitle(events, header);
  const sessionId = header && header.id;
  const cwd = header && header.cwd;
  const calls = new Map();
  for (const event of events) {
    if (event.type !== 'tool/call') continue;
    const data = event.data || {};
    calls.set(data.callId, { name: data.name, args: parseArguments(data.arguments), turn: data.turn });
  }

  const entries = new Map();
  const add = (candidate) => {
    const fsPath = resolveRecorded(candidate.path, cwd);
    if (!fsPath || isSensitive(fsPath)) return;
    const key = keyOf(fsPath);
    const existing = entries.get(key);
    if (!existing) {
      entries.set(key, {
        path: fsPath,
        name: displayName(fsPath),
        dir: displayDir(fsPath),
        type: typeOf(fsPath),
        category: (() => {
          const normalized = normalizeKind(candidate.category);
          return normalized && CATEGORY_VALUES.has(normalized) ? normalized : UNTAGGED;
        })(),
        kind: candidate.kind,
        origin: 'agent',
        description: candidate.description,
        sessionId,
        sessionTitle: title,
        firstTime: candidate.time,
        time: candidate.time,
        turn: candidate.turn,
        seq: candidate.seq,
        occurrences: 1,
        history: [{ kind: candidate.kind, time: candidate.time, turn: candidate.turn, seq: candidate.seq, sessionId }],
      });
      return;
    }
    existing.occurrences += 1;
    existing.time = Math.max(existing.time, candidate.time);
    if (candidate.description) existing.description = candidate.description;
    if (candidate.kind === 'delivered') existing.kind = 'delivered';
    existing.history.push({ kind: candidate.kind, time: candidate.time, turn: candidate.turn, seq: candidate.seq, sessionId });
  };

  for (const event of events) {
    if (event.type === 'deliverables/presented') {
      const data = event.data || {};
      const files = Array.isArray(data.files) ? data.files : [];
      for (const file of files) {
        if (!file || typeof file.path !== 'string') continue;
        const description = typeof file.description === 'string' && file.description.trim() !== ''
          ? file.description.trim() : undefined;
        add({ path: file.path, kind: 'delivered', description, turn: data.turn, seq: event.seq, time: event.time });
      }
      continue;
    }
    // PTC（run_code）里的工具调用只发 tool/ptc-dispatch：name 是真实工具，arguments 已是对象。
    if (event.type === 'tool/ptc-dispatch') {
      const data = event.data || {};
      if (data.isError) continue;
      const args = data.arguments && typeof data.arguments === 'object' ? data.arguments : undefined;
      const root = calls.get(data.rootCallId);
      if (REGISTER_TOOLS.has(data.name)) {
        if (!args || typeof args.path !== 'string') continue;
        add({ path: args.path, kind: 'delivered', description: args.description, category: args.category, turn: root && root.turn, seq: event.seq, time: event.time });
        continue;
      }
      if (!WRITE_TOOLS.has(data.name)) continue;
      const recorded = args && (args.file_path || args.path);
      if (typeof recorded !== 'string') continue;
      add({ path: recorded, kind: 'produced', turn: root && root.turn, seq: event.seq, time: event.time });
      continue;
    }
    if (event.type !== 'tool/result') continue;
    const data = event.data || {};
    if (data.error || (data.message && data.message.isError)) continue;
    const callId = (data.message && data.message.toolCallId) || data.toolCallId;
    const call = calls.get(callId);
    if (!call) continue;
    if (REGISTER_TOOLS.has(call.name)) {
      const args = call.args || {};
      if (typeof args.path !== 'string') continue;
      add({ path: args.path, kind: 'delivered', description: args.description, category: args.category, turn: call.turn ?? data.turn, seq: event.seq, time: event.time });
      continue;
    }
    if (!WRITE_TOOLS.has(call.name)) continue;
    const metaPath = data.meta && typeof data.meta === 'object' ? data.meta.path : undefined;
    const argumentPath = call.args && (call.args.file_path || call.args.path);
    const recorded = typeof metaPath === 'string' && isAbsolutePath(metaPath) ? metaPath
      : typeof argumentPath === 'string' && isAbsolutePath(argumentPath) ? argumentPath
        : undefined;
    if (!recorded) continue;
    add({ path: recorded, kind: 'produced', turn: data.turn, seq: event.seq, time: event.time });
  }

  const artifacts = [...entries.values()].sort((left, right) => right.time - left.time || left.name.localeCompare(right.name));
  return { title, artifacts };
}
