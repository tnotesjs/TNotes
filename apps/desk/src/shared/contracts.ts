export const IPC_CHANNELS = {
  bootstrap: 'desk:bootstrap',
  windowClose: 'window:close',
  tabShortcut: 'tab:shortcut',
  tabConfirmClose: 'tab:confirm-close',
  contextMenuShow: 'context-menu:show',
  knowledgeSidebarMenuShow: 'knowledge-sidebar-menu:show',
  navigatorSidebarMenuShow: 'navigator-sidebar-menu:show',
  workspaceChoose: 'workspace:choose',
  workspaceSet: 'workspace:set',
  workspaceRefresh: 'workspace:refresh',
  workspaceReveal: 'workspace:reveal',
  workspaceRevealKnowledgeBase: 'workspace:reveal-knowledge-base',
  knowledgeBaseCreate: 'knowledge-base:create',
  knowledgeBaseRead: 'knowledge-base:read',
  knowledgeBaseReadSettings: 'knowledge-base:read-settings',
  knowledgeBaseWriteSettings: 'knowledge-base:write-settings',
  knowledgeBaseWriteIcon: 'knowledge-base:write-icon',
  kbOpenAssetsRequested: 'kb:open-assets-requested',
  assetsScan: 'assets:scan',
  assetsScanCancel: 'assets:scan-cancel',
  assetsSummaries: 'assets:summaries',
  assetsScanProgress: 'assets:scan-progress',
  assetsPlanRename: 'assets:plan-rename',
  assetsPlanRecycle: 'assets:plan-recycle',
  assetsPlanMerge: 'assets:plan-merge',
  assetsPreviewOptimize: 'assets:preview-optimize',
  assetsPlanOptimize: 'assets:plan-optimize',
  assetsApply: 'assets:apply',
  assetsRestore: 'assets:restore',
  assetsHistory: 'assets:history',
  assetsGateQuery: 'assets:gate-query',
  assetsGateReply: 'assets:gate-reply',
  assetsPrepareApply: 'assets:prepare-apply',
  assetsApplied: 'assets:applied',
  assetsApplySettled: 'assets:apply-settled',
  settingsUpdate: 'settings:update',
  settingsExport: 'settings:export',
  settingsImport: 'settings:import',
  settingsReset: 'settings:reset',
  settingsReadRaw: 'settings:read-raw',
  settingsWriteRaw: 'settings:write-raw',
  noteRead: 'note:read',
  noteResolveTable: 'note:resolve-table',
  noteSave: 'note:save',
  noteCreate: 'note:create',
  noteRename: 'note:rename',
  noteUpdateConfig: 'note:update-config',
  noteCopyPath: 'note:copy-path',
  noteRevealInFileManager: 'note:reveal-in-file-manager',
  attachmentWriteLocal: 'attachment:write-local',
  attachmentUploadImage: 'attachment:upload-image',
  imageTokenStatus: 'image:token-status',
  imageTokenUpdate: 'image:token-update',
  imageSettingsValidate: 'image:settings-validate',
  searchQuery: 'search:query',
  kbBuild: 'kb:build',
  gitList: 'git:list',
  gitRefresh: 'git:refresh',
  gitFetch: 'git:fetch',
  gitPull: 'git:pull',
  gitPublish: 'git:publish',
  ideShowKnowledgeBaseMenu: 'ide:show-knowledge-base-menu',
  kbOpenSettingsRequested: 'kb:open-settings-requested',
  ideShowNoteMenu: 'ide:show-note-menu',
  ideShowFileMenu: 'ide:show-file-menu',
  ideOpenKnowledgeBase: 'ide:open-knowledge-base',
  ideOpenNote: 'ide:open-note',
  tocMove: 'toc:move',
  tocCreateGroup: 'toc:create-group',
  tocRenameGroup: 'toc:rename-group',
  tocPreviewDelete: 'toc:preview-delete',
  tocDelete: 'toc:delete',
  sessionRead: 'session:read',
  sessionSave: 'session:save',
  recoveryWrite: 'recovery:write',
  recoveryDelete: 'recovery:delete',
  webCreate: 'web:create',
  webLayout: 'web:layout',
  webHideAll: 'web:hide-all',
  webClose: 'web:close',
  webNavigate: 'web:navigate',
  webGoBack: 'web:go-back',
  webGoForward: 'web:go-forward',
  webReload: 'web:reload',
  webStop: 'web:stop',
  webSelectAll: 'web:select-all',
  webOpenExternal: 'web:open-external',
  webClearBrowsingData: 'web:clear-browsing-data',
  previewStart: 'preview:start',
  previewStop: 'preview:stop',
  previewList: 'preview:list',
  workspaceChanged: 'workspace:changed',
  noteExternalChanged: 'note:external-changed',
  webStateChanged: 'web:state-changed',
  webOpenRequested: 'web:open-requested',
  previewChanged: 'preview:changed',
  gitStateChanged: 'git:state-changed',
  updateStatus: 'update:status',
  updateCheck: 'update:check',
  updateOpenRelease: 'update:open-release',
  updateChanged: 'update:changed',
  log: 'desk:log'
} as const

