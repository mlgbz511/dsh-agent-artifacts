/** 工作区扫描：只收“看起来像工件”的文件，跳过依赖/构建/缓存目录。无第三方依赖。 */
import fs from 'node:fs';
import path from 'node:path';
import { isSensitive, typeOf, workspaceCategoryOf } from './classify.js';

const INCLUDE_TYPES = new Set(['doc', 'sheet', 'slides', 'image', 'vector', 'video', 'audio', 'web', 'archive']);
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.hg', '.svn', '.idea', '.vscode', '.cache', '.turbo', '.next', '.nuxt',
  '.output', '.venv', 'venv', 'env', '__pycache__', '.pytest_cache', '.mypy_cache', '.ruff_cache',
  '.dsh', '.gemini',
  'dist', 'build', 'out', 'coverage', 'target', 'bin', 'obj', '.gradle', '.dart_tool',
]);
const MAX_FILES = 2000;
const MAX_RESULTS = 800;
const MAX_DEPTH = 6;
const MAX_BYTES = 200 * 1024 * 1024;

function usable(name) {
  if (name.startsWith('.')) return false;
  if (name.endsWith('~')) return false;
  return true;
}

/** 一个工作区根下的候选工件；不跟随符号链接，不进入忽略目录。 */
export async function scanWorkspace(root, options = {}) {
  const depthLimit = options.depth ?? MAX_DEPTH;
  const maxFiles = options.maxFiles ?? MAX_FILES;
  const maxResults = options.maxResults ?? MAX_RESULTS;
  const files = [];
  let visited = 0;
  let truncated = false;
  const stack = [{ dir: root, depth: 0 }];

  while (stack.length > 0) {
    if (visited >= maxFiles || files.length >= maxResults) {
      truncated = true;
      break;
    }
    const { dir, depth } = stack.pop();
    let entries;
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (visited >= maxFiles || files.length >= maxResults) {
        truncated = true;
        break;
      }
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name.toLowerCase())) continue;
        if (!usable(entry.name)) continue;
        if (depth >= depthLimit) continue;
        stack.push({ dir: full, depth: depth + 1 });
        continue;
      }
      if (!entry.isFile()) continue;
      visited += 1;
      if (!usable(entry.name)) continue;
      const filePath = path.normalize(full);
      if (isSensitive(filePath)) continue;
      const type = typeOf(filePath);
      if (!INCLUDE_TYPES.has(type)) continue;
      let stat;
      try {
        stat = await fs.promises.stat(filePath);
      } catch {
        continue;
      }
      if (!stat.isFile() || stat.size > MAX_BYTES) continue;
      files.push({ path: filePath, size: stat.size, mtime: stat.mtimeMs, type, category: workspaceCategoryOf(filePath) });
    }
  }

  return { root, files, truncated, visited };
}
