import fs from 'node:fs/promises';
import path from 'node:path';
import { RELEASE_TEMPLATES } from '../src/data/templates.ts';
import { renderHtml, renderMarkdown } from '../src/utils/releaseNotesEngine.ts';

const DIST_DIR = path.join(process.cwd(), 'dist');
const BASE_URL = 'https://changelog-software.github.io/Release-Notes';
const TODAY = new Date().toISOString().slice(0, 10);

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pageShell({ title, description, canonicalPath, bodyHtml, schemaJson }) {
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <script type="application/ld+json">${JSON.stringify(schemaJson)}</script>
    <style>
      :root {
        --bg-page: #faf9f6;
        --bg-surface: #ffffff;
        --bg-muted: #f3f1ec;
        --bg-code: #181a1b;
        --text-primary: #14171a;
        --text-secondary: #4b5563;
        --border-subtle: #e5e2dc;
        --accent: #0f5c5c;
      }
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        overflow-x: clip;
        background: var(--bg-page);
        color: var(--text-primary);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
      }
      .container { max-width: 920px; margin: 0 auto; padding: 0 20px; }
      header {
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border-subtle);
        padding: 14px 0;
      }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
      .brand { font-weight: 700; color: var(--text-primary); text-decoration: none; }
      .nav-links { display: flex; gap: 16px; font-size: 14px; }
      .nav-links a { color: var(--text-secondary); text-decoration: none; }
      .nav-links a:hover { text-decoration: underline; }
      main { padding: 40px 0 64px; }
      .card {
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 24px;
        margin-top: 20px;
      }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
      .btn {
        display: inline-block;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        border: 1px solid var(--border-subtle);
        color: var(--text-primary);
        background: var(--bg-surface);
      }
      .btn-primary {
        background: var(--accent);
        color: #ffffff;
        border-color: var(--accent);
      }
      pre {
        background: var(--bg-code);
        color: #e5e7eb;
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
        font-size: 13px;
        line-height: 1.5;
      }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid var(--border-subtle); padding: 10px 12px; text-align: left; font-size: 14px; }
      th { background: var(--bg-muted); }
      footer {
        border-top: 1px solid var(--border-subtle);
        padding: 24px 0;
        font-size: 13px;
        color: var(--text-secondary);
      }
    </style>
  </head>
  <body>
    <header>
      <div class="container header-inner">
        <a class="brand" href="${BASE_URL}/">Release Notes Templates</a>
        <nav class="nav-links">
          <a href="${BASE_URL}/#templates">All Templates</a>
          <a href="${BASE_URL}/#generator">Generator</a>
          <a href="${BASE_URL}/guides/release-notes-vs-changelog/">Release Notes vs Changelog</a>
          <a href="https://github.com/changelog-software/Release-Notes">GitHub</a>
        </nav>
      </div>
    </header>
    <main class="container">
      ${bodyHtml}
    </main>
    <footer>
      <div class="container">
        Release Notes Templates &amp; Generator · <a href="${BASE_URL}/">Home</a> · <a href="${BASE_URL}/sitemap.xml">Sitemap</a>
      </div>
    </footer>
  </body>
