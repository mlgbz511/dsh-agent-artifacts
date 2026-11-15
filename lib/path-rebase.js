import fs from 'node:fs';
import path from 'node:path';

/** 旧安装根 → 新安装根：历史会话里记录的还是旧绝对路径。 */
export const DEFAULT_PATH_REWRITES = [
  ['C:\demo\workspace\\dsh-agent-artifacts', 'C:\demo\workspace'],
];

function key(value) {
  return String(value || '').replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
}

export function rebaseArtifactPath(filePath, rewrites = DEFAULT_PATH_REWRITES, exists = (target) => {
  try { return fs.existsSync(target); } catch { return false; }
}) {
  const target = key(filePath);
  for (const [from, to] of rewrites) {
    const root = key(from);
    if (root === '' || !target.startsWith(root + '/')) continue;
    const candidate = to + String(filePath).slice(String(from).length);
    if (exists(candidate)) return candidate;
  }
  return filePath;
}

export function rebaseArtifact(artifact, rewrites, exists) {
  const next = rebaseArtifactPath(artifact.path, rewrites, exists);
  if (next === artifact.path) return artifact;
  return { ...artifact, path: next, name: path.basename(next), dir: path.dirname(next) };
}
