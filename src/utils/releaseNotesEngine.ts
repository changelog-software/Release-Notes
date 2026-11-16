import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import {
  CATEGORY_LABELS,
  type ReleaseCategory,
  type ReleaseItem,
  type ReleaseNotesDocument,
} from '../data/templates.ts';

const CATEGORY_ORDER: ReleaseCategory[] = ['new', 'improved', 'fixed', 'breaking', 'security'];

function stripBulletPrefix(line: string): string {
  return line.replace(/^\s*([-*•]|\d+[.)])\s+/, '').trim();
}

function stripPrSuffix(text: string): { clean: string; ticketOrPr?: string } {
  const match = text.match(/\s+\((#[0-9]+|[A-Z]{2,10}-\d+)\)\s*$/);
  if (match) {
    return {
      clean: text.slice(0, match.index).trim(),
      ticketOrPr: match[1],
    };
  }
  return { clean: text };
}

function detectCategory(line: string): { category: ReleaseCategory; body: string } {
  const conventional = line.match(
    /^(feat|feature|add|added|new|fix|fixed|bugfix|perf|improve|improved|refactor|chore|docs|security|sec|breaking|break)(?:\([^)]+\))?(!)?:\s*(.+)$/i,
  );

  if (conventional) {
    const [, prefix, bang, rest] = conventional;
    const lower = prefix.toLowerCase();
    if (bang || lower === 'breaking' || lower === 'break') {
      return { category: 'breaking', body: rest.trim() };
    }
    if (lower === 'security' || lower === 'sec') {
      return { category: 'security', body: rest.trim() };
    }
    if (lower === 'fix' || lower === 'fixed' || lower === 'bugfix') {
      return { category: 'fixed', body: rest.trim() };
    }
    if (lower === 'feat' || lower === 'feature' || lower === 'add' || lower === 'added' || lower === 'new') {
      return { category: 'new', body: rest.trim() };
    }
    return { category: 'improved', body: rest.trim() };
  }

  const lowerLine = line.toLowerCase();
  if (lowerLine.startsWith('breaking') || lowerLine.includes('breaking change') || lowerLine.startsWith('removed ')) {
    return { category: 'breaking', body: line };
  }
  if (lowerLine.startsWith('security') || lowerLine.includes('cve-') || lowerLine.includes('vulnerability')) {
    return { category: 'security', body: line };
  }
  if (
    lowerLine.startsWith('fix') ||
    lowerLine.startsWith('resolved ') ||
    lowerLine.startsWith('patched ')
  ) {
    return { category: 'fixed', body: line };
  }
  if (
    lowerLine.startsWith('add') ||
    lowerLine.startsWith('new ') ||
    lowerLine.startsWith('introduc') ||
    lowerLine.startsWith('support')
  ) {
    return { category: 'new', body: line };
  }
  return { category: 'improved', body: line };
}

function splitTitleAndDescription(body: string): { title: string; description: string } {
  const sep = body.match(/^([^:—–-]{4,64})\s*(?:—|–|:)\s+(.+)$/);
  if (sep) {
    return {
      title: capitalizeFirst(sep[1].trim()),
      description: capitalizeFirst(sep[2].trim()),
    };
  }
  return {
    title: capitalizeFirst(body),
    description: '',
  };
}

function capitalizeFirst(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Parses raw commit lines or bullet points into categorized release note items.
 */
export function parseRawChanges(rawText: string): ReleaseItem[] {
  const lines = rawText
    .split(/\r?\n/)
    .map(stripBulletPrefix)
    .filter((line) => line.length > 0 && !line.startsWith('#'));

  return lines.map((line, index) => {
    const { category, body } = detectCategory(line);
    const { clean, ticketOrPr } = stripPrSuffix(body);
    const { title, description } = splitTitleAndDescription(clean);

    return {
      id: `parsed-${index + 1}-${Date.now()}`,
      category,
      title,
      description,
      ticketOrPr,
    };
  });
}

export function groupItemsByCategory(items: ReleaseItem[]): Array<{
  category: ReleaseCategory;
  label: string;
  items: ReleaseItem[];
}> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
}

/**
 * Renders a ReleaseNotesDocument into clean, copy-ready Markdown.
 */
export function renderMarkdown(doc: ReleaseNotesDocument): string {
  const lines: string[] = [];
  const headingTitle = [doc.productName.trim(), doc.version.trim()].filter(Boolean).join(' ');

  lines.push(`# ${headingTitle || 'Release Notes'}`);
  lines.push('');

  const metaParts: string[] = [];
  if (doc.releaseDate.trim()) metaParts.push(`**Release Date:** ${doc.releaseDate.trim()}`);
  if (doc.audience.trim()) metaParts.push(`**Audience:** ${doc.audience.trim()}`);
  if (metaParts.length > 0) {
    lines.push(metaParts.join(' | '));
    lines.push('');
  }

  if (doc.summary.trim()) {
    lines.push(doc.summary.trim());
    lines.push('');
  }

  const cleanHighlights = doc.highlights.map((h) => h.trim()).filter(Boolean);
  if (cleanHighlights.length > 0) {
    lines.push('## Highlights');
    lines.push('');
    for (const highlight of cleanHighlights) {
      lines.push(`- ${highlight}`);
    }
    lines.push('');
  }

  for (const group of groupItemsByCategory(doc.items)) {
    lines.push(`## ${group.label}`);
    lines.push('');
    for (const item of group.items) {
      const ref = item.ticketOrPr?.trim() ? ` (${item.ticketOrPr.trim()})` : '';
      if (item.description.trim()) {
        lines.push(`- **${item.title.trim()}**${ref}: ${item.description.trim()}`);
      } else {
        lines.push(`- **${item.title.trim()}**${ref}`);
      }
    }
    lines.push('');
  }

  if (doc.upgradeNotes?.trim()) {
    lines.push('## Upgrade & Deployment Notes');
    lines.push('');
    lines.push(doc.upgradeNotes.trim());
    lines.push('');
  }

  if (doc.knownIssues?.trim()) {
    lines.push('## Known Issues');
    lines.push('');
    lines.push(doc.knownIssues.trim());
    lines.push('');
  }

  if (doc.contactOrFeedback?.trim()) {
    lines.push('---');
    lines.push('');
    lines.push(doc.contactOrFeedback.trim());
    lines.push('');
  }

  return lines.join('\n').trim() + '\n';
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Renders a ReleaseNotesDocument into clean semantic HTML suitable for Google Docs, Notion, or web pages.
 */
export function renderHtml(doc: ReleaseNotesDocument): string {
  const parts: string[] = [];
  const headingTitle = [doc.productName.trim(), doc.version.trim()].filter(Boolean).join(' ');

  parts.push(`<h1>${escapeHtml(headingTitle || 'Release Notes')}</h1>`);

  const metaParts: string[] = [];
  if (doc.releaseDate.trim()) metaParts.push(`<strong>Release Date:</strong> ${escapeHtml(doc.releaseDate.trim())}`);
  if (doc.audience.trim()) metaParts.push(`<strong>Audience:</strong> ${escapeHtml(doc.audience.trim())}`);
  if (metaParts.length > 0) {
    parts.push(`<p>${metaParts.join(' &middot; ')}</p>`);
  }

  if (doc.summary.trim()) {
    parts.push(`<p>${escapeHtml(doc.summary.trim())}</p>`);
  }

  const cleanHighlights = doc.highlights.map((h) => h.trim()).filter(Boolean);
  if (cleanHighlights.length > 0) {
    parts.push('<h2>Highlights</h2>');
    parts.push('<ul>');
    for (const h of cleanHighlights) {
      parts.push(`  <li>${escapeHtml(h)}</li>`);
    }
    parts.push('</ul>');
  }

  for (const group of groupItemsByCategory(doc.items)) {
    parts.push(`<h2>${escapeHtml(group.label)}</h2>`);
    parts.push('<ul>');
    for (const item of group.items) {
      const ref = item.ticketOrPr?.trim() ? ` <span>(${escapeHtml(item.ticketOrPr.trim())})</span>` : '';
      const desc = item.description.trim() ? `: ${escapeHtml(item.description.trim())}` : '';
      parts.push(`  <li><strong>${escapeHtml(item.title.trim())}</strong>${ref}${desc}</li>`);
    }
    parts.push('</ul>');
  }

  if (doc.upgradeNotes?.trim()) {
    parts.push('<h2>Upgrade &amp; Deployment Notes</h2>');
    parts.push(`<p>${escapeHtml(doc.upgradeNotes.trim())}</p>`);
  }

  if (doc.knownIssues?.trim()) {
    parts.push('<h2>Known Issues</h2>');
    parts.push(`<p>${escapeHtml(doc.knownIssues.trim())}</p>`);
  }

  if (doc.contactOrFeedback?.trim()) {
    parts.push('<hr />');
    parts.push(`<p>${escapeHtml(doc.contactOrFeedback.trim())}</p>`);
  }

  return parts.join('\n') + '\n';
}

/**
 * Builds a Microsoft Word (.docx) Document instance using the `docx` library.
 */
export function buildDocxDocument(doc: ReleaseNotesDocument): Document {
  const children: Paragraph[] = [];
  const headingTitle = [doc.productName.trim(), doc.version.trim()].filter(Boolean).join(' ') || 'Release Notes';

  children.push(
    new Paragraph({
      text: headingTitle,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 120 },
    }),
  );

  const metaRuns: TextRun[] = [];
  if (doc.releaseDate.trim()) {
    metaRuns.push(new TextRun({ text: 'Release Date: ', bold: true, color: '475569', size: 20 }));
    metaRuns.push(new TextRun({ text: doc.releaseDate.trim(), color: '475569', size: 20 }));
  }
  if (doc.audience.trim()) {
    if (metaRuns.length > 0) {
      metaRuns.push(new TextRun({ text: '   |   ', color: '94A3B8', size: 20 }));
    }
    metaRuns.push(new TextRun({ text: 'Audience: ', bold: true, color: '475569', size: 20 }));
    metaRuns.push(new TextRun({ text: doc.audience.trim(), color: '475569', size: 20 }));
  }
  if (metaRuns.length > 0) {
    children.push(
      new Paragraph({
        children: metaRuns,
        spacing: { after: 200 },
        border: {
          bottom: { color: 'E2E8F0', space: 6, style: BorderStyle.SINGLE, size: 6 },
        },
      }),
    );
  }

  if (doc.summary.trim()) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: doc.summary.trim(), size: 22 })],
        spacing: { before: 120, after: 200 },
      }),
    );
  }

  const cleanHighlights = doc.highlights.map((h) => h.trim()).filter(Boolean);
  if (cleanHighlights.length > 0) {
    children.push(
      new Paragraph({
        text: 'Highlights',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 80 },
      }),
    );
    for (const h of cleanHighlights) {
      children.push(
        new Paragraph({
          text: h,
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
      );
    }
  }

  for (const group of groupItemsByCategory(doc.items)) {
    children.push(
      new Paragraph({
        text: group.label,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    );

    for (const item of group.items) {
      const runs: TextRun[] = [new TextRun({ text: item.title.trim(), bold: true, size: 22 })];
      if (item.ticketOrPr?.trim()) {
        runs.push(new TextRun({ text: ` (${item.ticketOrPr.trim()})`, color: '64748B', size: 20 }));
      }
      if (item.description.trim()) {
        runs.push(new TextRun({ text: `: ${item.description.trim()}`, size: 22 }));
      }
      children.push(
        new Paragraph({
          children: runs,
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
      );
    }
  }

  if (doc.upgradeNotes?.trim()) {
    children.push(
      new Paragraph({
        text: 'Upgrade & Deployment Notes',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    );
    children.push(
      new Paragraph({
        text: doc.upgradeNotes.trim(),
        spacing: { after: 120 },
      }),
    );
  }

  if (doc.knownIssues?.trim()) {
    children.push(
      new Paragraph({
        text: 'Known Issues',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
      }),
    );
    children.push(
      new Paragraph({
        text: doc.knownIssues.trim(),
        spacing: { after: 120 },
      }),
    );
  }

  if (doc.contactOrFeedback?.trim()) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: doc.contactOrFeedback.trim(), italics: true, color: '475569', size: 20 })],
        spacing: { before: 240 },
        border: {
          top: { color: 'E2E8F0', space: 6, style: BorderStyle.SINGLE, size: 6 },
        },
      }),
    );
  }

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

export async function generateDocxBlob(doc: ReleaseNotesDocument): Promise<Blob> {
  const document = buildDocxDocument(doc);
  return Packer.toBlob(document);
}
