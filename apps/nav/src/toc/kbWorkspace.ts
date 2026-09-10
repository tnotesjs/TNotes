import type { TNotesKbWorkspace } from '@tnotesjs/kb'

// Require the CJS entry of @tnotesjs/kb (dist/index.cjs) so esbuild bundles
// the CommonJS build into this CJS extension bundle. A static ESM `import`
// would resolve the ESM entry; the CJS path keeps the bundle format-safe.
const kb = require('@tnotesjs/kb') as typeof import('@tnotesjs/kb')

/**
 * Get a kb workspace for a knowledge-base repo root.
 * The kb workspace is stateless (every operation re-reads the files it
 * touches), so there is no cache to invalidate and nothing to dispose.
 */
export function getWorkspace(repoRoot: string): TNotesKbWorkspace {
  return kb.createWorkspace({ rootPath: repoRoot })
}
