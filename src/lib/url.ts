/**
 * Prefix an internal, root-relative path with the site's base path so links
 * work when the app is served from a subpath (GitHub Pages project site).
 *
 * `import.meta.env.BASE_URL` is set by Astro from the `base` config and always
 * has a trailing slash (e.g. `/frontend-backend-system-design/`). We normalize
 * so `withBase('/concepts/x')` -> `/frontend-backend-system-design/concepts/x`
 * and `withBase('/')` -> `/frontend-backend-system-design/`.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${p}`;
}
