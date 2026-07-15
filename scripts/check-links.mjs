#!/usr/bin/env node
// Validates internal links in a built Astro site under `dist/`.
//
// Usage: node scripts/check-links.mjs
// Exit code 0 when every internal link resolves to an emitted file,
// 1 when at least one is broken.

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.resolve(__dirname, '..', 'dist');

/** Recursively collect every `.html` file under `dir`. */
async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

/** Extract all `href="..."` / `href='...'` attribute values from an HTML string. */
function extractHrefs(html) {
  const hrefs = [];
  const re = /\bhref\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    hrefs.push(match[2]);
  }
  return hrefs;
}

const EXTERNAL_PREFIXES = ['http://', 'https://', '//', 'mailto:', 'tel:'];

function isExternal(href) {
  return EXTERNAL_PREFIXES.some(prefix => href.startsWith(prefix));
}

async function fileExists(p) {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

/**
 * Resolve an internal href (from the page at `sourceFile`) to a set of
 * candidate emitted files, following Astro's trailing-slash convention:
 * `/foo` or `/foo/` may resolve to `dist/foo/index.html` or `dist/foo.html`.
 */
async function resolves(href, sourceFile) {
  // Strip fragment and query before resolving.
  let pathname = href.split('#')[0].split('?')[0];

  // A link that was purely `#frag` or `?query` refers to the current page,
  // and is already known to exist (the source file itself was found by the
  // scan). Nothing left to resolve.
  if (pathname === '') return true;

  let target;
  if (pathname.startsWith('/')) {
    target = path.join(distRoot, decodeURIComponent(pathname));
  } else {
    target = path.join(path.dirname(sourceFile), decodeURIComponent(pathname));
  }
  target = path.normalize(target);

  // Must stay within dist/ — anything else is not our concern here.
  if (!target.startsWith(distRoot)) return true;

  const candidates = [];
  if (target === distRoot || pathname === '/' ) {
    candidates.push(path.join(distRoot, 'index.html'));
  } else if (target.endsWith(path.sep)) {
    candidates.push(path.join(target, 'index.html'));
  } else {
    const ext = path.extname(target);
    if (ext === '') {
      // Directory-style route: try Astro's folder/index.html convention,
      // then a flat `.html` file.
      candidates.push(path.join(target, 'index.html'));
      candidates.push(`${target}.html`);
    } else {
      // Already has an extension (asset, or explicit .html) — check as-is.
      candidates.push(target);
    }
  }

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return true;
  }
  return false;
}

async function main() {
  let htmlFiles;
  try {
    htmlFiles = await findHtmlFiles(distRoot);
  } catch (err) {
    console.error(`Could not read dist/ at ${distRoot}: ${err.message}`);
    console.error('Did you run `npm run build` first?');
    process.exit(1);
  }

  let totalChecked = 0;
  const broken = []; // { href, source }

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf-8');
    const hrefs = extractHrefs(html);
    const relSource = path.relative(distRoot, file);

    for (const href of hrefs) {
      if (href === '' || href.startsWith('#') || isExternal(href)) continue;
      // javascript:, data:, etc. are not page links; skip.
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('/')) continue;

      totalChecked += 1;
      const ok = await resolves(href, file);
      if (!ok) {
        broken.push({ href, source: relSource });
      }
    }
  }

  console.log(`Checked ${totalChecked} internal link(s) across ${htmlFiles.length} page(s).`);

  if (broken.length === 0) {
    console.log('No broken internal links found.');
    process.exit(0);
  }

  console.error(`\nFound ${broken.length} broken internal link(s):\n`);
  for (const { href, source } of broken) {
    console.error(`  ${href}  (linked from dist/${source})`);
  }
  process.exit(1);
}

main();
