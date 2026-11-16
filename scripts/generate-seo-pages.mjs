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

function pageShell({ title, description, canonicalPath, bodyHtml, schemaList, inlineScript = '' }) {
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const schemasHtml = schemaList
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="icon" type="image/svg+xml" href="${BASE_URL}/favicon.svg" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${BASE_URL}/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${BASE_URL}/og-image.png" />
    ${schemasHtml}
    <style>
      /* Hallmark · v2.0.0 — Editorial-Utilitarian Paper & Teal SEO Page */
      /* Critique: Static SEO pages sharing exact paper ground, warm surface, and teal action tokens. */
      :root {
        --bg-page: #faf9f6;
        --bg-surface: #fcfbf8;
        --bg-muted: #f3f1ec;
        --bg-code: #181a1b;
        --code-text: #e5e7eb;
        --text-primary: #14171a;
        --text-secondary: #4b5563;
        --text-inverse: #faf9f6;
        --border-subtle: #e5e2dc;
        --border-strong: #cfc9be;
        --accent: #0f5c5c;
        --accent-hover: #0a4545;
        --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        overflow-x: clip;
        background: var(--bg-page);
        color: var(--text-primary);
        font-family: var(--font-sans);
        line-height: 1.6;
      }
      *:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .container { max-width: 920px; margin: 0 auto; padding: 0 20px; }
      header {
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border-subtle);
        padding: 16px 0;
      }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
      .brand { font-weight: 700; color: var(--text-primary); text-decoration: none; }
      .nav-links { display: flex; gap: 16px; font-size: 14px; flex-wrap: wrap; }
      .nav-links a { color: var(--text-secondary); text-decoration: none; }
      .nav-links a:hover { text-decoration: underline; }
      main { padding: 40px 0 64px; }
      h1, h2 { text-wrap: balance; }
      h1 { line-height: 1.15; margin: 8px 0 16px; overflow-wrap: break-word; }
      .meta-row { display: flex; flex-wrap: wrap; gap: 16px; font-size: 14px; color: var(--text-secondary); margin: 12px 0; }
      .card {
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 24px;
        margin-top: 20px;
      }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 20px 0; }
      .btn {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        border: 1px solid var(--border-strong);
        color: var(--text-primary);
        background: var(--bg-surface);
      }
      .btn:active { opacity: 0.85; }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .btn-primary {
        background: var(--accent);
        color: var(--text-inverse);
        border-color: var(--accent);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      pre {
        background: var(--bg-code);
        color: var(--code-text);
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
        font-family: var(--font-mono);
        font-size: 13px;
        line-height: 1.5;
      }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid var(--border-subtle); padding: 12px; text-align: left; font-size: 14px; }
      th { background: var(--bg-muted); }
      img.diagram { width: 100%; height: auto; border-radius: 8px; margin-top: 16px; }
      footer {
        border-top: 1px solid var(--border-subtle);
        padding: 24px 0;
        font-size: 13px;
        color: var(--text-secondary);
      }
      .footer-inner { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center; }
      .footer-links { display: flex; flex-wrap: wrap; gap: 16px; }
      .footer-links a { color: var(--text-secondary); text-decoration: none; }
      .footer-links a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <header>
      <div class="container header-inner">
        <a class="brand" href="${BASE_URL}/">Release Notes Templates</a>
        <nav class="nav-links" aria-label="Primary">
          <a href="${BASE_URL}/#templates">Templates</a>
          <a href="${BASE_URL}/examples/">Examples</a>
          <a href="${BASE_URL}/#generator">Generator</a>
          <a href="${BASE_URL}/guides/how-to-write-release-notes/">Format Guide</a>
          <a href="${BASE_URL}/guides/release-notes-vs-changelog/">Release Notes vs Changelog</a>
          <a href="https://github.com/changelog-software/Release-Notes">GitHub</a>
        </nav>
      </div>
    </header>
    <main class="container">
      ${bodyHtml}
    </main>
    <footer>
      <div class="container footer-inner">
        <span>Release Notes Templates &amp; Generator (MIT License)</span>
        <div class="footer-links">
          <a href="${BASE_URL}/">Home</a>
          <a href="${BASE_URL}/examples/">Examples</a>
          <a href="${BASE_URL}/guides/how-to-write-release-notes/">Format Guide</a>
          <a href="${BASE_URL}/sitemap.xml">Sitemap</a>
        </div>
      </div>
    </footer>
    ${inlineScript}
  </body>
