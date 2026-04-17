// Renders DEMO_GUIDE.md → styled HTML → PDF via Chrome headless.
// No project deps; uses npx for marked.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mdPath = resolve(here, 'DEMO_GUIDE.md');
const htmlPath = resolve(here, '_demo-guide.html');
const pdfPath = resolve(here, 'Meridian-Demo-Guide.pdf');

if (!existsSync(mdPath)) {
  console.error('DEMO_GUIDE.md not found');
  process.exit(1);
}

// Render markdown via the `marked` CLI (downloaded on first run via npx).
const mdContent = readFileSync(mdPath, 'utf8');
let body;
try {
  // Use the Node API of marked instead of spawning, more reliable.
  const { marked } = await import('marked');
  body = marked.parse(mdContent);
} catch {
  // Fallback: install marked locally to docs/ and re-import via dynamic path.
  console.log('Installing marked (one-time, into docs/)...');
  execSync('npm i --no-save --silent --prefix docs marked', { stdio: 'inherit' });
  const { marked } = await import(resolve(here, 'node_modules/marked/lib/marked.esm.js'));
  body = marked.parse(mdContent);
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Meridian — Demo Guide</title>
<style>
  :root {
    --ink-900: #0b1020;
    --ink-700: #1f2a44;
    --ink-500: #475569;
    --ink-400: #64748b;
    --ink-300: #94a3b8;
    --ink-200: #cbd5e1;
    --ink-100: #e2e8f0;
    --bg: #ffffff;
    --surface: #f8fafc;
    --border: #e2e8f0;
    --brand: #2a78f5;
    --brand-soft: #ecf5ff;
    --violet: #7c3aed;
    --rose: #e11d48;
    --amber: #d97706;
    --emerald: #059669;
  }
  * { box-sizing: border-box; }
  html, body { background: var(--bg); color: var(--ink-900); }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    margin: 0;
    padding: 32pt 40pt;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    font-weight: 600;
    color: var(--ink-900);
    line-height: 1.25;
    margin-top: 1.6em;
    margin-bottom: 0.6em;
    letter-spacing: -0.01em;
  }
  h1 {
    font-size: 26pt;
    margin-top: 0;
    padding-bottom: 6pt;
    border-bottom: 2pt solid var(--brand);
    color: var(--ink-900);
  }
  h1 + blockquote {
    margin-top: 0.4em;
    border-left: 3pt solid var(--brand);
    background: var(--brand-soft);
    color: var(--ink-700);
  }
  h2 {
    font-size: 17pt;
    margin-top: 1.4em;
    padding-top: 14pt;
    padding-bottom: 6pt;
    border-bottom: 1pt solid var(--border);
    color: var(--brand);
  }
  h3 {
    font-size: 13pt;
    color: var(--ink-900);
  }
  h4 { font-size: 11.5pt; color: var(--ink-700); }

  p { margin: 0.6em 0; }

  ul, ol { padding-left: 1.4em; margin: 0.6em 0; }
  li { margin: 0.25em 0; }

  blockquote {
    margin: 0.8em 0;
    padding: 10pt 14pt;
    border-left: 3pt solid var(--brand);
    background: var(--surface);
    color: var(--ink-700);
    font-style: italic;
    border-radius: 4pt;
  }

  code {
    font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
    font-size: 9pt;
    background: var(--surface);
    color: var(--ink-700);
    padding: 1pt 4pt;
    border-radius: 3pt;
    border: 1px solid var(--border);
  }
  pre {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6pt;
    padding: 10pt 12pt;
    font-size: 9pt;
    overflow-x: auto;
    line-height: 1.5;
  }
  pre code { background: transparent; border: 0; padding: 0; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.8em 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  th {
    text-align: left;
    background: var(--surface);
    color: var(--ink-700);
    font-weight: 600;
    padding: 6pt 9pt;
    border-bottom: 1.5pt solid var(--border);
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  td {
    padding: 6pt 9pt;
    border-bottom: 1px solid var(--border);
    color: var(--ink-700);
    vertical-align: top;
  }
  tr:last-child td { border-bottom: 0; }

  hr {
    border: 0;
    height: 1px;
    background: var(--border);
    margin: 24pt 0;
  }

  strong { color: var(--ink-900); font-weight: 600; }
  em { color: var(--ink-700); }
  a { color: var(--brand); text-decoration: none; }

  input[type="checkbox"] { margin-right: 6pt; }

  /* Page-level print rules */
  @page {
    size: Letter;
    margin: 0.5in;
  }
  h2 { page-break-after: avoid; }
  h3 { page-break-after: avoid; }
  table, pre, blockquote { page-break-inside: avoid; }

  /* Cover header strip */
  .cover-header {
    background: linear-gradient(135deg, var(--brand) 0%, var(--violet) 100%);
    color: white;
    margin: -32pt -40pt 24pt -40pt;
    padding: 28pt 40pt 20pt 40pt;
  }
  .cover-header h1 {
    color: white;
    border-bottom: 0;
    margin: 0 0 4pt 0;
    font-size: 30pt;
  }
  .cover-header .subtitle {
    font-size: 12pt;
    opacity: 0.85;
  }
  .cover-header .meta {
    margin-top: 14pt;
    font-size: 8.5pt;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* Hide the first H1 + blockquote since we render a custom cover */
  body > h1:first-of-type,
  body > h1:first-of-type + blockquote { display: none; }
</style>
</head>
<body>
  <div class="cover-header">
    <h1>Meridian — Demo Guide</h1>
    <div class="subtitle">AI-Powered Logistics Intelligence &amp; Margin Optimization Platform</div>
    <div class="meta">Internal · Sales Engineering · v1.0</div>
  </div>
  ${body}
</body>
</html>`;

writeFileSync(htmlPath, html);

// Use Chrome headless to print to PDF.
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const cmd = `"${chromePath}" --headless --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`;

console.log('Rendering PDF via Chrome headless...');
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`\n✓ PDF written: ${pdfPath}`);
} catch (e) {
  console.error('Chrome failed. You can open the HTML and print manually:', htmlPath);
  process.exit(1);
} finally {
  // Keep the HTML around in case user wants to tweak; comment next line to remove.
  // unlinkSync(htmlPath);
}
