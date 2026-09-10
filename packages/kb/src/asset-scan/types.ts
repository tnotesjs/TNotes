/**
 * Public types for knowledge-base asset analysis.
 *
 * Scan is read-only. Plan preview does not write. Apply/restore persist a
 * journal outside the knowledge base; Desk submits plan IDs only.
 */

export type AssetSyntaxKind =
  | 'markdown-image'
  | 'markdown-link'
  | 'markdown-definition'
  | 'html-src'
  | 'html-href'
  | 'html-srcset'
  | 'html-poster'
  | 'css-url'
  | 'css-import'
  | 'vue-src'
  | 'vue-href'
  | 'vue-import'
  | 'excalidraw-path'
  | 'mindmap-image'
  | 'mindmap-link'
  | 'config-icon'
  | 'uncertain-fence'
  | 'uncertain-comment'
  | 'uncertain-inline-code'
  | 'uncertain-component'
  | 'unsupported-srcset'
  | 'unsupported-poster'
  | 'unsupported-css'
  | 'unsupported-vue'
  | 'unsupported-excalidraw'
  | 'unsupported-html-file'

export type AssetUrlKind = 'local-relative' | 'local-root' | 'remote' | 'data' | 'other'

export type AssetFileKind = 'image' | 'svg' | 'gif' | 'excalidraw' | 'html' | 'css' | 'other'

export type AssetRecordStatus =
  'referenced' | 'idle-candidate' | 'uncertain-idle' | 'uncertain-affected' | 'protected'

export type AssetDiagnosticCode =
  | 'unparsed-source'
  | 'unparsed-component'
  | 'dynamic-expression'
  | 'unsupported-syntax'
  | 'path-compat-root-slash'
  | 'path-out-of-bounds'
  | 'malformed-url'
  | 'read-error'
  | 'symlink-escape'

export type AssetDiagnosticScope = 'target' | 'source' | 'knowledge-base'

export interface AssetReference {
  sourceRelPath: string
  /** 0-based offset of the URL dest in the source file. */
  startOffset: number
  endOffset: number
  /** 1-based. */
  line: number
  column: number
  rawUrl: string
  /** Path without query/fragment, decoded once when possible. */
  decodedPath: string
  /** kb-relative target when this is a local assets path, e.g. `assets/a.png`. */
  targetRelPath: string | null
  syntax: AssetSyntaxKind
  urlKind: AssetUrlKind
  /** Query + fragment preserved from the original dest. */
  urlSuffix: string
  /** Safe to rewrite this dest in a later rename transaction. */
  rewritable: boolean
  noteUuid?: string
  noteTitle?: string
}

export interface AssetRecord {
  relPath: string
  name: string
  size: number
  mtimeMs: number
  kind: AssetFileKind
  status: AssetRecordStatus
  references: AssetReference[]
  protection: string[]
  /** False when unknown sources might still mention this file. */
  renameAllowed: boolean
  /** Four-digit note index from `NNNN-` filename prefix, if any. */
  ownerNoteIndex?: string | null
  sha256?: string
  /** Present when this file shares bytes with others in the same scan. */
  duplicateGroupId?: string
}

export interface AssetBrokenLink {
  reference: AssetReference
  reason: 'missing-file' | 'out-of-bounds' | 'not-a-file'
}

export interface AssetDiagnostic {
  code: AssetDiagnosticCode
  message: string
  scope: AssetDiagnosticScope
  sourceRelPath?: string
  targetRelPath?: string
}

export interface AssetCoverageAdapter {
  id: string
  status: 'complete' | 'partial' | 'missing'
  detail: string
}

export interface AssetScanSource {
  relPath: string
  role:
    | 'note'
    | 'readme'
    | 'toc'
    | 'config'
    | 'unparsed-asset'
    | 'html-asset'
    | 'css-asset'
    | 'vue-source'
    | 'excalidraw-asset'
  bytes: number
  error?: string
}

export interface AssetScanReport {
  generation: number
  coverageComplete: boolean
  batchCleanupAllowed: boolean
  sources: AssetScanSource[]
  assets: AssetRecord[]
  references: AssetReference[]
  brokenLinks: AssetBrokenLink[]
  diagnostics: AssetDiagnostic[]
  adapters: AssetCoverageAdapter[]
  duplicateGroups: AssetDuplicateGroup[]
  stats: {
    assetCount: number
    assetBytes: number
    determinedReferenceCount: number
    uncertainReferenceCount: number
    mergeableDuplicateCount: number
    crossNoteDuplicateCount: number
  }
}

export interface ScanAssetsOptions {
  signal?: AbortSignal
  concurrency?: number
  /** Caller-supplied generation so overlapping scans cannot clobber UI state. */
  generation?: number
  onProgress?: (progress: { done: number; total: number; current?: string }) => void
  /** When true, stream SHA-256 and attach duplicate groups. */
  includeHashes?: boolean
  /** Optional mtime/size hash cache; never stored under KB assets/. */
  hashCachePath?: string
}

export interface AssetDuplicateGroup {
  sha256: string
  ownerNoteIndex: string | null
  relPaths: string[]
  /** Same owner, reusable types, at least two files. Excalidraw never mergeable. */
  mergeable: boolean
}

export interface AssetSourcePatch {
  sourceRelPath: string
  startOffset: number
  endOffset: number
  expected: string
  replacement: string
}

export interface AssetBackupSpec {
  relPath: string
  sha256: string
  /** Optimize: original path when output is a converted file. */
  fromRelPath?: string
}

export interface AssetFileMove {
  fromRelPath: string
  /** Destination inside the knowledge base for rename; omitted when recycling. */
  toRelPath?: string
  sha256: string
}

export type AssetJournalStage =
  | 'pending'
  | 'backed-up'
  | 'applying'
  | 'applied'
  | 'restoring'
  | 'restored'
  | 'failed'

/** Preview does not write the KB. Apply is a library prototype until Desk gates exist. */
export interface AssetOperationPlan {
  id: string
  knowledgeBaseId: string
  generation: number
  coverageComplete: boolean
  kind: 'rename' | 'recycle' | 'restore' | 'merge' | 'optimize'
  /** sha256 of every file that must be unchanged for the plan to stay valid. */
  inputHashes: Record<string, string>
  /** Fingerprint of rewritable refs involved (source+offset+rawUrl). */
  refFingerprint: string
  patches: AssetSourcePatch[]
  backups: AssetBackupSpec[]
  moves: AssetFileMove[]
  /** Optimize outputs written from journal/outputs (empty for rename/recycle/merge). */
  outputs: AssetBackupSpec[]
  /** Files created by this plan that restore should delete when hashes still match. */
  createdRelPaths: string[]
  estimated: { filesTouched: number; bytesMoved: number; bytesSaved?: number }
  blockedReasons: string[]
}

export interface AssetOperationResult {
  planId: string
  status: 'applied' | 'failed' | 'needs-recovery' | 'blocked'
  changedPaths: string[]
  recoveryId?: string
  error?: string
}

export interface AssetJournalRecord {
  version: 1
  stage: AssetJournalStage
  plan: AssetOperationPlan
  rootPath: string
  createdAt: string
}
