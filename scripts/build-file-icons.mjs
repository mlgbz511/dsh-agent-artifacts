// 从 vendor/material-icons/*.svg 生成 client.js 里的 FILE_ICONS 内联块。
// 不联网、无第三方依赖；重复运行输出一致。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vendor = path.join(root, 'vendor/material-icons');
const clientFile = path.join(root, 'client.js');
const START = '    // #region file-icons';
const END = '    // #endregion file-icons';
const BUDGET = 80 * 1024;

const files = fs.readdirSync(vendor).filter((name) => name.endsWith('.svg')).sort();
const icons = {};
let total = 0;
for (const name of files) {
  const id = name.slice(0, -4);
  let svg = fs.readFileSync(path.join(vendor, name), 'utf8');
  svg = svg.replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (/<script|on\w+\s*=|\bjavascript:/i.test(svg)) throw new Error(`unsafe svg: ${name}`);
  icons[id] = svg;
  total += svg.length;
}
if (total > BUDGET) throw new Error(`icon payload ${total} exceeds ${BUDGET}`);

const source = fs.readFileSync(clientFile, 'utf8');
const start = source.indexOf(START);
const end = source.indexOf(END, start);
if (start < 0 || end < 0) throw new Error('client.js is missing the file-icons markers');

const body = Object.keys(icons).sort().map((id) => `      ${JSON.stringify(id)}: ${JSON.stringify(icons[id])},`).join('\n');
const block = `${START}\n    const FILE_ICONS = {\n${body}\n    };\n${END}`;
const next = source.slice(0, start) + block + source.slice(end + END.length);
if (next === source) {
  console.log(`unchanged ${Object.keys(icons).length} icons, ${total} bytes`);
} else {
  fs.writeFileSync(clientFile, next, 'utf8');
  console.log(`wrote ${Object.keys(icons).length} icons, ${total} bytes`);
}
