import fs from 'node:fs/promises';
import path from 'node:path';
import { Packer } from 'docx';
import { RELEASE_TEMPLATES } from '../src/data/templates.ts';
import { buildDocxDocument, renderMarkdown } from '../src/utils/releaseNotesEngine.ts';

const ROOT = process.cwd();
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const EXAMPLES_DIR = path.join(ROOT, 'examples');
const PUBLIC_DOWNLOADS_DIR = path.join(ROOT, 'public', 'downloads');

async function main() {
  await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  await fs.mkdir(EXAMPLES_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DOWNLOADS_DIR, { recursive: true });

  for (const tpl of RELEASE_TEMPLATES) {
    // 1. Markdown template
    const tplMd = renderMarkdown(tpl.templateDoc);
    await fs.writeFile(path.join(TEMPLATES_DIR, `${tpl.slug}.md`), tplMd, 'utf8');

    // 2. Word (.docx) template
    const tplDocx = await Packer.toBuffer(buildDocxDocument(tpl.templateDoc));
    await fs.writeFile(path.join(TEMPLATES_DIR, `${tpl.slug}.docx`), tplDocx);
    await fs.writeFile(path.join(PUBLIC_DOWNLOADS_DIR, `${tpl.slug}.docx`), tplDocx);

    // 3. Filled-in Markdown example
    const exMd = renderMarkdown(tpl.exampleDoc);
    await fs.writeFile(path.join(EXAMPLES_DIR, `${tpl.slug}-example.md`), exMd, 'utf8');

    // 4. Filled-in Word (.docx) example
    const exDocx = await Packer.toBuffer(buildDocxDocument(tpl.exampleDoc));
    await fs.writeFile(path.join(EXAMPLES_DIR, `${tpl.slug}-example.docx`), exDocx);
    await fs.writeFile(path.join(PUBLIC_DOWNLOADS_DIR, `${tpl.slug}-example.docx`), exDocx);
  }

  console.log(`Generated ${RELEASE_TEMPLATES.length} templates and examples (.md + .docx).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