export interface DeskError {
  code: string
  message: string
  diagnosticId?: string
  details?: Record<string, unknown>
}

export type DeskResult<T> = { ok: true; value: T } | { ok: false; error: DeskError }

export interface WorkspaceDiagnosticDto {
  code: string
  message: string
  severity: 'error' | 'warning' | 'info'
  path?: string
}

export interface KnowledgeBaseIconDto {
  src?: string
  svg?: string
  letter?: string
}

export interface KnowledgeBaseDescriptor {
  id: string
  configId: string
  name: string
  rootPath: string
  displayName: string
  icon: KnowledgeBaseIconDto | null
  repositoryUrl?: string
  pageUrl?: string
  /** GitHub-style repo name from tnotes.json (`name`), when set. */
  configName?: string
  /** Site preview port from tnotes.json; defaults to 9193 when omitted. */
  port?: number
  rootUrl?: string
  statsEnabled?: boolean
  /** 库级约定（tnotes.json）：保存时格式化。undefined = 未设置，跟随 desk 全局。 */
  prettier?: boolean
  /** 库级约定（tnotes.json）：自动提交推送。 */
  autoPush?: { enabled: boolean; idleMinutes: number }
  /** 库级约定（tnotes.json）：标题编号层级上限（1-6）。 */
  headingNumberMaxDepth?: number
  health: 'ready' | 'invalid' | 'future-schema'
  diagnostics: WorkspaceDiagnosticDto[]
  noteCount: number
  snapshotRevision: string
}

/** Form payload for the knowledge-base settings tab. */
export interface KnowledgeBaseSettingsDto {
  knowledgeBaseId: string
  name: string
  title: string
  icon: KnowledgeBaseIconDto | null
  repositoryUrl: string
  rootUrl: string
  port: number
  pageUrl: string
  statsEnabled: boolean
  isGitRepo: boolean
  originUrl: string | null
  /** Suggested name when `name` is empty (origin / directory). */
  suggestedName: string | null
  /** 库级约定，null = 未设置（跟随 desk 全局）。 */
  prettier: boolean | null
  autoPush: { enabled: boolean; idleMinutes: number } | null
  headingNumberMaxDepth: number | null
}

export interface KnowledgeBaseSettingsWriteRequest {
  knowledgeBaseId: string
  name: string
  title: string
  repositoryUrl?: string
  rootUrl?: string
  port: number
  pageUrl?: string
  statsEnabled: boolean
  /** null = 从 tnotes.json 删除该键（跟随全局）。 */
  prettier?: boolean | null
  autoPush?: { enabled: boolean; idleMinutes: number } | null
  headingNumberMaxDepth?: number | null
}

export interface KnowledgeBaseCreateRequest {
  folderName: string
  title?: string
  /** Write package.json for CLI / local build. Implied by githubPages. */
  packageJson?: boolean
  /** Write GitHub Pages deploy.yml (also enables packageJson). */
  githubPages?: boolean
  /** Write root README.md. */
  readme?: boolean
  /** Run git init in the new knowledge-base folder. */
  gitInit?: boolean
}

export interface KnowledgeBaseCreateResult {
  overview: WorkspaceOverview
  knowledgeBaseId: string
}

export type AssetRecordStatusDto =
  'referenced' | 'idle-candidate' | 'uncertain-idle' | 'uncertain-affected' | 'protected'

export interface AssetReferenceDto {
  sourceRelPath: string
  startOffset: number
  endOffset: number
  line: number
  column: number
  rawUrl: string
  decodedPath: string
  targetRelPath: string | null
  syntax: string
  urlKind: string
  urlSuffix: string
  rewritable: boolean
  noteUuid?: string
  noteTitle?: string
}

export interface AssetRecordDto {
  relPath: string
  name: string
  size: number
  mtimeMs: number
  kind: string
  status: AssetRecordStatusDto
  references: AssetReferenceDto[]
  protection: string[]
  renameAllowed: boolean
  ownerNoteIndex?: string | null
  sha256?: string
  duplicateGroupId?: string
}

export interface AssetScanReportDto {
  generation: number
  coverageComplete: boolean
  batchCleanupAllowed: boolean
  sources: Array<{
    relPath: string
    role: string
    bytes: number
    error?: string
  }>
  assets: AssetRecordDto[]
  references: AssetReferenceDto[]
  brokenLinks: Array<{ reference: AssetReferenceDto; reason: string }>
  diagnostics: Array<{
    code: string
    message: string
    scope: string
    sourceRelPath?: string
    targetRelPath?: string
  }>
  adapters: Array<{ id: string; status: string; detail: string }>
  duplicateGroups: Array<{
    sha256: string
    ownerNoteIndex: string | null
    relPaths: string[]
    mergeable: boolean
  }>
  stats: {
    assetCount: number
    assetBytes: number
    determinedReferenceCount: number
    uncertainReferenceCount: number
    mergeableDuplicateCount: number
    crossNoteDuplicateCount: number
  }
}

