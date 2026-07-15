import { useEffect, useState } from 'react';

export interface MermaidProps {
  chart: string;
}

// Module-scoped counter for unique diagram ids. `useId()` is NOT reliable here:
// each <Mermaid> is its own React island root with no shared identifierPrefix,
// so two islands can produce the same id and collide in `mermaid.render(id, …)`.
// A module counter is shared across every island of this one bundled module,
// guaranteeing uniqueness within a page.
let mermaidCounter = 0;

/** Reads the app's current theme off `<html data-theme="...">`. */
function currentMermaidTheme(): 'dark' | 'default' {
  if (typeof document === 'undefined') return 'default';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default';
}

/**
 * Renders a Mermaid diagram from source text.
 *
 * `mermaid` is only ever imported inside `useEffect` (never at module scope),
 * so this component is safe to import during Astro's SSR/build pass — no
 * diagram rendering (which needs a DOM) happens until the island hydrates in
 * the browser.
 *
 * Re-renders when the theme changes via the `gfsd:theme` window
 * `CustomEvent` dispatched by the theme toggle. If rendering ever throws
 * (bad syntax, mermaid failing to load, etc.) the raw chart source is shown
 * in a `<pre>` instead, so the page never breaks.
 */
export default function Mermaid({ chart }: MermaidProps) {
  // Assigned once per instance (useState initializer runs only on mount), so it
  // stays stable across theme-driven re-renders while staying unique per island.
  const [id] = useState(() => `mermaid-${mermaidCounter++}`);

  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: currentMermaidTheme(),
        });
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    }

    render();

    const handleThemeChange = () => {
      render();
    };
    window.addEventListener('gfsd:theme', handleThemeChange);

    return () => {
      cancelled = true;
      window.removeEventListener('gfsd:theme', handleThemeChange);
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre>
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return <pre aria-busy="true">{chart}</pre>;
  }

  // eslint-disable-next-line react/no-danger -- SVG markup returned by mermaid.render
  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
}