</html>
`;
}

async function writePage(relPath, html) {
  const fullPath = path.join(DIST_DIR, relPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, html, 'utf8');
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

async function main() {
  const urls = [`${BASE_URL}/`];

  const copyScript = `<script>
    (function () {
      var copyMdBtn = document.getElementById('copy-md-btn');
      var mdSource = document.getElementById('md-source');
      if (copyMdBtn && mdSource) {
        copyMdBtn.addEventListener('click', function () {
          navigator.clipboard.writeText(mdSource.textContent || '').then(function () {
            copyMdBtn.textContent = 'Copied Markdown';
            setTimeout(function () { copyMdBtn.textContent = 'Copy Markdown'; }, 1800);
          });
        });
      }
      var copyDocsBtn = document.getElementById('copy-docs-btn');
      var exBox = document.getElementById('example-html');
      if (copyDocsBtn && exBox) {
        copyDocsBtn.addEventListener('click', function () {
          var html = exBox.innerHTML;
          var text = exBox.innerText;
          if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
            var item = new ClipboardItem({
              'text/html': new Blob([html], { type: 'text/html' }),
              'text/plain': new Blob([text], { type: 'text/plain' })
            });
            navigator.clipboard.write([item]).then(function () {
              copyDocsBtn.textContent = 'Copied for Google Docs';
              setTimeout(function () { copyDocsBtn.textContent = 'Copy for Google Docs'; }, 1800);
            });
          } else {
            navigator.clipboard.writeText(text);
          }
        });
      }
    })();
  </script>`;

  // 1. Individual Template SEO pages
  for (const tpl of RELEASE_TEMPLATES) {
    const canonicalPath = `/templates/${tpl.slug}/`;
    urls.push(`${BASE_URL}${canonicalPath}`);

    const tplMd = renderMarkdown(tpl.templateDoc);
    const exHtml = renderHtml(tpl.exampleDoc);

    const bodyHtml = `
      <p class="meta-row"><span><a href="${BASE_URL}/">Home</a> / Templates / ${escapeHtml(tpl.shortName)}</span></p>
      <h1>${escapeHtml(tpl.h1)}</h1>
      <p>${escapeHtml(tpl.intro)}</p>
      <div class="meta-row">
        <span><strong>Audience:</strong> ${escapeHtml(tpl.audience)}</span>
        <span><strong>Best for:</strong> ${escapeHtml(tpl.bestFor)}</span>
      </div>

      <div class="actions">
        <a class="btn btn-primary" href="${BASE_URL}/downloads/${tpl.slug}.docx" download>Download Word (.docx)</a>
        <a class="btn" href="${BASE_URL}/downloads/${tpl.slug}-example.docx" download>Example (.docx)</a>
        <button type="button" class="btn" id="copy-md-btn">Copy Markdown</button>
        <button type="button" class="btn" id="copy-docs-btn">Copy for Google Docs</button>
        <a class="btn" href="${BASE_URL}/#generator">Open Generator</a>
      </div>

      <section class="card">
        <h2>Filled-In Example</h2>
        <div id="example-html">${exHtml}</div>
      </section>

      <section class="card">
        <h2>Blank Markdown Template</h2>
        <pre><code id="md-source">${escapeHtml(tplMd)}</code></pre>
      </section>
    `;

    const articleSchema = {
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
        schemaList: [
          articleSchema,
          breadcrumbSchema([
            { name: 'Home', url: `${BASE_URL}/` },
            { name: tpl.h1, url: `${BASE_URL}${canonicalPath}` },
          ]),
        ],
        inlineScript: copyScript,
      }),
    );
  }

  // 2. Examples Hub (/examples/)
  const examplesPath = '/examples/';
  urls.push(`${BASE_URL}${examplesPath}`);
  const examplesCards = RELEASE_TEMPLATES.map(
    (tpl) => `
      <section class="card">
        <h2><a href="${BASE_URL}/templates/${tpl.slug}/">${escapeHtml(tpl.shortName)} Example</a></h2>
        <p>${escapeHtml(tpl.intro)}</p>
        ${renderHtml(tpl.exampleDoc)}
        <div class="actions">
          <a class="btn btn-primary" href="${BASE_URL}/downloads/${tpl.slug}-example.docx" download>Download Example (.docx)</a>
          <a class="btn" href="${BASE_URL}/templates/${tpl.slug}/">View Blank Template</a>
        </div>
      </section>
    `,
  ).join('\n');

  await writePage(
    'examples/index.html',
    pageShell({
      title: 'Release Notes Examples & Sample Templates (SaaS, Software, Mobile, API)',
      description:
        'Browse 6 real filled-in release notes examples for SaaS, desktop software, mobile apps, internal sprints, enterprise B2B, and APIs. Download Word (.docx) or copy Markdown.',
      canonicalPath: examplesPath,
      bodyHtml: `
        <p class="meta-row"><span><a href="${BASE_URL}/">Home</a> / Examples</span></p>
        <h1>Sample Release Notes &amp; Real Examples</h1>
        <p>Filled-in release notes samples you can adapt for your next launch, sprint review, or app store update.</p>
        ${examplesCards}
      `,
      schemaList: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Release Notes Examples & Sample Templates',
          url: `${BASE_URL}${examplesPath}`,
        },
        breadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Examples', url: `${BASE_URL}${examplesPath}` },
        ]),
      ],
    }),
  );

  // 3. Guide: How to Write Release Notes (/guides/how-to-write-release-notes/)
  const guidePath = '/guides/how-to-write-release-notes/';
  urls.push(`${BASE_URL}${guidePath}`);
  await writePage(
    'guides/how-to-write-release-notes/index.html',
    pageShell({
      title: 'Release Notes Format & How to Write Clear Release Notes',
      description:
        'Standard release notes format with sections, examples, and a checklist for software, SaaS, mobile apps, and internal teams.',
      canonicalPath: guidePath,
      bodyHtml: `
        <p class="meta-row"><span><a href="${BASE_URL}/">Home</a> / Guides / Format Guide</span></p>
        <h1>Release Notes Format &amp; Writing Guide</h1>
        <p>A consistent release notes format helps customers, support teams, and administrators see what changed and whether they need to act.</p>
        <img class="diagram" src="${BASE_URL}/images/formats-workflow.svg" alt="Workflow from commits or template to Word, Markdown, and Google Docs" width="960" height="280" />
        <section class="card">
          <h2>Standard Sections in a Release Notes Document</h2>
          <ol>
            <li><strong>Header metadata</strong>: Product name, version number, release date, and target audience.</li>
            <li><strong>One-sentence summary</strong>: The main user benefit or scope of the release.</li>
            <li><strong>Categorized changes</strong>: New Features, Improvements, Bug Fixes, Breaking Changes, Security Updates.</li>
            <li><strong>Upgrade &amp; deployment notes</strong>: Required actions, migrations, or feature flags.</li>
            <li><strong>Known issues &amp; feedback link</strong>: Honest workarounds and where to report regressions.</li>
          </ol>
        </section>
        <div class="actions">
          <a class="btn btn-primary" href="${BASE_URL}/#generator">Open Free Generator</a>
          <a class="btn" href="${BASE_URL}/examples/">See Real Examples</a>
        </div>
      `,
      schemaList: [
        {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: 'Release Notes Format & Writing Guide',
          dateModified: TODAY,
        },
        breadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Format Guide', url: `${BASE_URL}${guidePath}` },
        ]),
      ],
    }),
  );

  // 4. Guide: Release Notes vs Changelog
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
        <p class="meta-row"><span><a href="${BASE_URL}/">Home</a> / Guides / Release Notes vs. Changelog</span></p>
        <h1>Release Notes vs. Changelog</h1>
        <p>Both document product changes, but they serve different readers and workflows. Use release notes for curated, user-facing announcements and a changelog for a complete chronological record.</p>
        <img class="diagram" src="${BASE_URL}/images/release-notes-vs-changelog.svg" alt="Comparison between Release Notes and Changelog" width="960" height="300" />
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
      schemaList: [
        {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: 'Release Notes vs. Changelog',
          dateModified: TODAY,
        },
        breadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Release Notes vs. Changelog', url: `${BASE_URL}${vsPath}` },
        ]),
      ],
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
> Free release notes templates for software, SaaS products, mobile apps, and internal releases. Download Word (.docx), copy for Google Docs or Markdown, or generate release notes in the browser.

- Home & Generator: ${BASE_URL}/
- Filled-In Examples: ${BASE_URL}/examples/
${RELEASE_TEMPLATES.map((t) => `- ${t.name}: ${BASE_URL}/templates/${t.slug}/`).join('\n')}
- Release Notes Format Guide: ${BASE_URL}/guides/how-to-write-release-notes/
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
