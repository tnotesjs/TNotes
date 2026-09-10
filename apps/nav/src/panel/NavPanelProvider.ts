import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import * as vscode from 'vscode'
import { getGitStatusesForRepos, type RepoGitStatus } from '../git'
import {
  filterPinnedRepos,
  listKnowledgeBases,
  loadIconManifest,
  loadSingleRepoMeta,
  sortKnowledgeBases
} from '../knowledgeBases'
import {
  filterPinnedTocIds,
  findTocNode,
  flattenPinnedNodes,
  noteFilePath,
  previewDelete,
  readToc,
  repoReadmePath,
  type TocNode
} from '../toc'
import { getWorkspace } from '../toc/kbWorkspace'
import type { Placement, TocEntryRef } from '@tnotesjs/kb'
import {
  getAddressBarPath,
  getNavRoot,
  setNavRootPath
} from '../workspace'
import { detectWorkspaceMode, type DetectedWorkspace } from '../workspaceMode'

const SPLIT_KEY = 'tnotesNav.splitLeftPx'
const SELECTED_KEY = 'tnotesNav.selectedRepo'
const PINNED_KEY = 'tnotesNav.pinnedRepos'
const TOC_COLLAPSED_KEY = 'tnotesNav.tocCollapsed'
const TOC_PINNED_KEY = 'tnotesNav.tocPinnedByRepo'
const TOC_PINNED_COLLAPSED_KEY = 'tnotesNav.tocPinnedCollapsedByRepo'
const TOC_CHANGES_COLLAPSED_KEY = 'tnotesNav.tocChangesCollapsedByRepo'
const DEFAULT_LEFT = 140
const GIT_DEBOUNCE_MS = 700
const TOC_DEBOUNCE_MS = 400

type TocCollapsedMap = Record<string, string[]>
type TocPinnedMap = Record<string, string[]>
type TocPinnedCollapsedMap = Record<string, boolean>
type TocChangesCollapsedMap = Record<string, boolean>