export interface AssetScanProgressDto {
  knowledgeBaseId: string
  generation: number
  done: number
  total: number
  current?: string
}

export interface AssetKbSummaryDto {
  knowledgeBaseId: string
  displayName: string
  fileCount: number
  bytes: number
}

export interface AssetOperationPlanDto {
  id: string
  kind: 'rename' | 'recycle' | 'restore' | 'merge' | 'optimize'
  generation: number
  coverageComplete: boolean
  blockedReasons: string[]
  estimated: { filesTouched: number; bytesMoved: number; bytesSaved?: number }
  moves: Array<{ fromRelPath: string; toRelPath?: string }>
  sourceRelPaths: string[]
}

export interface AssetOperationResultDto {
  planId: string
  status: 'applied' | 'failed' | 'needs-recovery' | 'blocked'
  changedPaths: string[]
  recoveryId?: string
  error?: string
}

export interface AssetJournalDto {
  planId: string
  kind: 'rename' | 'recycle' | 'restore' | 'merge' | 'optimize'
  stage: string
  createdAt: string
  restorable: boolean
  estimated: { filesTouched: number; bytesMoved: number }
  moves: Array<{ fromRelPath: string; toRelPath?: string }>
}

export interface AssetGateQueryEvent {
  requestId: string
  knowledgeBaseId: string
}

export interface AssetEditorSnapshotDto {
  dirtyDocuments: Array<{ noteUuid: string; title: string; saving: boolean }>
  dirtyTabs: Array<{ type: string; title: string }>
  pendingRecoveries: Array<{ noteUuid: string; title: string }>
  pendingEdits: Array<{ noteUuid: string }>
  kbSettingsDirty: boolean
}

export interface AssetPrepareApplyEvent {
  knowledgeBaseId: string
  noteUuids: string[]
}

export interface AssetAppliedEvent {
  knowledgeBaseId: string
  noteUuids: string[]
  changedRelPaths: string[]
  revision: number
}

export interface AssetApplySettledEvent {
  knowledgeBaseId: string
  noteUuids: string[]
}

export type KnowledgeBaseIconWriteRequest =
  | {
      knowledgeBaseId: string
      kind: 'file'
      fileName: string
      data: Uint8Array
    }
  | {
      knowledgeBaseId: string
      kind: 'letter'
      letter: string
    }
  | {
      knowledgeBaseId: string
      kind: 'clear'
    }

export type DeskTocNode =
  | {
      type: 'group'
      title: string
      tocLineIndex: number
      nodeId: string
      folderPath: string[]
      children: DeskTocNode[]
    }
  | {
      type: 'note'
      uuid: string
      title: string
      dirName: string
      noteIndex: string
      tocLineIndex: number
      nodeId: string
      completed: boolean
      children: DeskTocNode[]
    }

export interface KnowledgeBaseDetail extends KnowledgeBaseDescriptor {
  toc: DeskTocNode[]
}

export interface WorkspaceOverview {
  path: string | null
  knowledgeBases: KnowledgeBaseDescriptor[]
  allKnowledgeBases: KnowledgeBaseDescriptor[]
}

export type NoteViewMode = 'visual' | 'readonly' | 'source'
export type NotePageWidth = 'standard' | 'wide'
export type NoteTocDisplay = 'hidden' | 'collapsed' | 'expanded'
export type TabCloseChoice = 'save' | 'discard' | 'cancel'
export type ContextMenuAction =
  | 'close'
  | 'close-saved'
  | 'close-all'
  | 'close-web'
  | 'copy-path'
  | 'reveal-file'
  | 'reveal-toc'
  | 'toggle-pin'
  | 'open-ide'
  | 'open-split'
  | 'rename'
  | 'toggle-done'
  | 'add-before'
  | 'add-after'
  | 'request-delete'
export type ContextMenuRequest =
  | { kind: 'note'; pinned: boolean; completed: boolean }
  | { kind: 'group' }
  | { kind: 'tab'; tabType: 'note' | 'web' | 'kb-settings' | 'kb-assets'; pinned: boolean }
  | { kind: 'code-group-tab' }

export interface KnowledgeSidebarMenuRequest {
  hasWorkspace: boolean
  loading: boolean
}

export type KnowledgeSidebarMenuAction =
  'create' | 'refresh' | 'reveal-workspace' | 'choose-workspace'