</html>
`;
}

async function writePage(relPath, html) {
  const fullPath = path.join(DIST_DIR, relPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, html, 'utf8');
}

async function main() {
  const urls = [`${BASE_URL}/`];

  for (const tpl of RELEASE_TEMPLATES) {
    const canonicalPath = `/templates/${tpl.slug}/`;
    urls.push(`${BASE_URL}${canonicalPath}`);

    const tplMd = renderMarkdown(tpl.templateDoc);
    const exHtml = renderHtml(tpl.exampleDoc);

    const bodyHtml = `
      <p style="font-size:13px;color:var(--text-secondary);"><a href="${BASE_URL}/">Home</a> / Templates / ${escapeHtml(tpl.shortName)}</p>
      <h1>${escapeHtml(tpl.h1)}</h1>
      <p>${escapeHtml(tpl.intro)}</p>
      <p><strong>Audience:</strong> ${escapeHtml(tpl.audience)} · <strong>Best for:</strong> ${escapeHtml(tpl.bestFor)}</p>

      <div class="actions">
        <a class="btn btn-primary" href="${BASE_URL}/downloads/${tpl.slug}.docx" download>Download Word Template (.docx)</a>
        <a class="btn" href="${BASE_URL}/downloads/${tpl.slug}-example.docx" download>Download Filled Example (.docx)</a>
        <a class="btn" href="${BASE_URL}/#generator">Open in Free Generator</a>
      </div>

      <section class="card">
        <h2>Filled-In Example</h2>
        ${exHtml}
      </section>

      <section class="card">
        <h2>Blank Markdown Template</h2>
        <pre><code>${escapeHtml(tplMd)}</code></pre>
      </section>
    `;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: tpl.h1,
      description: tpl.seoDescription,
      url: `${BASE_URL}${canonicalPath}`,
      dateModified: TODAY,
    };

    await writePage(
      `templates/${tpl.slug}/index.html`,
      pageShell({
        title: tpl.seoTitle,
        description: tpl.seoDescription,
        canonicalPath,
        bodyHtml,
        schemaJson,
      }),
    );
  }

  // Guide: Release Notes vs Changelog
  const vsPath = '/guides/release-notes-vs-changelog/';
  urls.push(`${BASE_URL}${vsPath}`);
  await writePage(
    'guides/release-notes-vs-changelog/index.html',
    pageShell({
      title: 'Release Notes vs. Changelog: Key Differences & Templates',
      description:
        'Understand the difference between release notes and a changelog, when to use each, and download free Word and Markdown templates.',
      canonicalPath: vsPath,
      bodyHtml: `
        <p style="font-size:13px;color:var(--text-secondary);"><a href="${BASE_URL}/">Home</a> / Guides / Release Notes vs. Changelog</p>
        <h1>Release Notes vs. Changelog</h1>
        <p>Both document product changes, but they serve different readers and workflows. Use release notes for curated, user-facing announcements and a changelog for a complete chronological record.</p>
        <div class="card">
          <table>
            <thead>
              <tr><th>Dimension</th><th>Release Notes</th><th>Changelog</th></tr>
            </thead>
            <tbody>
              <tr><td>Audience</td><td>Customers, product teams, executives</td><td>Developers, integrators, contributors</td></tr>
              <tr><td>Tone</td><td>Benefit-focused, plain language</td><td>Technical, concise, standardized</td></tr>
              <tr><td>Scope</td><td>Highlights, major fixes, upgrade steps</td><td>Every notable commit or PR by version</td></tr>
              <tr><td>Format</td><td>Word (.docx), PDF, email, GitHub Release</td><td>CHANGELOG.md, RSS feed, web timeline</td></tr>
            </tbody>
          </table>
        </div>
        <div class="actions">
          <a class="btn btn-primary" href="${BASE_URL}/#generator">Generate Release Notes</a>
          <a class="btn" href="${BASE_URL}/#templates">Browse All Templates</a>
        </div>
      `,
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'Release Notes vs. Changelog',
        dateModified: TODAY,
      },
    }),
  );

  // sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u}</loc>
    <lastmod>${TODAY}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

  // robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  await fs.writeFile(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');

  // llms.txt
  const llmsTxt = `# Release Notes Templates & Generator
> Free release notes templates for software, SaaS products, mobile apps, and internal releases. Download Word (.docx), copy Markdown, or generate release notes in the browser.

- Home & Generator: ${BASE_URL}/
${RELEASE_TEMPLATES.map((t) => `- ${t.name}: ${BASE_URL}/templates/${t.slug}/`).join('\n')}
- Release Notes vs. Changelog: ${BASE_URL}/guides/release-notes-vs-changelog/
- GitHub Repository: https://github.com/changelog-software/Release-Notes
`;
  await fs.writeFile(path.join(DIST_DIR, 'llms.txt'), llmsTxt, 'utf8');

  console.log(`Generated ${urls.length} SEO pages, sitemap.xml, robots.txt, and llms.txt.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
