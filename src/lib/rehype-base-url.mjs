/**
 * Rehype plugin: prefix root-absolute links/asset refs in rendered markdown
 * with the site's base path, so content authors can keep writing base-agnostic
 * links like `/system-design/<slug>` and they still resolve when the site is
 * served from a subpath (GitHub Pages project site).
 *
 * Rewrites `href`/`src` values that start with a single `/` (not `//`, which is
 * protocol-relative/external) and aren't already base-prefixed.
 *
 * Runs in Node during the build, so the base is passed in from astro.config
 * rather than read from `import.meta.env`.
 *
 * @param {{ base?: string }} [options]
 */
export function rehypeBaseUrl(options = {}) {
  const base = (options.base || '/').replace(/\/$/, ''); // e.g. '/frontend-backend-system-design'
  const ATTRS = ['href', 'src'];

  /** @param {any} node */
  function visit(node) {
    if (node && node.type === 'element' && node.properties) {
      for (const attr of ATTRS) {
        const value = node.properties[attr];
        if (
          typeof value === 'string' &&
          value.startsWith('/') &&
          !value.startsWith('//') &&
          value !== base &&
          !value.startsWith(`${base}/`)
        ) {
          node.properties[attr] = `${base}${value}`;
        }
      }
    }
    if (node && node.children) {
      for (const child of node.children) visit(child);
    }
  }

  return (tree) => {
    visit(tree);
  };
}
