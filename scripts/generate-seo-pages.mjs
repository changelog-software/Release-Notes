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

function pageShell({ title, description, canonicalPath, bodyHtml, schemaList, inlineScript = '', ogImage = `${BASE_URL}/og-image.png` }) {
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
    <link rel="icon" href="${BASE_URL}/favicon.ico" sizes="any" />
    <link rel="apple-touch-icon" href="${BASE_URL}/apple-touch-icon.png" />
    <link rel="manifest" href="${BASE_URL}/site.webmanifest" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${ogImage}" />
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
      .grid-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 16px; }
      .link-tile {
        display: block;
        padding: 16px;
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        background: var(--bg-surface);
        color: var(--text-primary);
        text-decoration: none;
      }
      .link-tile:hover { border-color: var(--accent); }
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
          <a href="${BASE_URL}/alternatives/">Alternatives</a>
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
          <a href="${BASE_URL}/alternatives/">Alternatives</a>
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

  // 1. Individual Template SEO pages (14 pages)
  for (const tpl of RELEASE_TEMPLATES) {
    const canonicalPath = `/templates/${tpl.slug}/`;
    urls.push(`${BASE_URL}${canonicalPath}`);

    const tplMd = renderMarkdown(tpl.templateDoc);
    const exHtml = renderHtml(tpl.exampleDoc);
    const related = RELEASE_TEMPLATES.filter((t) => t.slug !== tpl.slug).slice(0, 4);

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

      <section class="card">
        <h2>Related Release Notes Templates</h2>
        <div class="grid-links">
          ${related
            .map(
              (r) =>
                `<a class="link-tile" href="${BASE_URL}/templates/${r.slug}/"><strong>${escapeHtml(r.shortName)}</strong><br /><span>${escapeHtml(r.bestFor)}</span></a>`,
            )
            .join('')}
        </div>
      </section>
    `;

    await writePage(
      `templates/${tpl.slug}/index.html`,
      pageShell({
        title: tpl.seoTitle,
        description: tpl.seoDescription,
        canonicalPath,
        bodyHtml,
        schemaList: [
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: tpl.h1,
            description: tpl.seoDescription,
            url: `${BASE_URL}${canonicalPath}`,
            dateModified: TODAY,
          },
          breadcrumbSchema([
            { name: 'Home', url: `${BASE_URL}/` },
            { name: tpl.h1, url: `${BASE_URL}${canonicalPath}` },
          ]),
        ],
        inlineScript: copyScript,
        ogImage: `${BASE_URL}/og/${tpl.slug}.png`,
      }),
    );
  }

  // 2. Examples Hub + 6 Dedicated Sample Pages (7 pages)
  const examplesPath = '/examples/';
  urls.push(`${BASE_URL}${examplesPath}`);
  const examplesCards = RELEASE_TEMPLATES.slice(0, 6)
    .map(
      (tpl) => `
      <section class="card">
        <h2><a href="${BASE_URL}/examples/${tpl.slug}-example/">${escapeHtml(tpl.exampleDoc.productName)} ${escapeHtml(tpl.exampleDoc.version)} (${escapeHtml(tpl.shortName)})</a></h2>
        <p>${escapeHtml(tpl.exampleDoc.summary)}</p>
        <div class="actions">
          <a class="btn btn-primary" href="${BASE_URL}/examples/${tpl.slug}-example/">Read Full Sample</a>
          <a class="btn" href="${BASE_URL}/downloads/${tpl.slug}-example.docx" download>Download Example (.docx)</a>
          <a class="btn" href="${BASE_URL}/templates/${tpl.slug}/">Blank Template</a>
        </div>
      </section>
    `,
    )
    .join('\n');

  await writePage(
    'examples/index.html',
    pageShell({
      title: 'Release Notes Examples & Sample Templates (SaaS, Software, Mobile, API)',
      description:
        'Browse real filled-in release notes examples for SaaS, desktop software, mobile apps, internal sprints, enterprise B2B, and APIs. Download Word (.docx) or copy Markdown.',
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

  for (const tpl of RELEASE_TEMPLATES.slice(0, 6)) {
    const exPath = `/examples/${tpl.slug}-example/`;
    urls.push(`${BASE_URL}${exPath}`);
    const exMd = renderMarkdown(tpl.exampleDoc);
    const exHtml = renderHtml(tpl.exampleDoc);

    await writePage(
      `examples/${tpl.slug}-example/index.html`,
      pageShell({
        title: `${tpl.exampleDoc.productName} ${tpl.exampleDoc.version} — ${tpl.shortName} Release Notes Example`,
        description: `Real filled-in ${tpl.shortName.toLowerCase()} release notes sample (${tpl.exampleDoc.productName} ${tpl.exampleDoc.version}). Copy Markdown, Google Docs, or download Word (.docx).`,
        canonicalPath: exPath,
        bodyHtml: `
          <p class="meta-row"><span><a href="${BASE_URL}/">Home</a> / <a href="${BASE_URL}/examples/">Examples</a> / ${escapeHtml(tpl.shortName)}</span></p>
          <h1>${escapeHtml(tpl.shortName)} Release Notes Example: ${escapeHtml(tpl.exampleDoc.productName)} ${escapeHtml(tpl.exampleDoc.version)}</h1>
          <p>${escapeHtml(tpl.intro)}</p>
          <div class="actions">
            <a class="btn btn-primary" href="${BASE_URL}/downloads/${tpl.slug}-example.docx" download>Download Sample (.docx)</a>
            <button type="button" class="btn" id="copy-md-btn">Copy Markdown</button>
            <button type="button" class="btn" id="copy-docs-btn">Copy for Google Docs</button>
            <a class="btn" href="${BASE_URL}/templates/${tpl.slug}/">View Blank Template</a>
          </div>
          <section class="card">
            <h2>Formatted Sample</h2>
            <div id="example-html">${exHtml}</div>
          </section>
          <section class="card">
            <h2>Markdown Source</h2>
            <pre><code id="md-source">${escapeHtml(exMd)}</code></pre>
          </section>
        `,
        schemaList: [
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: `${tpl.shortName} Release Notes Example`,
            dateModified: TODAY,
          },
          breadcrumbSchema([
            { name: 'Home', url: `${BASE_URL}/` },
            { name: 'Examples', url: `${BASE_URL}/examples/` },
            { name: `${tpl.shortName} Example`, url: `${BASE_URL}${exPath}` },
          ]),
        ],
        inlineScript: copyScript,
        ogImage: `${BASE_URL}/og/${tpl.slug}.png`,
      }),
    );
  }

  // 3. Guides (4 pages)
  const guides = [
    {
      slug: 'how-to-write-release-notes',
      title: 'Release Notes Format & How to Write Clear Release Notes',
      description:
        'Standard release notes format with sections, examples, and a checklist for software, SaaS, mobile apps, and internal teams.',
      h1: 'Release Notes Format & Writing Guide',
      body: `
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
      `,
    },
    {
      slug: 'release-notes-vs-changelog',
      title: 'Release Notes vs. Changelog: Key Differences & Templates',
      description:
        'Understand the difference between release notes and a changelog, when to use each, and download free Word and Markdown templates.',
      h1: 'Release Notes vs. Changelog',
      body: `
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
      `,
    },
    {
      slug: 'release-notes-document-format',
      title: 'Release Notes Document Format (Word, Markdown & Google Docs)',
      description:
        'Choose the right release notes document format for your team: Word (.docx), Google Docs, Markdown, or HTML email.',
      h1: 'Release Notes Document Format Guide',
      body: `
        <p>The best release notes document format depends on where your audience reads updates and who reviews drafts before publishing.</p>
        <img class="diagram" src="${BASE_URL}/images/docx-preview.svg" alt="Preview of a formatted Word (.docx) release notes document" width="960" height="420" />
        <div class="card">
          <table>
            <thead>
              <tr><th>Format</th><th>Best For</th><th>Recommended Template</th></tr>
            </thead>
            <tbody>
              <tr><td>Word (.docx)</td><td>Enterprise sign-off, compliance archives, PDF export</td><td><a href="${BASE_URL}/templates/release-notes-template-word/">Word Release Notes Template</a></td></tr>
              <tr><td>Google Docs</td><td>Product + marketing + support review comments</td><td><a href="${BASE_URL}/templates/google-docs-release-notes-template/">Google Docs Template</a></td></tr>
              <tr><td>Markdown (.md)</td><td>GitHub Releases, developer portals, static docs</td><td><a href="${BASE_URL}/templates/github-release-notes-template/">GitHub Release Notes Template</a></td></tr>
              <tr><td>Customer Email</td><td>Monthly product digest and feature adoption</td><td><a href="${BASE_URL}/templates/release-notes-email-template/">Email Update Template</a></td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
    {
      slug: 'automating-release-notes-from-git',
      title: 'How to Turn Git Commits into Customer Release Notes',
      description:
        'Convert Conventional Commits (feat, fix, perf, BREAKING CHANGE) into clean, user-facing release notes in seconds.',
      h1: 'Turning Git Commits into Release Notes',
      body: `
        <p>Raw commit logs are written for developers, not end users. Grouping commits by prefix lets you draft structured release notes without starting from a blank page.</p>
        <section class="card">
          <h2>Prefix Mapping Used by the Free Generator</h2>
          <table>
            <thead>
              <tr><th>Commit Prefix</th><th>Release Notes Section</th><th>Example Input</th></tr>
            </thead>
            <tbody>
              <tr><td><code>feat:</code> / <code>add:</code></td><td>New Features</td><td><code>feat(reports): Scheduled PDF exports (#412)</code></td></tr>
              <tr><td><code>perf:</code> / <code>refactor:</code></td><td>Improvements</td><td><code>perf: Cut 90-day funnel query time to 1.2s</code></td></tr>
              <tr><td><code>fix:</code> / <code>bugfix:</code></td><td>Bug Fixes</td><td><code>fix: UTF-8 characters in CSV downloads</code></td></tr>
              <tr><td><code>security:</code></td><td>Security Updates</td><td><code>security: Updated OpenSSL runtime to 3.3.2</code></td></tr>
              <tr><td><code>BREAKING CHANGE:</code></td><td>Breaking Changes</td><td><code>BREAKING CHANGE: Removed legacy offset pagination</code></td></tr>
            </tbody>
          </table>
        </section>
      `,
    },
  ];

  for (const g of guides) {
    const gPath = `/guides/${g.slug}/`;
    urls.push(`${BASE_URL}${gPath}`);
    await writePage(
      `guides/${g.slug}/index.html`,
      pageShell({
        title: g.title,
        description: g.description,
        canonicalPath: gPath,
        bodyHtml: `
          <p class="meta-row"><span><a href="${BASE_URL}/">Home</a> / Guides / ${escapeHtml(g.h1)}</span></p>
          <h1>${escapeHtml(g.h1)}</h1>
          ${g.body}
          <div class="actions">
            <a class="btn btn-primary" href="${BASE_URL}/#generator">Open Free Generator</a>
            <a class="btn" href="${BASE_URL}/examples/">Browse Examples</a>
          </div>
        `,
        schemaList: [
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: g.h1,
            dateModified: TODAY,
          },
          breadcrumbSchema([
            { name: 'Home', url: `${BASE_URL}/` },
            { name: g.h1, url: `${BASE_URL}${gPath}` },
          ]),
        ],
      }),
    );
  }

  // 4. Alternatives & Comparisons (4 pages)
  const alternativesPages = [
    {
      slug: '',
      title: 'Release Notes & Changelog Tool Alternatives (Free & Open Source)',
      description:
        'Compare free release notes templates and browser generators against GitHub Gist snippets, Smartsheet/Atlassian templates, and paid changelog SaaS tools.',
      h1: 'Release Notes & Changelog Tool Alternatives',
      breadcrumb: 'Alternatives',
      body: `
        <p>Teams looking for a release notes template or changelog tool usually choose between static documents, project suites, or paid SaaS widgets. Here is how they compare.</p>
        <div class="grid-links">
          <a class="link-tile" href="${BASE_URL}/alternatives/github-gist-templates/"><strong>vs. Static GitHub Gist</strong><br /><span>Why structured .docx, Google Docs, and a live generator beat a single raw gist.</span></a>
          <a class="link-tile" href="${BASE_URL}/alternatives/smartsheet-monday-atlassian/"><strong>vs. Smartsheet, Monday &amp; Atlassian</strong><br /><span>No workspace signup or license required to download and export.</span></a>
          <a class="link-tile" href="${BASE_URL}/alternatives/paid-changelog-tools/"><strong>vs. Paid Changelog Tools</strong><br /><span>Compare free browser generation against ReleasePad, Beamer, and LaunchNotes.</span></a>
        </div>
      `,
    },
    {
      slug: 'github-gist-templates',
      title: 'Alternative to Static GitHub Gist Release Notes Templates',
      description:
        'Get more than a single raw Markdown gist: 14 templates, real filled-in examples, Word (.docx) downloads, Google Docs copy, and a free generator.',
      h1: 'Beyond a Single GitHub Gist Template',
      breadcrumb: 'vs. GitHub Gist',
      body: `
        <p>A single GitHub Gist gives you one generic Markdown outline. Real product teams ship to different audiences: SaaS users, mobile app stores, enterprise IT, and internal engineers.</p>
        <div class="card">
          <table>
            <thead>
              <tr><th>Capability</th><th>Single GitHub Gist</th><th>Release Notes Templates &amp; Generator</th></tr>
            </thead>
            <tbody>
              <tr><td>Filled-in examples</td><td>Placeholders only</td><td>14 templates + realistic filled examples</td></tr>
              <tr><td>Word (.docx) download</td><td>Manual copy-paste</td><td>Direct .docx download + browser generator</td></tr>
              <tr><td>Google Docs formatting</td><td>Plain text paste</td><td>One-click Copy for Google Docs (headings + lists)</td></tr>
              <tr><td>Commit parsing</td><td>Manual</td><td>Paste git log lines and auto-categorize</td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
    {
      slug: 'smartsheet-monday-atlassian',
      title: 'Free Alternative to Smartsheet, Monday & Atlassian Release Templates',
      description:
        'Download Word (.docx), Markdown, and Google Docs release notes templates with zero signup or workspace lock-in.',
      h1: 'Release Notes Templates Without Tool Lock-In',
      breadcrumb: 'vs. Smartsheet & Atlassian',
      body: `
        <p>Project management suites like Smartsheet, Monday.com, and Atlassian Confluence offer release note templates, but often require creating an account or keeping notes inside their ecosystem.</p>
        <div class="card">
          <table>
            <thead>
              <tr><th>Feature</th><th>Suite Templates (Smartsheet / Monday / Confluence)</th><th>This Open-Source Library</th></tr>
            </thead>
            <tbody>
              <tr><td>Account required</td><td>Usually yes</td><td>No signup, MIT licensed</td></tr>
              <tr><td>Portable formats</td><td>Locked to suite or basic export</td><td>Native .docx, .md, HTML, Google Docs</td></tr>
              <tr><td>Git commit import</td><td>Requires plugins or paid tiers</td><td>Built-in client-side commit parser</td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
    {
      slug: 'paid-changelog-tools',
      title: 'Free Release Notes Generator vs. Paid Changelog Software',
      description:
        'When a free browser release notes generator is enough vs. when teams need paid changelog SaaS like ReleasePad, Beamer, or LaunchNotes.',
      h1: 'Free Generator vs. Paid Changelog Software',
      breadcrumb: 'vs. Paid Changelog Tools',
      body: `
        <p>If your goal is to draft clean release notes for each version in Word, Google Docs, or GitHub Releases, a free client-side generator covers 100% of the workflow.</p>
        <div class="card">
          <table>
            <thead>
              <tr><th>Use Case</th><th>Free Templates &amp; Generator</th><th>Paid Changelog SaaS (ReleasePad, Beamer, LaunchNotes)</th></tr>
            </thead>
            <tbody>
              <tr><td>Drafting v1.0 release notes</td><td>Instant, $0, no login</td><td>Requires workspace setup &amp; subscription</td></tr>
              <tr><td>Word (.docx) &amp; Google Docs</td><td>Built-in export</td><td>Usually web-only</td></tr>
              <tr><td>Hosted in-app widget &amp; email subscribers</td><td>Not included (use static docs or email tool)</td><td>Built-in hosted portal and subscriber notifications</td></tr>
              <tr><td>Automated GitHub PR sync</td><td>Manual paste of git log lines</td><td>Automatic webhook/AI draft pipelines</td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
  ];

  for (const alt of alternativesPages) {
    const subPath = alt.slug ? `/alternatives/${alt.slug}/` : '/alternatives/';
    const fileRel = alt.slug ? `alternatives/${alt.slug}/index.html` : 'alternatives/index.html';
    urls.push(`${BASE_URL}${subPath}`);

    const crumbs = alt.slug
      ? [
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Alternatives', url: `${BASE_URL}/alternatives/` },
          { name: alt.breadcrumb, url: `${BASE_URL}${subPath}` },
        ]
      : [
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Alternatives', url: `${BASE_URL}${subPath}` },
        ];

    await writePage(
      fileRel,
      pageShell({
        title: alt.title,
        description: alt.description,
        canonicalPath: subPath,
        bodyHtml: `
          <p class="meta-row"><span><a href="${BASE_URL}/">Home</a>${alt.slug ? ` / <a href="${BASE_URL}/alternatives/">Alternatives</a>` : ''} / ${escapeHtml(alt.breadcrumb)}</span></p>
          <h1>${escapeHtml(alt.h1)}</h1>
          ${alt.body}
          <div class="actions">
            <a class="btn btn-primary" href="${BASE_URL}/#generator">Try Free Generator</a>
            <a class="btn" href="${BASE_URL}/#templates">Browse All 14 Templates</a>
          </div>
        `,
        schemaList: [
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: alt.h1,
            dateModified: TODAY,
          },
          breadcrumbSchema(crumbs),
        ],
      }),
    );
  }

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
- Alternatives & Comparisons: ${BASE_URL}/alternatives/
${RELEASE_TEMPLATES.map((t) => `- ${t.name}: ${BASE_URL}/templates/${t.slug}/`).join('\n')}
- Release Notes Format Guide: ${BASE_URL}/guides/how-to-write-release-notes/
- Release Notes vs. Changelog: ${BASE_URL}/guides/release-notes-vs-changelog/
- Release Notes Document Format: ${BASE_URL}/guides/release-notes-document-format/
- Automating Release Notes from Git: ${BASE_URL}/guides/automating-release-notes-from-git/
- GitHub Repository: https://github.com/changelog-software/Release-Notes
`;
  await fs.writeFile(path.join(DIST_DIR, 'llms.txt'), llmsTxt, 'utf8');

  console.log(`Generated ${urls.length} SEO pages, sitemap.xml, robots.txt, and llms.txt.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
