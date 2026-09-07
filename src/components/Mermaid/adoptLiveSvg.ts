/**
 * Mermaid's next `render(id)` deletes `document.getElementById(id)` (and
 * `d${id}` / `i${id}` temps). Keep the theme CSS (`#id …`) working by renaming
 * only the root svg id after we take ownership of the markup.
 */
export function adoptLiveSvg(svg: string, renderId: string): string {
  if (!renderId || !svg.includes(renderId)) return svg
  const liveId = `${renderId}-live`
  const withRootId = svg.replace(/(<svg\b[^>]*?)\sid="([^"]*)"/i, (full, prefix, id) =>
    id === renderId ? `${prefix} id="${liveId}"` : full
  )
  const escaped = renderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // `#tn-mermaid-1{` / `#tn-mermaid-1 .node` — not `#tn-mermaid-1_flowchart-…`
  return withRootId.replace(new RegExp(`#${escaped}(?![\\w-])`, 'g'), `#${liveId}`)
}
