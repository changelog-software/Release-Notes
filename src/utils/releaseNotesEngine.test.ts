import { describe, expect, it } from 'vitest';
import { Packer } from 'docx';
import { RELEASE_TEMPLATES } from '../data/templates';
import {
  buildDocxDocument,
  parseRawChanges,
  renderHtml,
  renderMarkdown,
} from './releaseNotesEngine';

describe('releaseNotesEngine', () => {
  it('parses conventional commits and plain bullets into categorized items', () => {
    const raw = `
      - feat(reports): Scheduled PDF exports (#412)
      - fix: UTF-8 encoding in CSV downloads (SD-104)
      * perf: 3x faster 90-day funnel queries
      - security: Upgraded OpenSSL to 3.3.2
      - BREAKING CHANGE: Removed legacy offset pagination
    `;

    const items = parseRawChanges(raw);
    expect(items).toHaveLength(5);
    expect(items[0]).toMatchObject({
      category: 'new',
      title: 'Scheduled PDF exports',
      ticketOrPr: '#412',
    });
    expect(items[1]).toMatchObject({
      category: 'fixed',
      title: 'UTF-8 encoding in CSV downloads',
      ticketOrPr: 'SD-104',
    });
    expect(items[2].category).toBe('improved');
    expect(items[3].category).toBe('security');
    expect(items[4].category).toBe('breaking');
  });

  it('renders clean Markdown from a template example', () => {
    const saas = RELEASE_TEMPLATES[0];
    const md = renderMarkdown(saas.exampleDoc);

    expect(md).toContain('# Fieldwork Analytics v2.4.0');
    expect(md).toContain('**Release Date:** 2026-11-12');
    expect(md).toContain('## New Features');
    expect(md).toContain('## Bug Fixes');
    expect(md).toContain('Scheduled PDF & Slack Reports');
  });

  it('renders escaped semantic HTML', () => {
    const sw = RELEASE_TEMPLATES[1];
    const html = renderHtml(sw.exampleDoc);

    expect(html).toContain('<h1>SyncDesk Desktop v4.2.1</h1>');
    expect(html).toContain('<h2>New Features</h2>');
    expect(html).toContain('<li><strong>Interactive Conflict Resolver</strong>');
  });

  it('generates a valid .docx buffer for every template and example', async () => {
    for (const tpl of RELEASE_TEMPLATES) {
      const doc = buildDocxDocument(tpl.templateDoc);
      const buf = await Packer.toBuffer(doc);
      expect(buf.byteLength).toBeGreaterThan(2000);

      const exDoc = buildDocxDocument(tpl.exampleDoc);
      const exBuf = await Packer.toBuffer(exDoc);
      expect(exBuf.byteLength).toBeGreaterThan(2000);
    }
  });
});