export class NavPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'tnotesNav.panel'

  private view?: vscode.WebviewView
  private selectedRepo: string | null = null
  private gitStatuses: Record<string, RepoGitStatus> = {}
  private gitWatcher?: vscode.FileSystemWatcher
  private gitWatchRoot?: string
  private gitTimer?: ReturnType<typeof setTimeout>
  private gitRefreshInFlight = false
  private gitRefreshQueued = false
  private tocWatcher?: vscode.FileSystemWatcher
  private tocWatchRoot?: string
  private tocTimer?: ReturnType<typeof setTimeout>
  /** Monotonic state version: stale async pushState results are dropped. */
  private stateVersion = 0
  /** TOC tree of the currently selected repo (used to map nodeId -> core refs). */
  private currentToc: TocNode[] = []
  /** Snapshot revision of the selected repo (required input for mutations). */
  private tocRevision: string | null = null

  constructor(private readonly context: vscode.ExtensionContext) {
    this.selectedRepo = context.globalState.get<string | null>(SELECTED_KEY, null)
    context.subscriptions.push({
      dispose: () => {
        this.disposeGitWatch()
        this.disposeTocWatch()
      }
    })
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView
    const mediaRoot = vscode.Uri.joinPath(this.context.extensionUri, 'media')

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [mediaRoot]
    }

    webviewView.webview.html = this.getHtml(webviewView.webview)

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (!msg || typeof msg.type !== 'string') return
      switch (msg.type) {
        case 'ready':
          this.pushState()
          break
        case 'selectKb':
          if (typeof msg.repo === 'string') {
            this.selectedRepo = msg.repo
            await this.context.globalState.update(SELECTED_KEY, msg.repo)
            this.pushState()
          }
          break
        case 'togglePin':
          if (typeof msg.repo === 'string') {
            await this.togglePin(msg.repo)
          }
          break
        case 'toggleTocPin':
          if (typeof msg.repo === 'string' && typeof msg.nodeId === 'string') {
            await this.toggleTocPin(msg.repo, msg.nodeId)
          }
          break
        case 'setTocPinnedCollapsed':
          if (typeof msg.repo === 'string') {
            await this.setTocPinnedCollapsed(msg.repo, Boolean(msg.collapsed))
          }
          break
        case 'setTocChangesCollapsed':
          if (typeof msg.repo === 'string') {
            await this.setTocChangesCollapsed(msg.repo, Boolean(msg.collapsed))
          }
          break
        case 'setSplit':
          if (typeof msg.leftWidth === 'number') {
            await this.context.globalState.update(SPLIT_KEY, Math.round(msg.leftWidth))
          }
          break
        case 'setTocCollapsed':
          if (typeof msg.repo === 'string' && typeof msg.nodeId === 'string') {
            await this.setTocCollapsed(msg.repo, msg.nodeId, Boolean(msg.collapsed))
          }
          break
        case 'revealTocNode':
          if (typeof msg.repo === 'string' && typeof msg.nodeId === 'string') {
            await this.revealTocNode(msg.repo, msg.nodeId)
          }
          break
        case 'tocMove':
          if (
            typeof msg.repo === 'string' &&
            typeof msg.sourceNodeId === 'string' &&
            typeof msg.targetNodeId === 'string' &&
            (msg.placement === 'before' ||
              msg.placement === 'after' ||
              msg.placement === 'inside')
          ) {
            await this.tocMove(msg.repo, msg.sourceNodeId, msg.targetNodeId, msg.placement)
          }
          break
        case 'tocRename':
          if (typeof msg.repo === 'string' && typeof msg.nodeId === 'string') {
            await this.tocRename(msg.repo, msg.nodeId)
          }
          break
        case 'tocCreateNote':
          if (
            typeof msg.repo === 'string' &&
            typeof msg.targetNodeId === 'string' &&
            (msg.placement === 'before' ||
              msg.placement === 'after' ||
              msg.placement === 'inside')
          ) {
            await this.tocCreateNote(msg.repo, msg.targetNodeId, msg.placement)
          }
          break
        case 'tocCreateGroup':
          if (typeof msg.repo === 'string') {
            const placement =
              msg.placement === 'before' ? 'before' : msg.placement === 'after' ? 'after' : 'inside'
            await this.tocCreateGroup(
              msg.repo,
              typeof msg.targetNodeId === 'string' ? msg.targetNodeId : undefined,
              placement
            )
          }
          break
        case 'tocDelete':
          if (typeof msg.repo === 'string' && typeof msg.nodeId === 'string') {
            await this.tocDelete(msg.repo, msg.nodeId)
          }
          break
        case 'openNote':
          if (typeof msg.noteDir === 'string') {
            await this.openNote(msg.noteDir)
          }
          break
        case 'openRepoReadme':
          await this.openRepoReadme()
          break
        case 'copyKbPath':
          if (typeof msg.repo === 'string') {
            await this.copyKbPath(msg.repo)
          }
          break
        case 'openKbTerminal':
          if (typeof msg.repo === 'string') {
            await this.openKbTerminal(msg.repo)
          }
          break
        case 'copyNotePath':
          if (typeof msg.noteDir === 'string') {
            await this.copyNotePath(msg.noteDir)
          }
          break
        case 'refresh':
          this.pushState()
          break
        case 'loadRoot':
          if (typeof msg.path === 'string') {
            await this.loadRoot(msg.path)
          } else {
            this.pushState()
          }
          break
      }
    })

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this.pushState()
      }
    })

    this.ensureGitWatcher()
    this.ensureTocWatcher()
  }

  refresh(): void {
    this.pushState()
  }

  async loadRoot(path: string): Promise<void> {
    const root = await setNavRootPath(path)
    if (!root || !existsSync(root)) {
      void vscode.window.showWarningMessage(
        `TNotes Nav: 路径无效或不存在：${path.trim() || '(空)'}`
      )
    }
    this.selectedRepo = null
    await this.context.globalState.update(SELECTED_KEY, null)
    this.disposeGitWatch()
    this.disposeTocWatch()
    this.pushState()
  }

  clearSelection(): void {
    this.selectedRepo = null
    void this.context.globalState.update(SELECTED_KEY, null)
    this.pushState()
  }

  private disposeGitWatch(): void {
    if (this.gitTimer) {
      clearTimeout(this.gitTimer)
      this.gitTimer = undefined
    }
    this.gitWatcher?.dispose()
    this.gitWatcher = undefined
    this.gitWatchRoot = undefined
  }

  private ensureGitWatcher(): void {
    const root = getNavRoot()
    if (!root || !existsSync(root)) {
      this.disposeGitWatch()
      return
    }
    if (this.gitWatcher && this.gitWatchRoot === root) return

    this.disposeGitWatch()
    this.gitWatchRoot = root

    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(vscode.Uri.file(root), '**/*')
    )
    const onFs = (uri: vscode.Uri) => {
      const p = uri.fsPath.replace(/\\/g, '/')
      if (
        p.includes('/node_modules/') ||
        p.includes('/.git/objects/') ||
        p.includes('/.git/logs/') ||
        p.includes('/dist/') ||
        p.includes('/.vitepress/cache/')
      ) {
        return
      }
      this.scheduleGitRefresh()
    }
    watcher.onDidChange(onFs)
    watcher.onDidCreate(onFs)
    watcher.onDidDelete(onFs)
    this.gitWatcher = watcher
  }

  private scheduleGitRefresh(): void {
    if (this.gitTimer) clearTimeout(this.gitTimer)
    this.gitTimer = setTimeout(() => {
      this.gitTimer = undefined
      void this.refreshGitStatuses()
    }, GIT_DEBOUNCE_MS)
  }

  // ---------------------------------------------------------------------------
  // 0003: lightweight TOC watch. TOC.md change + note-folder events re-read the
  // selected repo's tree (via Core refresh); git badges refresh alongside.
  // ---------------------------------------------------------------------------

  private disposeTocWatch(): void {
    if (this.tocTimer) {
      clearTimeout(this.tocTimer)
      this.tocTimer = undefined
    }
    this.tocWatcher?.dispose()
    this.tocWatcher = undefined
    this.tocWatchRoot = undefined
  }

  private ensureTocWatcher(): void {
    const root = getNavRoot()
    if (!root || !existsSync(root)) {
      this.disposeTocWatch()
      return
    }
    if (this.tocWatcher && this.tocWatchRoot === root) return

    this.disposeTocWatch()
    this.tocWatchRoot = root

    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(vscode.Uri.file(root), '**/{TOC.md,notes/*}')
    )
    const onFs = (uri: vscode.Uri) => this.scheduleTocRefresh(uri)
    watcher.onDidChange(onFs)
    watcher.onDidCreate(onFs)
    watcher.onDidDelete(onFs)
    this.tocWatcher = watcher
  }

  private scheduleTocRefresh(uri: vscode.Uri): void {
    this.scheduleGitRefresh()
    const detected = this.detect()
    if (!this.selectedRepo) return
    const mode = detected.mode
    if (mode === 'none') return

    let changedRepo: string
    if (mode === 'single') {
      changedRepo = detected.repoName
    } else {
      const root = (getNavRoot() ?? '').replace(/\\/g, '/')
      const path = uri.fsPath.replace(/\\/g, '/')
      const rel = root && path.startsWith(root) ? path.slice(root.length + 1) : path
      changedRepo = rel.split('/')[0] ?? ''
    }
    // Only the selected repo's tree is rendered; other repos re-read on select.
    if (changedRepo !== this.selectedRepo) return

    if (this.tocTimer) clearTimeout(this.tocTimer)
    this.tocTimer = setTimeout(() => {
      this.tocTimer = undefined
      this.pushState()
    }, TOC_DEBOUNCE_MS)
  }

  private listRepoRootsForGit(detected: DetectedWorkspace = this.detect()): Array<{
    repo: string
    root: string
  }> {
    if (detected.mode === 'single') {
      return [{ repo: detected.repoName, root: detected.root }]
    }
    if (detected.mode === 'multi') {
      const manifestPath = join(
        this.context.extensionPath,
        'media',
        'kb-icons',
        'manifest.json'
      )
      const listed = listKnowledgeBases(detected.root, loadIconManifest(manifestPath))
      return listed.map((kb) => ({
        repo: kb.repo,
        root: join(detected.root, kb.repo)
      }))
    }
    return []
  }

  private async refreshGitStatuses(): Promise<void> {
    if (!this.view) return
    if (this.gitRefreshInFlight) {
      this.gitRefreshQueued = true
      return
    }
    this.gitRefreshInFlight = true
    try {
      const repos = this.listRepoRootsForGit()
      if (!repos.length) {
        this.gitStatuses = {}
        void this.view.webview.postMessage({
          type: 'gitStatus',
          gitStatuses: {},
          tocChangesCollapsed: false
        })
        return
      }
      const next = await getGitStatusesForRepos(repos)
      await this.expandChangesIfNewlyDirty(next)
      this.gitStatuses = next
      void this.view.webview.postMessage({
        type: 'gitStatus',
        gitStatuses: this.gitStatuses,
        tocChangesCollapsed: this.isTocChangesCollapsed(this.selectedRepo)
      })
    } finally {
      this.gitRefreshInFlight = false
      if (this.gitRefreshQueued) {
        this.gitRefreshQueued = false
        void this.refreshGitStatuses()
      }
    }
  }

  private detect(): DetectedWorkspace {
    return detectWorkspaceMode(getNavRoot())
  }

  /** Absolute path of a knowledge base root (selected or named). */
  private resolveRepoRoot(
    detected: DetectedWorkspace = this.detect(),
    repo: string | null = this.selectedRepo
  ): string | null {
    if (detected.mode === 'single') {
      return detected.root
    }
    if (detected.mode === 'multi' && repo) {
      return join(detected.root, repo)
    }
    return null
  }

  private async copyText(path: string): Promise<void> {
    await vscode.env.clipboard.writeText(path)
    void vscode.window.setStatusBarMessage(`已复制路径: ${path}`, 2500)
  }

  private async copyKbPath(repo: string): Promise<void> {
    const repoRoot = this.resolveRepoRoot(this.detect(), repo)
    if (!repoRoot || !existsSync(repoRoot)) {
      void vscode.window.showWarningMessage(`知识库路径不存在: ${repo}`)
      return
    }
    await this.copyText(repoRoot)
  }

  /** Multi-KB only: open an integrated terminal at the knowledge-base root. */
  private async openKbTerminal(repo: string): Promise<void> {
    const detected = this.detect()
    if (detected.mode !== 'multi') return

    const repoRoot = this.resolveRepoRoot(detected, repo)
    if (!repoRoot || !existsSync(repoRoot)) {
      void vscode.window.showWarningMessage(`知识库路径不存在: ${repo}`)
      return
    }

    const terminal = vscode.window.createTerminal({
      name: repo,
      cwd: repoRoot
    })
    terminal.show()
  }

  private async copyNotePath(noteDir: string): Promise<void> {
    const repoRoot = this.resolveRepoRoot()
    if (!repoRoot) {
      void vscode.window.showWarningMessage('TNotes Nav: 请先选择知识库')
      return
    }
    const notePath = noteFilePath(repoRoot, noteDir)
    if (!existsSync(notePath)) {
      void vscode.window.showWarningMessage(`笔记不存在: ${noteDir}`)
      return
    }
    await this.copyText(notePath)
  }

  private getPinnedRepos(): string[] {
    const raw = this.context.globalState.get<string[]>(PINNED_KEY, [])
    return Array.isArray(raw) ? raw.filter((r) => typeof r === 'string') : []
  }

  private getTocCollapsedMap(): TocCollapsedMap {
    const raw = this.context.globalState.get<TocCollapsedMap>(TOC_COLLAPSED_KEY, {})
    return raw && typeof raw === 'object' ? raw : {}
  }

  private getTocPinnedMap(): TocPinnedMap {
    const raw = this.context.globalState.get<TocPinnedMap>(TOC_PINNED_KEY, {})
    return raw && typeof raw === 'object' ? raw : {}
  }

  private getCollapsedIds(repo: string | null): string[] {
    if (!repo) return []
    const list = this.getTocCollapsedMap()[repo]
    return Array.isArray(list) ? list.filter((id) => typeof id === 'string') : []
  }

  private getTocPinnedIds(repo: string | null): string[] {
    if (!repo) return []
    const list = this.getTocPinnedMap()[repo]
    return Array.isArray(list) ? list.filter((id) => typeof id === 'string') : []
  }

  private getTocPinnedCollapsedMap(): TocPinnedCollapsedMap {
    const raw = this.context.globalState.get<TocPinnedCollapsedMap>(
      TOC_PINNED_COLLAPSED_KEY,
      {}
    )
    return raw && typeof raw === 'object' ? raw : {}
  }

  private isTocPinnedCollapsed(repo: string | null): boolean {
    if (!repo) return false
    return Boolean(this.getTocPinnedCollapsedMap()[repo])
  }

  private async setTocPinnedCollapsed(repo: string, collapsed: boolean): Promise<void> {
    const map = { ...this.getTocPinnedCollapsedMap(), [repo]: collapsed }
    await this.context.globalState.update(TOC_PINNED_COLLAPSED_KEY, map)
    this.pushState()
  }

  private getTocChangesCollapsedMap(): TocChangesCollapsedMap {
    const raw = this.context.globalState.get<TocChangesCollapsedMap>(
      TOC_CHANGES_COLLAPSED_KEY,
      {}
    )
    return raw && typeof raw === 'object' ? raw : {}
  }

  private isTocChangesCollapsed(repo: string | null): boolean {
    if (!repo) return false
    return Boolean(this.getTocChangesCollapsedMap()[repo])
  }

  private async setTocChangesCollapsed(repo: string, collapsed: boolean): Promise<void> {
    const map = { ...this.getTocChangesCollapsedMap(), [repo]: collapsed }
    await this.context.globalState.update(TOC_CHANGES_COLLAPSED_KEY, map)
    this.pushState()
  }

  /** Expand changes section when a repo goes from clean → dirty. */
  private async expandChangesIfNewlyDirty(
    next: Record<string, RepoGitStatus>
  ): Promise<void> {
    let map: TocChangesCollapsedMap | null = null
    for (const [repo, status] of Object.entries(next)) {
      const nextCount = Object.keys(status.fileMarks || {}).length
      const prevCount = Object.keys(this.gitStatuses[repo]?.fileMarks || {}).length
      if (nextCount > 0 && prevCount === 0 && this.isTocChangesCollapsed(repo)) {
        if (!map) map = { ...this.getTocChangesCollapsedMap() }
        map[repo] = false
      }
    }
    if (map) {
      await this.context.globalState.update(TOC_CHANGES_COLLAPSED_KEY, map)
    }
  }

  private async setTocCollapsed(
    repo: string,
    nodeId: string,
    collapsed: boolean
  ): Promise<void> {
    const map = { ...this.getTocCollapsedMap() }
    const current = new Set(this.getCollapsedIds(repo))
    if (collapsed) current.add(nodeId)
    else current.delete(nodeId)
    map[repo] = [...current]
    await this.context.globalState.update(TOC_COLLAPSED_KEY, map)
    this.pushState()
  }

  private async togglePin(repo: string): Promise<void> {
    const pinned = this.getPinnedRepos()
    const idx = pinned.indexOf(repo)
    if (idx >= 0) {
      pinned.splice(idx, 1)
    } else {
      pinned.unshift(repo)
    }
    await this.context.globalState.update(PINNED_KEY, pinned)
    this.pushState()
  }

  private async toggleTocPin(repo: string, nodeId: string): Promise<void> {
    const map = { ...this.getTocPinnedMap() }
    const pinned = [...this.getTocPinnedIds(repo)]
    const idx = pinned.indexOf(nodeId)
    if (idx >= 0) {
      pinned.splice(idx, 1)
    } else {
      pinned.unshift(nodeId)
      await this.context.globalState.update(TOC_PINNED_COLLAPSED_KEY, {
        ...this.getTocPinnedCollapsedMap(),
        [repo]: false
      })
    }
    map[repo] = pinned
    await this.context.globalState.update(TOC_PINNED_KEY, map)
    this.pushState()
  }

  private async revealTocNode(repo: string, nodeId: string): Promise<void> {
    const { toc } = await this.loadTocForRepo(repo)
    const found = findTocNode(toc, nodeId)
    if (!found) {
      this.pushState()
      return
    }

    const map = { ...this.getTocCollapsedMap() }
    const collapsed = new Set(this.getCollapsedIds(repo))
    for (const id of found.ancestorIds) collapsed.delete(id)
    if (found.node.type === 'group') collapsed.delete(nodeId)
    map[repo] = [...collapsed]
    await this.context.globalState.update(TOC_COLLAPSED_KEY, map)

    this.pushState()
    void this.view?.webview.postMessage({ type: 'scrollToTocNode', nodeId })
  }

  // ---------------------------------------------------------------------------
  // TOC mutations (0002): all writes go through Core Workspace.
  // ---------------------------------------------------------------------------

  /** Root of a repo in the current mode, else null. */
  private repoRootFor(repo: string | null): string | null {
    if (!repo) return null
    const detected = this.detect()
    if (detected.mode === 'single' && detected.repoName === repo) return detected.root
    if (detected.mode === 'multi') return join(detected.root, repo)
    return null
  }

  /** Nav TOC node -> kb TocEntryRef (note index or group path). */
  private tocEntryFor(node: TocNode): TocEntryRef | null {
    if (node.type === 'note') return { type: 'note', index: node.noteIndex }
    return { type: 'group', groupPath: node.folderPath }
  }

  private currentEntry(nodeId: string): TocNode | null {
    return findTocNode(this.currentToc, nodeId)?.node ?? null
  }

  private async mutationGuard(op: () => Promise<unknown>): Promise<boolean> {
    try {
      await op()
      return true
    } catch (e) {
      void vscode.window.showErrorMessage(e instanceof Error ? e.message : String(e))
      return false
    }
  }

  private async tocMove(
    repo: string,
    sourceNodeId: string,
    targetNodeId: string,
    placement: 'before' | 'after' | 'inside'
  ): Promise<void> {
    const root = this.repoRootFor(repo)
    if (!root || !this.tocRevision) return
    const source = this.currentEntry(sourceNodeId)
    const target = this.currentEntry(targetNodeId)
    if (!source || !target || source.nodeId === target.nodeId) return
    const src = this.tocEntryFor(source)
    const tgt = this.tocEntryFor(target)
    if (!src || !tgt) return
    const ok = await this.mutationGuard(() =>
      getWorkspace(root).toc.move({
        source: src,
        target: tgt,
        placement
      })
    )
    if (ok) this.pushState()
  }

  private async tocRename(repo: string, nodeId: string): Promise<void> {
    const root = this.repoRootFor(repo)
    const node = this.currentEntry(nodeId)
    if (!root || !this.tocRevision || !node) return
    const next = await vscode.window.showInputBox({
      title: node.type === 'group' ? '重命名分组' : '重命名笔记',
      // Note files keep their 4-digit index (kb prepends it on rename), so the
      // dialog pre-fills the index-free title only.
      value: node.type === 'group' ? node.title : node.noteTitle,
      validateInput: (value) => (value.trim() ? null : '名称不能为空')
    })
    if (next === undefined || next.trim() === '' || next.trim() === node.title) return
    const ok = await this.mutationGuard(async () => {
      if (node.type === 'group') {
        await getWorkspace(root).toc.renameGroup({
          groupPath: node.folderPath,
          title: next.trim()
        })
      } else {
        await getWorkspace(root).notes.rename({
          index: node.noteIndex,
          title: next.trim()
        })
      }
    })
    if (ok) this.pushState()
  }

  private async tocCreateGroup(
    repo: string,
    targetNodeId: string | undefined,
    placement: 'before' | 'after' | 'inside' = 'after'
  ): Promise<void> {
    const root = this.repoRootFor(repo)
    if (!root || !this.tocRevision) return
    const title = await vscode.window.showInputBox({
      title: '新建分组',
      prompt: '分组名称',
      validateInput: (value) => (value.trim() ? null : '名称不能为空')
    })
    if (title === undefined || title.trim() === '') return
    const target = targetNodeId ? this.currentEntry(targetNodeId) : null
    let notePlacement: Placement | undefined
    if (target) {
      if (target.type === 'note') {
        notePlacement = { type: 'note', targetIndex: target.noteIndex, placement }
      } else {
        notePlacement = { type: 'group', groupPath: target.folderPath, placement }
      }
    } else {
      notePlacement = { type: 'root', placement: 'end' }
    }
    const ok = await this.mutationGuard(() =>
      getWorkspace(root).toc.createGroup({
        title: title.trim(),
        placement: notePlacement
      })
    )
    if (ok) this.pushState()
  }

  private async tocCreateNote(
    repo: string,
    targetNodeId: string,
    placement: 'before' | 'after' | 'inside'
  ): Promise<void> {
    const root = this.repoRootFor(repo)
    if (!root || !this.tocRevision) return
    const title = await vscode.window.showInputBox({
      title: '新建笔记',
      prompt: '笔记标题',
      validateInput: (value) => (value.trim() ? null : '标题不能为空')
    })
    if (title === undefined || title.trim() === '') return
    const target = this.currentEntry(targetNodeId)
    if (!target) return
    const notePlacement: Placement =
      target.type === 'note'
        ? { type: 'note', targetIndex: target.noteIndex, placement }
        : { type: 'group', groupPath: target.folderPath, placement }
    const ok = await this.mutationGuard(() =>
      getWorkspace(root).notes.create({
        title: title.trim(),
        placement: notePlacement
      })
    )
    if (ok) this.pushState()
  }

  private async tocDelete(repo: string, nodeId: string): Promise<void> {
    const root = this.repoRootFor(repo)
    const node = this.currentEntry(nodeId)
    if (!root || !this.tocRevision || !node) return
    const entry = this.tocEntryFor(node)
    if (!entry) return
    let preview
    try {
      preview = await previewDelete(root, entry)
    } catch (e) {
      void vscode.window.showErrorMessage(e instanceof Error ? e.message : String(e))
      return
    }
    const label = node.type === 'group' ? `分组「${node.title}」` : `笔记「${node.title}」`
    const noteList = preview.notes
      .slice(0, 3)
      .map((n) => n.title)
      .join('、')
    const suffix = preview.notes.length
      ? `（将删除 ${preview.notes.length} 篇笔记：${noteList}${preview.notes.length > 3 ? '…' : ''}）`
      : ''
    const choice = await vscode.window.showWarningMessage(
      `确定删除 ${label}${suffix}？此操作会修改 TOC 与目录文件。`,
      { modal: true },
      '删除'
    )
    if (choice !== '删除') return
    const ok = await this.mutationGuard(() =>
      getWorkspace(root).toc.removeEntry(entry)
    )
    if (ok) this.pushState()
  }

  private async openNote(noteDir: string): Promise<void> {
    const repoRoot = this.resolveRepoRoot()
    if (!repoRoot) {
      void vscode.window.showWarningMessage('TNotes Nav: 请先选择知识库')
      return
    }
    const notePath = noteFilePath(repoRoot, noteDir)
    if (!existsSync(notePath)) {
      void vscode.window.showWarningMessage(`笔记不存在: ${noteDir}`)
      return
    }
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(notePath))
    await vscode.window.showTextDocument(doc, { preview: true })
  }

  private async openRepoReadme(): Promise<void> {
    const repoRoot = this.resolveRepoRoot()
    if (!repoRoot) {
      void vscode.window.showWarningMessage('TNotes Nav: 请先选择知识库')
      return
    }
    const readme = repoReadmePath(repoRoot)
    if (!existsSync(readme)) {
      void vscode.window.showWarningMessage('README.md 不存在')
      return
    }
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(readme))
    await vscode.window.showTextDocument(doc, { preview: true })
  }

  private async loadTocForRepo(
    repo: string | null
  ): Promise<{ toc: TocNode[]; tocError: string | null; revision: string | null }> {
    if (!repo) return { toc: [], tocError: null, revision: null }
    const detected = this.detect()
    let repoRoot: string | null = null
    if (detected.mode === 'single' && detected.repoName === repo) {
      repoRoot = detected.root
    } else if (detected.mode === 'multi') {
      repoRoot = join(detected.root, repo)
    }
    if (!repoRoot) return { toc: [], tocError: '未识别到知识库', revision: null }
    try {
      const result = await readToc(repoRoot)
      return { toc: result.toc, tocError: null, revision: result.revision }
    } catch (e) {
      return {
        toc: [],
        tocError: e instanceof Error ? e.message : String(e),
        revision: null
      }
    }
  }

  private async pushState(): Promise<void> {
    const version = ++this.stateVersion
    if (!this.view) return

    this.ensureGitWatcher()
    this.ensureTocWatcher()

    const webview = this.view.webview
    const mediaRoot = vscode.Uri.joinPath(this.context.extensionUri, 'media')
    const iconsDir = vscode.Uri.joinPath(mediaRoot, 'kb-icons')
    const manifestPath = join(this.context.extensionPath, 'media', 'kb-icons', 'manifest.json')
    const manifest = loadIconManifest(manifestPath)
    const fallbackIconUri = webview
      .asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'nav.svg'))
      .toString()

    const detected = this.detect()
    const leftWidth = this.context.globalState.get<number>(SPLIT_KEY, DEFAULT_LEFT)

    if (detected.mode === 'none') {
      this.gitStatuses = {}
      void webview.postMessage({
        type: 'setState',
        mode: 'none',
        knowledgeBases: [],
        selectedRepo: null,
        pinnedRepos: [],
        toc: [],
        tocError: null,
        collapsedIds: [],
        tocPinnedIds: [],
        tocPinnedNodes: [],
        tocPinnedCollapsed: false,
        tocChangesCollapsed: false,
        repoTitle: null,
        repoIconUri: null,
        gitStatuses: {},
        leftWidth,
        fallbackIconUri,
        workspaceRoot: detected.root,
        addressPath: getAddressBarPath()
      })
      return
    }

    let knowledgeBases: Array<{
      repo: string
      title: string
      iconUri: string | null
      pinned: boolean
    }> = []
    let repoTitle: string | null = null
    let repoIconUri: string | null = null

    if (detected.mode === 'multi') {
      const listed = listKnowledgeBases(detected.root, manifest)
      let pinnedRepos = filterPinnedRepos(
        this.getPinnedRepos(),
        listed.map((kb) => kb.repo)
      )
      const stored = this.getPinnedRepos()
      if (pinnedRepos.length !== stored.length || pinnedRepos.some((r, i) => r !== stored[i])) {
        void this.context.globalState.update(PINNED_KEY, pinnedRepos)
      }
      const pinnedSet = new Set(pinnedRepos)
      knowledgeBases = sortKnowledgeBases(listed, pinnedRepos).map((kb) => {
        const iconUri = kb.iconFile
          ? webview.asWebviewUri(vscode.Uri.joinPath(iconsDir, kb.iconFile)).toString()
          : null
        return {
          repo: kb.repo,
          title: kb.title,
          iconUri,
          pinned: pinnedSet.has(kb.repo)
        }
      })

      if (
        this.selectedRepo &&
        !knowledgeBases.some((kb) => kb.repo === this.selectedRepo)
      ) {
        this.selectedRepo = null
      }
    } else {
      // single
      this.selectedRepo = detected.repoName
      void this.context.globalState.update(SELECTED_KEY, detected.repoName)
      const meta = loadSingleRepoMeta(detected.root, detected.repoName, manifest)
      repoTitle = meta.title
      repoIconUri = meta.iconFile
        ? webview.asWebviewUri(vscode.Uri.joinPath(iconsDir, meta.iconFile)).toString()
        : fallbackIconUri
    }

    const { toc, tocError, revision } = await this.loadTocForRepo(this.selectedRepo)
    if (version !== this.stateVersion) return
    this.currentToc = toc
    this.tocRevision = revision
    const storedTocPins = this.getTocPinnedIds(this.selectedRepo)
    const tocPinnedIds = filterPinnedTocIds(storedTocPins, toc)
    if (
      this.selectedRepo &&
      (tocPinnedIds.length !== storedTocPins.length ||
        tocPinnedIds.some((id, i) => id !== storedTocPins[i]))
    ) {
      const map = { ...this.getTocPinnedMap() }
      map[this.selectedRepo] = tocPinnedIds
      void this.context.globalState.update(TOC_PINNED_KEY, map)
    }

    const tocPinnedNodes = flattenPinnedNodes(toc, tocPinnedIds)
    const tocPinnedCollapsed = this.isTocPinnedCollapsed(this.selectedRepo)
    const tocChangesCollapsed = this.isTocChangesCollapsed(this.selectedRepo)
    const collapsedIds = this.getCollapsedIds(this.selectedRepo)

    void webview.postMessage({
      type: 'setState',
      mode: detected.mode,
      knowledgeBases,
      selectedRepo: this.selectedRepo,
      pinnedRepos: this.getPinnedRepos(),
      toc,
      tocError,
      collapsedIds,
      tocPinnedIds,
      tocPinnedNodes,
      tocPinnedCollapsed,
      tocChangesCollapsed,
      repoTitle,
      repoIconUri,
      gitStatuses: this.gitStatuses,
      leftWidth,
      fallbackIconUri,
      workspaceRoot: detected.root,
      addressPath: getAddressBarPath()
    })

    void this.refreshGitStatuses()
  }

  private getHtml(webview: vscode.Webview): string {
    const mediaRoot = vscode.Uri.joinPath(this.context.extensionUri, 'media', 'webview')
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'main.css'))
    const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, 'main.js'))
    const csp = [
      `default-src 'none'`,
      `style-src ${webview.cspSource}`,
      `img-src ${webview.cspSource} data:`,
      `script-src ${webview.cspSource}`
    ].join('; ')

    try {
      const htmlPath = join(this.context.extensionPath, 'media', 'webview', 'index.html')
      const template = readFileSync(htmlPath, 'utf-8')
      return template
        .replace(/\{\{cspSource\}\}/g, webview.cspSource)
        .replace(/\{\{csp\}\}/g, csp)
        .replace(/\{\{cssUri\}\}/g, cssUri.toString())
        .replace(/\{\{jsUri\}\}/g, jsUri.toString())
    } catch {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${cssUri}" />
</head>
<body>
  <div id="shell">
    <div id="path-bar" class="path-bar">
      <input id="path-input" class="path-input" type="text" spellcheck="false" autocomplete="off" />
      <button id="path-refresh" class="path-refresh" type="button" title="刷新">↻</button>
    </div>
    <div id="app">
      <div id="left" class="pane pane-left"><ul id="kb-list" class="kb-list"></ul></div>
      <div id="splitter" class="splitter" role="separator" aria-orientation="vertical"></div>
      <div id="right" class="pane pane-right"><div id="toc-body" class="toc-body"></div></div>
    </div>
  </div>
  <script src="${jsUri}"></script>
</body>
</html>`
    }
  }
}
