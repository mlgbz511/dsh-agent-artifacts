import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../client.js', import.meta.url), 'utf8');
const start = source.indexOf('    function escapeHtmlText(');
const end = source.indexOf('    // 右侧栏「工件阅读」tab');
assert.ok(start > 0 && end > start, 'markdown helpers are present');
const markdownToHtml = new Function(source.slice(start, end) + '\nreturn markdownToHtml;')();

test('markdown renderer covers headings, lists, tables, quotes and code', () => {
  assert.match(markdownToHtml('## 标题'), /<h2>标题<\/h2>/);
  assert.match(markdownToHtml('- a\n- b'), /<ul><li>a<\/li><li>b<\/li><\/ul>/);
  assert.match(markdownToHtml('1. one\n2. two'), /<ol><li>one<\/li><li>two<\/li><\/ol>/);
  assert.match(markdownToHtml('> 引用'), /<blockquote><p>引用<\/p><\/blockquote>/);
  assert.match(markdownToHtml('| a | b |\n| --- | --- |\n| 1 | 2 |'), /<table>.*<th>a<\/th>.*<td>1<\/td>.*<\/table>/s);
  assert.match(markdownToHtml('```js\nconst x = 1;\n```'), /<pre class="dsa-md-code" data-lang="js"><code>const x = 1;<\/code><\/pre>/);
  assert.match(markdownToHtml('---'), /<hr>/);
});

test('markdown renderer escapes raw HTML and refuses script URLs', () => {
  assert.match(markdownToHtml('<img src=x onerror=alert(1)>'), /&lt;img/);
  assert.match(markdownToHtml('```\n<script>alert(1)</script>\n```'), /&lt;script&gt;/);
  assert.match(markdownToHtml('[x](javascript:alert(1))'), /href="#"/);
  assert.match(markdownToHtml('[x](https://a.example)'), /href="https:\/\/a.example"/);
  assert.match(markdownToHtml('`<b>**x**</b>`'), /<code>&lt;b&gt;\*\*x\*\*&lt;\/b&gt;<\/code>/);
  assert.match(markdownToHtml('**粗** *斜*'), /<strong>粗<\/strong> <em>斜<\/em>/);
});
