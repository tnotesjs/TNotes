/**
 * Directed reference graph: root sources vs isolated mutual references.
 */

export function addEdge(edges: Map<string, Set<string>>, from: string, to: string): void {
  const set = edges.get(from) ?? new Set<string>()
  set.add(to)
  edges.set(from, set)
}

export function rootReachablePaths(
  roots: Iterable<string>,
  edges: Map<string, Set<string>>
): Set<string> {
  const seen = new Set<string>()
  const queue = [...roots]
  while (queue.length > 0) {
    const current = queue.pop()
    if (!current || seen.has(current)) continue
    seen.add(current)
    for (const next of edges.get(current) ?? []) {
      if (!seen.has(next)) queue.push(next)
    }
  }
  return seen
}