export interface NavigatorSidebarMenuRequest {
  ready: boolean
  previewLabel: string
  buildBusy: boolean
}

export type NavigatorSidebarMenuAction =
  'create-note' | 'create-group' | 'preview' | 'build' | 'assets' | 'settings' | 'ide' | 'reveal'

export type TabShortcutCommand =
  | { type: 'activate-tab-by-number'; number: number; sourceTabId?: string }
  | 'close-active-tab-or-window'
  | 'close-saved-note-tabs'
  | 'close-all-tabs'
  | 'keep-active-tab-open'
  | 'toggle-pin-active-tab'
  | 'copy-active-note-path'
  | 'reveal-active-note-in-file-manager'
  | 'next-tab'
  | 'previous-tab'
  | 'increase-app-zoom'
  | 'decrease-app-zoom'
  | 'reset-app-zoom'
  | 'open-quick-open'
  | 'open-command-palette'
  | 'select-all'
export type ThemeMode = 'system' | 'light' | 'dark'
export type InterfaceDensity = 'compact' | 'comfortable'
export type IdeKind = 'vscode' | 'cursor'
export type ImageDefaultTarget = 'local' | 'github'

export interface GitHubImageSettings {
  repository: string
  branch: string
  path: string
  cdnTemplate: string
  fileNameFormat: string
}

export interface ImageUploadSettings {
  defaultTarget: ImageDefaultTarget
  github: GitHubImageSettings
  optimize: AssetOptimizeSettings
}

export type AssetOptimizeEncoder = 'sharp' | 'oxipng'
export type AssetOptimizeOutputFormat = 'keep' | 'webp' | 'jpeg'

export interface AssetOptimizeSettings {
  /** Default encoder. oxipng is reserved and disabled until a later lossless backend lands. */
  encoder: AssetOptimizeEncoder
  quality: number
  maxDimension: number | null
  outputFormat: AssetOptimizeOutputFormat
}

export interface AssetOptimizePreviewItemDto {
  fromRelPath: string
  toRelPath: string
  bytesBefore: number
  bytesAfter?: number
  width?: number
  height?: number
  ms: number
  skipped?: string
  lossy: true
  encoder: 'sharp'
  format?: string
  previewDataUrl?: string
}

export interface AssetOptimizePreviewDto {
  items: AssetOptimizePreviewItemDto[]
  bytesBefore: number
  bytesAfter: number
  skippedCount: number
}

export interface KnowledgeBaseSettings {
  hidden?: boolean
}

export interface AppSettings {
  version: 1
  theme: ThemeMode
  density: InterfaceDensity
  defaultNoteView: NoteViewMode
  defaultNotePageWidth: NotePageWidth
  noteTocDisplay: NoteTocDisplay
  /** 标题编号层级上限（1-6）：1. 与 1.1. 允许出现的最大段数。 */
  headingNumberMaxDepth: number
  appZoomPercent: number
  autosave: {
    enabled: boolean
    delayMs: number
  }
  createNotePosition: 'top' | 'end'
  workspaceLayout: 'kb-dir-content' | 'content-dir-kb'
  prettier: boolean
  ide: IdeKind
  gitPath: string | null
  nodePath: string | null
  confirmBeforeCommit: boolean
  tabs: {
    maxOpenCount: number
    wrap: boolean
    autoRevealInToc: boolean
  }
  toc: {
    showNoteIndex: boolean
    showNoteStatus: boolean
    doneEmoji: string
    undoneEmoji: string
    changesCollapsedByDefault: boolean
  }
  imageUpload: ImageUploadSettings
  updates: {
    autoCheck: boolean
  }
  hiddenKnowledgeBases: string[]
  knowledgeBases: Record<string, KnowledgeBaseSettings>
}

export type UpdateStateKind = 'idle' | 'checking' | 'up-to-date' | 'available' | 'error'

export interface UpdateStatusDto {
  state: UpdateStateKind
  currentVersion: string
  latestVersion?: string
  releaseUrl?: string
  checkedAt?: string
  message?: string
}

export interface BootstrapPayload {
  workspace: WorkspaceOverview
  settings: AppSettings
  platform: 'darwin' | 'win32' | 'linux'
  session: WorkspaceSession | null
  recoveries: RecoveryRecord[]
}

export interface RecoveryRecord {
  version: 1
  knowledgeBaseId: string
  noteUuid: string
  /** Missing for README.md recoveries created by older Desk releases. */
  path?: string
  title: string
  content: string
  revision: string
  updatedAt: string
}

export interface RecoveryWriteRequest {
  knowledgeBaseId: string
  noteUuid: string
  path?: string
  title: string
  content: string
  revision: string
}

export interface RecoveryDeleteRequest {
  knowledgeBaseId: string
  noteUuid: string
  path?: string
}

