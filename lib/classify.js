/** 文件类型与敏感名单：纯函数，供 Host 与自测共用。无第三方依赖。 */

const TYPE_TABLE = [
  ['doc', ['md', 'mdx', 'txt', 'pdf', 'doc', 'docx', 'rtf', 'epub', 'org', 'rst']],
  ['sheet', ['csv', 'tsv', 'xlsx', 'xls', 'ods']],
  ['slides', ['pptx', 'ppt', 'key', 'odp']],
  ['image', ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif', 'ico']],
  ['vector', ['svg']],
  ['video', ['mp4', 'webm', 'mov', 'm4v', 'mkv', 'avi']],
  ['audio', ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac']],
  ['code', ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'py', 'ps1', 'sh', 'bat', 'sql', 'css', 'scss', 'go', 'rs', 'java', 'c', 'cc', 'cpp', 'h', 'hpp', 'rb', 'php', 'lua', 'toml', 'yaml', 'yml']],
  ['config', ['json', 'jsonc', 'ini', 'env', 'xml', 'conf', 'properties', 'lock']],
  ['web', ['html', 'htm']],
  ['archive', ['zip', 'tar', 'gz', 'tgz', '7z', 'rar', 'zst']],
];

const EXT_TYPE = new Map();
for (const [type, extensions] of TYPE_TABLE) {
  for (const extension of extensions) EXT_TYPE.set(extension, type);
}

/** config 里 .json 与 code 里的 .toml/.yaml 有重叠：先 code 后 config 会误判，这里显式拆开。 */
EXT_TYPE.set('json', 'config');
EXT_TYPE.set('jsonc', 'config');
EXT_TYPE.set('toml', 'config');
EXT_TYPE.set('yaml', 'config');
EXT_TYPE.set('yml', 'config');

const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif', 'ico']);
const TEXT_EXT = new Set([
  'md', 'mdx', 'txt', 'csv', 'tsv', 'json', 'jsonc', 'yaml', 'yml', 'toml', 'ini', 'env', 'xml',
  'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'py', 'ps1', 'sh', 'bat', 'sql', 'css', 'scss',
  'go', 'rs', 'java', 'c', 'cc', 'cpp', 'h', 'hpp', 'rb', 'php', 'lua', 'html', 'htm', 'svg', 'org', 'rst', 'log',
]);

const SENSITIVE_NAME = /^(\.env(\..*)?|id_(rsa|dsa|ecdsa|ed25519)(\..*)?|credentials(\..*)?|secrets?(\..*)?)$/i;
const SENSITIVE_EXT = /\.(pem|key|p12|pfx|keystore|jks)$/i;
const SENSITIVE_SEGMENT = new Set(['.ssh', '.gnupg', '.aws', '.git']);

export function extensionOf(path) {
  const base = String(path).split(/[\\/]+/).filter(Boolean).pop() ?? '';
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
}

export function typeOf(path) {
  return EXT_TYPE.get(extensionOf(path)) ?? 'other';
}

export function isImage(path) {
  return IMAGE_EXT.has(extensionOf(path));
}

export function isTextLike(path) {
  return TEXT_EXT.has(extensionOf(path));
}

/** 敏感文件不索引、不预览、不可复制：宁可漏一个，也不泄露凭据。 */
export function isSensitive(path) {
  const segments = String(path).split(/[\\/]+/).filter(Boolean);
  if (segments.some((segment) => SENSITIVE_SEGMENT.has(segment.toLowerCase()))) return true;
  const base = segments[segments.length - 1] ?? '';
  return SENSITIVE_NAME.test(base) || SENSITIVE_EXT.test(base);
}

// 与 Antigravity 文档一致的工件类型：实施计划、走查、代码差异、架构图、截图、
// 浏览器录制、交互页面，以及文件层面的文档/代码兜底。
const DIFF_EXT = new Set(['diff', 'patch']);
const DIAGRAM_EXT = new Set(['mmd', 'mermaid', 'puml', 'pu', 'plantuml', 'drawio', 'dio', 'excalidraw']);
const RECORDING_EXT = new Set(['mp4', 'webm', 'mov', 'm4v', 'mkv', 'avi']);

const CATEGORY_RULES = [
  ['plan', /(^|[-_ .])(implementation[-_ ]?plan|plan|roadmap)([-_ .]|$)|规划/i],
  ['walkthrough', /(^|[-_ .])(walkthrough|walk-through)([-_ .]|$)|走查/i],
  ['diagram', /(^|[-_ .])(architecture|diagram|flowchart|erd)([-_ .]|$)|架构图|流程图/i],
  ['screenshot', /(^|[-_ .])(screenshot|shot|snapshot|frame|capture)([-_ .]|$)|截图/i],
];

/** 旧版工件分类 id → 新用途 id。 */
const LEGACY_KIND = {
  design: 'document',
  task: 'document',
  diff: 'change',
  screenshot: 'evidence',
  recording: 'evidence',
  interactive: 'preview',
  prototype: 'preview',
};

export function normalizeKind(id) {
  return LEGACY_KIND[id] ?? id;
}

/** 工件类型（与 Antigravity 对齐的交付物 + 文件层兜底）。host/client 共用这一份 id 清单。 */
export const ARTIFACT_KIND_IDS = ['plan', 'walkthrough', 'change', 'diagram', 'evidence', 'preview', 'document', 'code', 'other'];
export const UNTAGGED = 'untagged';

/** Antigravity 式工件类型，仅用于展示/筛选，不影响采集。 */
export function categoryOf(fsPath) {
  const extension = extensionOf(fsPath);
  if (DIFF_EXT.has(extension)) return 'change';
  if (DIAGRAM_EXT.has(extension)) return 'diagram';
  const name = displayName(fsPath);
  for (const [category, rule] of CATEGORY_RULES) {
    if (rule.test(name)) return normalizeKind(category);
  }
  if (isImage(fsPath)) return 'evidence';
  if (RECORDING_EXT.has(extension)) return 'evidence';
  const type = typeOf(fsPath);
  if (type === 'web') return 'preview';
  if (type === 'code' || type === 'config') return 'code';
  if (type === 'doc' || type === 'sheet' || type === 'slides' || type === 'archive') return 'document';
  return 'other';
}

/** 扫描得到的工作区文件：只给文件类型层，不冒充 agent 交付物 kind。 */
export function workspaceCategoryOf(fsPath) {
  const type = typeOf(fsPath);
  if (type === 'doc' || type === 'sheet' || type === 'slides' || type === 'archive') return 'document';
  if (type === 'code' || type === 'config' || type === 'web') return 'code';
  return 'other';
}

export function isAbsolutePath(path) {
  return /^[a-z]:[\\/]/i.test(path) || /^\\\\/.test(path) || path.startsWith('/');
}

export function displayName(path) {
  return String(path).split(/[\\/]+/).filter(Boolean).pop() ?? String(path);
}

export function displayDir(path) {
  const normalized = String(path).replace(/[\\/]+$/, '');
  const index = Math.max(normalized.lastIndexOf('/'), normalized.lastIndexOf('\\'));
  return index <= 0 ? '' : normalized.slice(0, index);
}
