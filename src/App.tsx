import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileCode2,
  FileText,
  GitCommitHorizontal,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  CATEGORY_LABELS,
  RELEASE_TEMPLATES,
  type ReleaseCategory,
  type ReleaseItem,
  type ReleaseNotesDocument,
} from './data/templates.ts';
import {
  generateDocxBlob,
  groupItemsByCategory,
  parseRawChanges,
  renderHtml,
  renderMarkdown,
} from './utils/releaseNotesEngine.ts';

const STORAGE_KEY = 'release-notes-generator-draft-v1';

const DEFAULT_RAW_SAMPLE = `- feat(reports): Scheduled PDF & Slack exports (#412)
- perf(funnels): 3x faster 90-day funnel queries
- fix: UTF-8 characters in CSV exports (SD-104)
- security: Updated OpenSSL runtime to 3.3.2
- BREAKING CHANGE: Deprecated offset pagination on /v3/payouts`;

function cloneDoc(doc: ReleaseNotesDocument): ReleaseNotesDocument {
  return {
    ...doc,
    highlights: [...doc.highlights],
    items: doc.items.map((item) => ({ ...item })),
  };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function slugifyFilename(name: string, version: string, ext: string): string {
  const base = `${name || 'release-notes'}-${version || 'draft'}`
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'release-notes'}.${ext}`;
}

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState<string>(RELEASE_TEMPLATES[0].slug);
  const [galleryMode, setGalleryMode] = useState<'example' | 'template'>('example');

  const [doc, setDoc] = useState<ReleaseNotesDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as ReleaseNotesDocument;
      }
    } catch {
      // Ignore storage errors
    }
    return cloneDoc(RELEASE_TEMPLATES[0].exampleDoc);
  });

  const [previewTab, setPreviewTab] = useState<'formatted' | 'markdown' | 'html'>('formatted');
  const [showImport, setShowImport] = useState(false);
  const [rawInput, setRawInput] = useState(DEFAULT_RAW_SAMPLE);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [exportingDocx, setExportingDocx] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    } catch {
      // Ignore storage errors
    }
  }, [doc]);

  const activeTemplate = useMemo(
    () => RELEASE_TEMPLATES.find((t) => t.slug === selectedSlug) ?? RELEASE_TEMPLATES[0],
    [selectedSlug],
  );

  const galleryDoc = galleryMode === 'example' ? activeTemplate.exampleDoc : activeTemplate.templateDoc;
  const galleryMarkdown = useMemo(() => renderMarkdown(galleryDoc), [galleryDoc]);

  const editorMarkdown = useMemo(() => renderMarkdown(doc), [doc]);
  const editorHtml = useMemo(() => renderHtml(doc), [doc]);
  const groupedPreview = useMemo(() => groupItemsByCategory(doc.items), [doc.items]);

  async function copyText(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1800);
    } catch {
      // Clipboard fallback omitted
    }
  }

  function loadIntoGenerator(sourceDoc: ReleaseNotesDocument) {
    setDoc(cloneDoc(sourceDoc));
    const el = document.getElementById('generator');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleParseRaw() {
    const parsed = parseRawChanges(rawInput);
    if (parsed.length === 0) return;
    setDoc((prev) => ({
      ...prev,
      items: parsed,
    }));
    setShowImport(false);
  }

  function addItem() {
    const newItem: ReleaseItem = {
      id: `item-${Date.now()}`,
      category: 'new',
      title: '',
      description: '',
    };
    setDoc((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  }

  function updateItem(id: string, patch: Partial<ReleaseItem>) {
    setDoc((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function removeItem(id: string) {
    setDoc((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }

  async function handleDownloadDocx(targetDoc: ReleaseNotesDocument, filenamePrefix?: string) {
    setExportingDocx(true);
    try {
      const blob = await generateDocxBlob(targetDoc);
      const filename = filenamePrefix
        ? `${filenamePrefix}.docx`
        : slugifyFilename(targetDoc.productName, targetDoc.version, 'docx');
      triggerDownload(blob, filename);
    } finally {
      setExportingDocx(false);
    }
  }

  function handleDownloadMarkdown(targetDoc: ReleaseNotesDocument) {
    const md = renderMarkdown(targetDoc);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    triggerDownload(blob, slugifyFilename(targetDoc.productName, targetDoc.version, 'md'));
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2.5 font-semibold text-base tracking-tight">
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
            >
              RN
            </span>
            <span>Release Notes</span>
          </a>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <a href="#templates" className="hover:underline">Templates</a>
            <a href="#generator" className="hover:underline">Generator</a>
            <a href="#guide" className="hover:underline">Writing Guide</a>
            <a href="#vs-changelog" className="hover:underline">Release Notes vs Changelog</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/changelog-software/Release-Notes"
              target="_blank"
              rel="noreferrer"
              className="text-sm px-3 py-1.5 rounded-md border font-medium"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
            >
              GitHub
            </a>
            <a
              href="#generator"
              className="text-sm px-3.5 py-1.5 rounded-md font-medium"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
            >
              Open Generator
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-16 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-5">
              <h1 className="text-4xl md:text-5xl leading-[1.08] tracking-tight font-normal">
                Release Notes Templates and Generator
              </h1>
              <p className="text-base md:text-lg leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                Free release notes templates for software, SaaS products, mobile apps, and internal releases. Download Word (.docx) templates, copy Markdown examples, or generate release notes from your changes without signing up.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#generator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Create Release Notes
                </a>
                <a
                  href="#templates"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium border"
                  style={{
                    borderColor: 'var(--border-strong)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Browse 6 Templates
                </a>
              </div>
            </div>

            <div className="md:col-span-5">
              <div
                className="rounded-lg border p-5 space-y-3"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Included formats</span>
                  <span>No signup required</span>
                </div>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    <span><strong>Word (.docx) &amp; Google Docs</strong> — formatted templates and instant export</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    <span><strong>Markdown &amp; HTML</strong> — copy-ready for GitHub Releases, Notion, or Confluence</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    <span><strong>Filled-in examples</strong> — realistic SaaS, desktop, mobile, internal, enterprise, and API notes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    <span><strong>Commit parser</strong> — paste git log lines and sort into features, fixes, and breaking changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Template Library */}
        <section id="templates" className="py-12 md:py-16 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto px-5 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Release Notes Templates &amp; Sample Formats
                </h2>
                <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                  Pick the format that fits your audience. Switch between a real filled-in example and a blank template, then download Word (.docx) or copy Markdown.
                </p>
              </div>

              <div
                className="inline-flex rounded-md border p-1 self-start"
                style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
              >
                <button
                  type="button"
                  onClick={() => setGalleryMode('example')}
                  className="px-3 py-1.5 text-xs font-medium rounded"
                  style={
                    galleryMode === 'example'
                      ? { backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  Filled Example
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryMode('template')}
                  className="px-3 py-1.5 text-xs font-medium rounded"
                  style={
                    galleryMode === 'template'
                      ? { backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  Blank Template
                </button>
              </div>
            </div>

            {/* Template Selector + Preview */}
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-2">
                {RELEASE_TEMPLATES.map((tpl) => {
                  const isActive = tpl.slug === activeTemplate.slug;
                  return (
                    <button
                      key={tpl.slug}
                      type="button"
                      onClick={() => setSelectedSlug(tpl.slug)}
                      className="w-full text-left p-4 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                        borderColor: isActive ? 'var(--accent)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="font-semibold text-sm">{tpl.shortName}</div>
                      <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {tpl.bestFor}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-8">
                <div
                  className="rounded-lg border overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                >
                  <div
                    className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3"
                    style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-muted)' }}
                  >
                    <div>
                      <h3 className="font-semibold text-base">{activeTemplate.h1}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Audience: {activeTemplate.audience}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyText(galleryMarkdown, 'gallery-md')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium"
                        style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                      >
                        {copiedKey === 'gallery-md' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'gallery-md' ? 'Copied' : 'Copy Markdown'}
                      </button>

                      <a
                        href={`${import.meta.env.BASE_URL}downloads/${activeTemplate.slug}${galleryMode === 'example' ? '-example' : ''}.docx`}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium"
                        style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Word (.docx)
                      </a>

                      <button
                        type="button"
                        onClick={() => loadIntoGenerator(galleryDoc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
                        style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                      >
                        Edit in Generator
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {activeTemplate.intro}
                    </p>
                    <pre
                      className="p-4 rounded-md text-xs leading-relaxed overflow-x-auto"
                      style={{ backgroundColor: 'var(--bg-code)', color: '#e5e7eb' }}
                    >
                      <code>{galleryMarkdown}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Release Notes Generator */}
        <section id="generator" className="py-12 md:py-16 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto px-5 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Free Release Notes Generator
                </h2>
                <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                  Edit fields below or paste git commits to auto-categorize changes. Export to Word (.docx), Markdown, or Google Docs HTML.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowImport((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium"
                  style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <GitCommitHorizontal className="w-4 h-4" />
                  {showImport ? 'Hide Commit Importer' : 'Paste Commits / Bullet List'}
                </button>
                <button
                  type="button"
                  onClick={() => setDoc(cloneDoc(activeTemplate.templateDoc))}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium"
                  style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to {activeTemplate.shortName}
                </button>
              </div>
            </div>

            {showImport && (
              <div
                className="p-5 rounded-lg border space-y-3"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--accent)' }}
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="raw-commits" className="text-sm font-semibold">
                    Paste git commit lines, PR titles, or bullet points
                  </label>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Supports feat:, fix:, perf:, security:, BREAKING CHANGE:
                  </span>
                </div>
                <textarea
                  id="raw-commits"
                  rows={5}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  className="w-full rounded-md border p-3 text-xs font-mono"
                  style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-page)' }}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleParseRaw}
                    className="px-4 py-2 rounded-md text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                  >
                    Parse &amp; Categorize Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImport(false)}
                    className="px-3 py-2 rounded-md text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Left: Form Editor */}
              <div
                className="lg:col-span-6 rounded-lg border p-5 space-y-5"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block space-y-1 text-xs font-medium">
                    <span>Product / Project Name</span>
                    <input
                      type="text"
                      value={doc.productName}
                      onChange={(e) => setDoc((p) => ({ ...p, productName: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm font-normal"
                      style={{ borderColor: 'var(--border-strong)' }}
                    />
                  </label>
                  <label className="block space-y-1 text-xs font-medium">
                    <span>Version</span>
                    <input
                      type="text"
                      value={doc.version}
                      onChange={(e) => setDoc((p) => ({ ...p, version: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm font-normal"
                      style={{ borderColor: 'var(--border-strong)' }}
                    />
                  </label>
                  <label className="block space-y-1 text-xs font-medium">
                    <span>Release Date</span>
                    <input
                      type="text"
                      value={doc.releaseDate}
                      onChange={(e) => setDoc((p) => ({ ...p, releaseDate: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm font-normal"
                      style={{ borderColor: 'var(--border-strong)' }}
                    />
                  </label>
                  <label className="block space-y-1 text-xs font-medium">
                    <span>Target Audience</span>
                    <input
                      type="text"
                      value={doc.audience}
                      onChange={(e) => setDoc((p) => ({ ...p, audience: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-sm font-normal"
                      style={{ borderColor: 'var(--border-strong)' }}
                    />
                  </label>
                </div>

                <label className="block space-y-1 text-xs font-medium">
                  <span>Release Summary</span>
                  <textarea
                    rows={2}
                    value={doc.summary}
                    onChange={(e) => setDoc((p) => ({ ...p, summary: e.target.value }))}
                    className="w-full rounded-md border px-3 py-2 text-sm font-normal"
                    style={{ borderColor: 'var(--border-strong)' }}
                  />
                </label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Release Items ({doc.items.length})</span>
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded border"
                      style={{ borderColor: 'var(--border-strong)' }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {doc.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-md border space-y-2"
                        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-page)' }}
                      >
                        <div className="flex items-center gap-2">
                          <select
                            aria-label="Change category"
                            value={item.category}
                            onChange={(e) =>
                              updateItem(item.id, { category: e.target.value as ReleaseCategory })
                            }
                            className="rounded border px-2 py-1 text-xs font-medium"
                            style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                          >
                            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                              <option key={val} value={val}>
                                {label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            placeholder="PR or Ticket (optional)"
                            value={item.ticketOrPr ?? ''}
                            onChange={(e) => updateItem(item.id, { ticketOrPr: e.target.value })}
                            className="w-32 rounded border px-2 py-1 text-xs"
                            style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                          />

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                            className="ml-auto p-1 rounded hover:bg-red-50"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Change title"
                          value={item.title}
                          onChange={(e) => updateItem(item.id, { title: e.target.value })}
                          className="w-full rounded border px-2.5 py-1.5 text-sm"
                          style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                        />

                        <input
                          type="text"
                          placeholder="Short user-facing description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          className="w-full rounded border px-2.5 py-1.5 text-xs"
                          style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block space-y-1 text-xs font-medium">
                    <span>Upgrade / Deployment Notes</span>
                    <textarea
                      rows={2}
                      value={doc.upgradeNotes ?? ''}
                      onChange={(e) => setDoc((p) => ({ ...p, upgradeNotes: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-xs font-normal"
                      style={{ borderColor: 'var(--border-strong)' }}
                    />
                  </label>
                  <label className="block space-y-1 text-xs font-medium">
                    <span>Known Issues (optional)</span>
                    <textarea
                      rows={2}
                      value={doc.knownIssues ?? ''}
                      onChange={(e) => setDoc((p) => ({ ...p, knownIssues: e.target.value }))}
                      className="w-full rounded-md border px-3 py-2 text-xs font-normal"
                      style={{ borderColor: 'var(--border-strong)' }}
                    />
                  </label>
                </div>
              </div>

              {/* Right: Live Preview & Export */}
              <div
                className="lg:col-span-6 rounded-lg border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                <div
                  className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2"
                  style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-muted)' }}
                >
                  <div className="inline-flex rounded border p-0.5" style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}>
                    {(['formatted', 'markdown', 'html'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setPreviewTab(tab)}
                        className="px-2.5 py-1 text-xs font-medium rounded capitalize"
                        style={
                          previewTab === tab
                            ? { backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }
                            : { color: 'var(--text-secondary)' }
                        }
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(editorMarkdown, 'gen-md')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium"
                      style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                    >
                      {copiedKey === 'gen-md' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'gen-md' ? 'Copied' : 'Copy MD'}
                    </button>

                    <button
                      type="button"
                      onClick={() => copyText(editorHtml, 'gen-html')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium"
                      style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      {copiedKey === 'gen-html' ? 'Copied' : 'Copy HTML'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadMarkdown(doc)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium"
                      style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-surface)' }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      .md
                    </button>

                    <button
                      type="button"
                      disabled={exportingDocx}
                      onClick={() => handleDownloadDocx(doc)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium"
                      style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      {exportingDocx ? 'Building...' : 'Download .docx'}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {previewTab === 'formatted' && (
                    <article className="space-y-4 text-sm leading-relaxed">
                      <div className="border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                        <h3 className="text-xl font-bold">
                          {[doc.productName, doc.version].filter(Boolean).join(' ') || 'Release Notes'}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {doc.releaseDate && `Release Date: ${doc.releaseDate}`}
                          {doc.releaseDate && doc.audience && ' · '}
                          {doc.audience && `Audience: ${doc.audience}`}
                        </p>
                      </div>

                      {doc.summary && <p style={{ color: 'var(--text-secondary)' }}>{doc.summary}</p>}

                      {groupedPreview.map((group) => (
                        <div key={group.category} className="space-y-1.5 pt-1">
                          <h4 className="font-semibold text-sm">{group.label}</h4>
                          <ul className="list-disc pl-5 space-y-1.5">
                            {group.items.map((item) => (
                              <li key={item.id}>
                                <strong>{item.title || 'Untitled change'}</strong>
                                {item.ticketOrPr ? (
                                  <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
                                    ({item.ticketOrPr})
                                  </span>
                                ) : null}
                                {item.description ? `: ${item.description}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {doc.upgradeNotes && (
                        <div className="pt-2">
                          <h4 className="font-semibold text-sm">Upgrade &amp; Deployment Notes</h4>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {doc.upgradeNotes}
                          </p>
                        </div>
                      )}

                      {doc.knownIssues && (
                        <div className="pt-2">
                          <h4 className="font-semibold text-sm">Known Issues</h4>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {doc.knownIssues}
                          </p>
                        </div>
                      )}
                    </article>
                  )}

                  {previewTab === 'markdown' && (
                    <pre
                      className="p-4 rounded-md text-xs leading-relaxed overflow-x-auto"
                      style={{ backgroundColor: 'var(--bg-code)', color: '#e5e7eb' }}
                    >
                      <code>{editorMarkdown}</code>
                    </pre>
                  )}

                  {previewTab === 'html' && (
                    <pre
                      className="p-4 rounded-md text-xs leading-relaxed overflow-x-auto"
                      style={{ backgroundColor: 'var(--bg-code)', color: '#e5e7eb' }}
                    >
                      <code>{editorHtml}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Writing Guide */}
        <section id="guide" className="py-12 md:py-16 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto px-5 space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              How to Write Clear Release Notes
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div
                className="p-5 rounded-lg border space-y-2"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                <h3 className="font-semibold text-base">1. Lead with user impact</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Write what the user can now do, not which internal service was refactored. Put the most important change in a one-line summary at the top.
                </p>
              </div>
              <div
                className="p-5 rounded-lg border space-y-2"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                <h3 className="font-semibold text-base">2. Group by actionability</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Use predictable headings: New Features, Improvements, Bug Fixes, and Breaking Changes. Readers scan headings before deciding whether to upgrade.
                </p>
              </div>
              <div
                className="p-5 rounded-lg border space-y-2"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
              >
                <h3 className="font-semibold text-base">3. Include next steps</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  State whether action is required, link to migration docs for breaking changes, and mention where users can report regressions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Release Notes vs Changelog */}
        <section id="vs-changelog" className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-5 space-y-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Release Notes vs. Changelog
              </h2>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                Teams often use both: a changelog for a complete chronological record, and release notes for curated version announcements.
              </p>
            </div>

            <div
              className="rounded-lg border overflow-x-auto"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-muted)' }}>
                    <th className="py-3 px-4 font-semibold">Dimension</th>
                    <th className="py-3 px-4 font-semibold">Release Notes</th>
                    <th className="py-3 px-4 font-semibold">Changelog</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                  <tr>
                    <td className="py-3 px-4 font-medium">Primary audience</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>Customers, product teams, stakeholders</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>Developers, contributors, integrators</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Scope</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>Curated highlights, benefits, and upgrade notes</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>Complete chronological list of notable changes</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Tone</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>User-focused, outcome-oriented</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>Technical, concise, standardized (e.g., Keep a Changelog)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Common formats</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>Word (.docx), PDF, in-app modal, email, GitHub Release</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>CHANGELOG.md, RSS feed, public web timeline</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8 text-xs"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
      >
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <strong>Release Notes Templates &amp; Generator</strong> — MIT License · Open-source templates for software teams.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://github.com/changelog-software/Release-Notes" target="_blank" rel="noreferrer" className="hover:underline">
              GitHub Repository
            </a>
            <a href={`${import.meta.env.BASE_URL}templates/saas-release-notes/`} className="hover:underline">
              SaaS Template
            </a>
            <a href={`${import.meta.env.BASE_URL}templates/software-release-notes/`} className="hover:underline">
              Software Template
            </a>
            <a href={`${import.meta.env.BASE_URL}guides/release-notes-vs-changelog/`} className="hover:underline">
              Release Notes vs Changelog
            </a>
            <a href={`${import.meta.env.BASE_URL}sitemap.xml`} className="hover:underline">
              Sitemap
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