export interface NoteEditorTab {
  id: string
  type: 'note'
  knowledgeBaseId: string
  knowledgeBaseName: string
  noteUuid: string
  title: string
  icon: KnowledgeBaseIconDto | null
  viewMode: NoteViewMode
  pageWidth: NotePageWidth
  /** Side outline next to the visual editor. Default true. */
  outlineVisible?: boolean
  preview?: boolean
  pinned?: boolean
  openedAt?: number
  dirty?: boolean
}

export interface WebEditorTab {
  id: string
  type: 'web'
  url: string
  title: string
  pinned?: boolean
  openedAt?: number
}

export interface KbSettingsEditorTab {
  id: string
  type: 'kb-settings'
  knowledgeBaseId: string
  knowledgeBaseName: string
  title: string
  icon: KnowledgeBaseIconDto | null
  pinned?: boolean
  openedAt?: number
  dirty?: boolean
}

export interface KbAssetsEditorTab {
  id: string
  type: 'kb-assets'
  knowledgeBaseId: string
  knowledgeBaseName: string
  title: string
  icon: KnowledgeBaseIconDto | null
  pinned?: boolean
  openedAt?: number
  dirty?: boolean
}

export type EditorTab = NoteEditorTab | WebEditorTab | KbSettingsEditorTab | KbAssetsEditorTab

export interface EditorGroupNode {
  type: 'group'
  id: string
  tabs: EditorTab[]
  activeTabId: string | null
}

export interface EditorSplitNode {
  type: 'split'
  id: string
  direction: 'horizontal' | 'vertical'
  ratio: number
  first: EditorLayoutNode
  second: EditorLayoutNode
}

export type EditorLayoutNode = EditorGroupNode | EditorSplitNode

export interface KnowledgeBaseEditorSession {
  layout: EditorLayoutNode
  activeGroupId: string
  lastNoteByGroup?: Record<string, { noteUuid: string; noteTitle: string }>
}

export interface WorkspaceSession {
  version: 1
  selectedKnowledgeBaseId: string | null
  layout: EditorLayoutNode
  activeGroupId: string
  knowledgeBaseEditors: Record<string, KnowledgeBaseEditorSession>
  knowledgeSidebarWidth: number
  navigatorSidebarWidth: number
  knowledgeSidebarCollapsed: boolean
  navigatorSidebarCollapsed: boolean
  expandedTocNodes: Record<string, string[]>
}

export interface WebBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface WebCreateRequest {
  tabId: string
  url: string
}

export interface WebLayoutRequest {
  tabId: string
  visible: boolean
  bounds?: WebBounds
}

export interface WebNavigateRequest {
  tabId: string
  url: string
}

export interface WebTabState {
  tabId: string
  url: string
  title: string
  canGoBack: boolean
  canGoForward: boolean
  loading: boolean
  faviconUrl?: string
  error?: string
}

export interface WebOpenRequestedEvent {
  sourceTabId: string
  url: string
}

export interface PreviewStateDto {
  knowledgeBaseId: string
  knowledgeBaseName: string
  status: 'idle' | 'starting' | 'ready' | 'error'
  port: number | null
  baseUrl: string | null
  error: string | null
}

export interface PreviewStartRequest {
  knowledgeBaseId: string
  noteDirName?: string
}

export interface PreviewStartResult {
  state: PreviewStateDto
  url: string | null
}

export interface NoteDocumentDto {
  knowledgeBaseId: string
  uuid: string
  index: string
  title: string
  /** File stem, e.g. "0001. 标题" (kept for display/preview URLs). */
  dirName: string
  /** File name inside notes/, e.g. "0001. 标题.md". */
  fileName: string
  /** POSIX path relative to the kb root. */
  relPath: string
  /** Absolute path of the single note file. */
  filePath: string
  content: string
  revision: string
  config: NoteConfigDto
  readOnly: boolean
}

/** Slimmed note config: description from frontmatter, done from TOC. */
export interface NoteConfigDto {
  done: boolean
  description?: string
}

/** Rows for `<NotesTable>` preview — Desk adapter over workspace snapshot. */
export interface NotesTableResolveRowDto {
  id: string
  title: string
  description: string
  /** Present when the id maps to a note in this knowledge base. */
  noteUuid: string | null
}

export interface NotesTableResolveRequest {
  knowledgeBaseId: string
  ids: string[]
}

export interface NotesTableResolveResult {
  notes: NotesTableResolveRowDto[]
  missingIds: string[]
}

export interface NoteMutationDto {
  note: NoteDocumentDto
  knowledgeBase: KnowledgeBaseDetail
  changedFiles: Array<{
    path: string
    kind: 'created' | 'updated' | 'deleted' | 'renamed' | 'trashed'
    previousPath?: string
  }>
}

export interface NoteSaveRequest {
  knowledgeBaseId: string
  noteUuid: string
  content: string
  expectedRevision: string
  prettier?: boolean
}

export interface NoteCreateRequest {
  knowledgeBaseId: string
  title: string
  placement?:
    | { type: 'root'; placement?: 'start' | 'end' }
    | {
        type: 'note'
        targetNoteUuid: string
        placement: 'before' | 'after' | 'inside'
      }
    | {
        type: 'folder'
        folderPath: string[]
        placement: 'before' | 'after' | 'inside'
      }
  expectedSnapshotRevision?: string
}

export interface NoteRenameRequest {
  knowledgeBaseId: string
  noteUuid: string
  title: string
  expectedRevision: string
}

export interface NoteUpdateConfigRequest {
  knowledgeBaseId: string
  noteUuid: string
  expectedRevision: string
  updates: {
    done?: boolean
    description?: string
  }
}

export interface AttachmentWriteLocalRequest {
  knowledgeBaseId: string
  /** Owning note — local paste names start with this note's 4-digit index. */
  noteUuid: string
  fileName: string
  data: Uint8Array
}

export interface AttachmentWriteLocalResult {
  absolutePath: string
  markdownPath: string
  reused?: boolean
}

export interface ImageUploadRequest extends AttachmentWriteLocalRequest {}

export interface ImageUploadResult {
  markdownPath: string
  target: ImageDefaultTarget
  fallback: boolean
  absolutePath?: string
  remotePath?: string
  warning?: string
}

export interface ImageTokenStatus {
  configured: boolean
  encryptionAvailable: boolean
}

export interface ImageTokenUpdateRequest {
  token?: string
  clear: boolean
}

export interface ImageSettingsValidateRequest {
  github: GitHubImageSettings
  token?: string
}

export interface ImageSettingsValidateResult {
  repository: string
  branch: string
  message: string
}

export interface SearchRequest {
  query: string
  knowledgeBaseId: string | null
  limit?: number
}

export interface SearchResultDto {
  knowledgeBaseId: string
  knowledgeBaseName: string
  noteUuid: string
  noteIndex: string
  /** Real note folder / file stem, e.g. "0001. 标题". */
  fileName: string
  title: string
  snippet: string
  score: number
}

export type GitFileStatus =
  'modified' | 'added' | 'deleted' | 'renamed' | 'untracked' | 'conflicted'

export interface GitFileChangeDto {
  path: string
  previousPath?: string
  status: GitFileStatus
  staged: boolean
  worktree: boolean
  noteUuid?: string
  noteIndex?: string
  noteTitle?: string
}

export interface GitRepositoryStateDto {
  knowledgeBaseId: string
  knowledgeBaseName: string
  initialized: boolean
  branch: string | null
  upstream: string | null
  ahead: number
  behind: number
  changes: GitFileChangeDto[]
  conflict: boolean
  busy: 'fetch' | 'pull' | 'publish' | null
  lastFetchedAt: string | null
  error: string | null
}

export interface GitOperationResult {
  state: GitRepositoryStateDto
  message: string
  conflict: boolean
}

export interface KbBuildResult {
  outDir: string
  pageCount: number
}

export type TocEntryRefDto =
  | { type: 'note'; noteUuid: string }
  | { type: 'folder'; folderPath: string[] }
  | { type: 'line'; tocLineIndex: number }

export interface TocMoveRequest {
  knowledgeBaseId: string
  source: TocEntryRefDto
  target: TocEntryRefDto
  placement: 'before' | 'after' | 'inside'
  expectedSnapshotRevision: string
}

export interface TocCreateGroupRequest {
  knowledgeBaseId: string
  title: string
  placement?: NoteCreateRequest['placement']
  expectedSnapshotRevision: string
}

export interface TocRenameGroupRequest {
  knowledgeBaseId: string
  folderPath: string[]
  title: string
  expectedSnapshotRevision: string
}

export interface TocDeleteRequest {
  knowledgeBaseId: string
  entry: TocEntryRefDto
  expectedSnapshotRevision: string
}

export interface DeletePreviewDto {
  knowledgeBaseId: string
  entry: TocEntryRefDto
  notes: Array<{
    noteUuid: string
    index: string
    title: string
    directoryPath: string
  }>
  filePaths: string[]
  directoryPaths: string[]
  untrackedFilePaths: string[]
  snapshotRevision: string
}

export interface ExternalNoteChangeEvent {
  knowledgeBaseId: string
  noteUuid: string
}

export interface DeskApi {
  bootstrap(): Promise<DeskResult<BootstrapPayload>>
  app: {
    closeWindow(): Promise<DeskResult<void>>
    confirmTabClose(titles: string[]): Promise<DeskResult<TabCloseChoice>>
    showContextMenu(request: ContextMenuRequest): Promise<DeskResult<ContextMenuAction | null>>
    showKnowledgeSidebarMenu(
      request: KnowledgeSidebarMenuRequest
    ): Promise<DeskResult<KnowledgeSidebarMenuAction | null>>
    showNavigatorSidebarMenu(
      request: NavigatorSidebarMenuRequest
    ): Promise<DeskResult<NavigatorSidebarMenuAction | null>>
    onTabShortcut(callback: (command: TabShortcutCommand) => void): () => void
  }
  updates: {
    status(): Promise<DeskResult<UpdateStatusDto>>
    check(): Promise<DeskResult<UpdateStatusDto>>
    openReleasePage(): Promise<DeskResult<void>>
    onChanged(callback: (status: UpdateStatusDto) => void): () => void
  }
  workspace: {
    choose(): Promise<DeskResult<WorkspaceOverview>>
    set(path: string | null): Promise<DeskResult<WorkspaceOverview>>
    refresh(): Promise<DeskResult<WorkspaceOverview>>
    /** Open the workspace folder in the system file manager. */
    reveal(): Promise<DeskResult<void>>
    revealKnowledgeBase(knowledgeBaseId: string): Promise<DeskResult<void>>
    onChanged(callback: (overview: WorkspaceOverview) => void): () => void
  }
  settings: {
    update(next: Partial<AppSettings>): Promise<DeskResult<AppSettings>>
    export(): Promise<DeskResult<void>>
    import(): Promise<DeskResult<AppSettings>>
    reset(): Promise<DeskResult<AppSettings>>
    readRaw(): Promise<DeskResult<string>>
    writeRaw(json: string): Promise<DeskResult<AppSettings>>
    imageTokenStatus(): Promise<DeskResult<ImageTokenStatus>>
    updateImageToken(request: ImageTokenUpdateRequest): Promise<DeskResult<ImageTokenStatus>>
    validateImageSettings(
      request: ImageSettingsValidateRequest
    ): Promise<DeskResult<ImageSettingsValidateResult>>
  }
  knowledgeBases: {
    create(request: KnowledgeBaseCreateRequest): Promise<DeskResult<KnowledgeBaseCreateResult>>
    read(knowledgeBaseId: string): Promise<DeskResult<KnowledgeBaseDetail>>
    readSettings(knowledgeBaseId: string): Promise<DeskResult<KnowledgeBaseSettingsDto>>
    writeSettings(
      request: KnowledgeBaseSettingsWriteRequest
    ): Promise<DeskResult<KnowledgeBaseDetail>>
    writeIcon(request: KnowledgeBaseIconWriteRequest): Promise<DeskResult<KnowledgeBaseDetail>>
    /** main → renderer：右键菜单点了「知识库配置」。 */
    onOpenSettingsRequested(callback: (knowledgeBaseId: string) => void): () => void
    /** main → renderer：右键菜单点了「资源」。 */
    onOpenAssetsRequested(callback: (knowledgeBaseId: string) => void): () => void
  }
  assets: {
    scan(knowledgeBaseId: string, generation: number): Promise<DeskResult<AssetScanReportDto>>
    cancel(knowledgeBaseId: string): Promise<DeskResult<void>>
    summaries(): Promise<DeskResult<AssetKbSummaryDto[]>>
    planRename(
      knowledgeBaseId: string,
      fromRelPath: string,
      toRelPath: string,
      generation?: number
    ): Promise<DeskResult<AssetOperationPlanDto>>
    planRecycle(
      knowledgeBaseId: string,
      relPaths: string[],
      generation?: number
    ): Promise<DeskResult<AssetOperationPlanDto>>
    planMerge(
      knowledgeBaseId: string,
      keepRelPath: string,
      dropRelPaths: string[],
      generation?: number
    ): Promise<DeskResult<AssetOperationPlanDto>>
    previewOptimize(
      knowledgeBaseId: string,
      relPaths: string[],
      options: AssetOptimizeSettings,
      generation?: number
    ): Promise<DeskResult<AssetOptimizePreviewDto>>
    planOptimize(
      knowledgeBaseId: string,
      relPaths: string[],
      options: AssetOptimizeSettings,
      generation?: number
    ): Promise<DeskResult<AssetOperationPlanDto>>
    apply(knowledgeBaseId: string, planId: string): Promise<DeskResult<AssetOperationResultDto>>
    restore(knowledgeBaseId: string, planId: string): Promise<DeskResult<AssetOperationResultDto>>
    history(knowledgeBaseId: string): Promise<DeskResult<AssetJournalDto[]>>
    onScanProgress(callback: (progress: AssetScanProgressDto) => void): () => void
    onGateQuery(callback: (event: AssetGateQueryEvent) => void): () => void
    replyGate(requestId: string, knowledgeBaseId: string, snapshot: AssetEditorSnapshotDto): void
    onPrepareApply(callback: (event: AssetPrepareApplyEvent) => void): () => void
    onApplied(callback: (event: AssetAppliedEvent) => void): () => void
    onApplySettled(callback: (event: AssetApplySettledEvent) => void): () => void
  }
  notes: {
    read(knowledgeBaseId: string, noteUuid: string): Promise<DeskResult<NoteDocumentDto>>
    resolveTable(request: NotesTableResolveRequest): Promise<DeskResult<NotesTableResolveResult>>
    save(request: NoteSaveRequest): Promise<DeskResult<NoteMutationDto>>
    create(request: NoteCreateRequest): Promise<DeskResult<NoteMutationDto>>
    rename(request: NoteRenameRequest): Promise<DeskResult<NoteMutationDto>>
    updateConfig(request: NoteUpdateConfigRequest): Promise<DeskResult<NoteMutationDto>>
    copyPath(knowledgeBaseId: string, noteUuid: string): Promise<DeskResult<string>>
    revealInFileManager(knowledgeBaseId: string, noteUuid: string): Promise<DeskResult<void>>
    onExternalChanged(callback: (event: ExternalNoteChangeEvent) => void): () => void
  }
  attachments: {
    writeLocal(
      request: AttachmentWriteLocalRequest
    ): Promise<DeskResult<AttachmentWriteLocalResult>>
    uploadImage(request: ImageUploadRequest): Promise<DeskResult<ImageUploadResult>>
  }
  build(knowledgeBaseId: string): Promise<DeskResult<KbBuildResult>>
  search(request: SearchRequest): Promise<DeskResult<SearchResultDto[]>>
  git: {
    list(): Promise<DeskResult<GitRepositoryStateDto[]>>
    refresh(knowledgeBaseId?: string): Promise<DeskResult<GitRepositoryStateDto[]>>
    fetch(knowledgeBaseId: string): Promise<DeskResult<GitOperationResult>>
    pull(knowledgeBaseId: string): Promise<DeskResult<GitOperationResult>>
    publish(knowledgeBaseId: string): Promise<DeskResult<GitOperationResult>>
    onStateChanged(callback: (state: GitRepositoryStateDto) => void): () => void
  }
  ide: {
    showKnowledgeBaseMenu(knowledgeBaseId: string): Promise<DeskResult<void>>
    showNoteMenu(knowledgeBaseId: string, noteUuid: string): Promise<DeskResult<void>>
    showFileMenu(knowledgeBaseId: string, path: string): Promise<DeskResult<void>>
    openKnowledgeBase(knowledgeBaseId: string): Promise<DeskResult<void>>
    openNote(knowledgeBaseId: string, noteUuid: string): Promise<DeskResult<void>>
  }
  toc: {
    move(request: TocMoveRequest): Promise<DeskResult<KnowledgeBaseDetail>>
    createGroup(request: TocCreateGroupRequest): Promise<DeskResult<KnowledgeBaseDetail>>
    renameGroup(request: TocRenameGroupRequest): Promise<DeskResult<KnowledgeBaseDetail>>
    previewDelete(
      knowledgeBaseId: string,
      entry: TocEntryRefDto
    ): Promise<DeskResult<DeletePreviewDto>>
    delete(request: TocDeleteRequest): Promise<DeskResult<KnowledgeBaseDetail>>
  }
  session: {
    read(): Promise<DeskResult<WorkspaceSession | null>>
    save(session: WorkspaceSession): Promise<DeskResult<void>>
  }
  recovery: {
    write(request: RecoveryWriteRequest): Promise<DeskResult<void>>
    delete(request: RecoveryDeleteRequest): Promise<DeskResult<void>>
  }
  web: {
    create(request: WebCreateRequest): Promise<DeskResult<WebTabState>>
    layout(request: WebLayoutRequest): Promise<DeskResult<void>>
    hideAll(): Promise<DeskResult<void>>
    close(tabId: string): Promise<DeskResult<void>>
    navigate(request: WebNavigateRequest): Promise<DeskResult<WebTabState>>
    goBack(tabId: string): Promise<DeskResult<void>>
    goForward(tabId: string): Promise<DeskResult<void>>
    reload(tabId: string): Promise<DeskResult<void>>
    stop(tabId: string): Promise<DeskResult<void>>
    selectAll(tabId: string): Promise<DeskResult<void>>
    openExternal(url: string): Promise<DeskResult<void>>
    clearBrowsingData(): Promise<DeskResult<void>>
    onStateChanged(callback: (state: WebTabState) => void): () => void
    onOpenRequested(callback: (event: WebOpenRequestedEvent) => void): () => void
  }
  preview: {
    start(request: PreviewStartRequest): Promise<DeskResult<PreviewStartResult>>
    stop(knowledgeBaseId: string): Promise<DeskResult<PreviewStateDto>>
    list(): Promise<DeskResult<PreviewStateDto[]>>
    onChanged(callback: (state: PreviewStateDto) => void): () => void
  }
  onLog(callback: (line: string) => void): () => void
}
