;(function () {
  const vscode = acquireVsCodeApi()

  const LEFT_MIN = 32
  const RIGHT_MIN = 0
  const DEFAULT_LEFT = 140
  const ICON_ONLY_THRESHOLD = 48
  const TOC_INDENT_PX = 12
  const GIT_README_MARK_KEY = '__readme__'

  const PIN_SVG =
    '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M9.5 1.5a.5.5 0 0 0-1 0V3H6.2a1.5 1.5 0 0 0-1.4 1l-.4 1.2H3.5a.5.5 0 0 0 0 1h.7l-.7 4.2a.5.5 0 0 0 .5.6h3.2v3.5a.5.5 0 0 0 1 0V11h3.2a.5.5 0 0 0 .5-.6L11.8 6.2h.7a.5.5 0 0 0 0-1h-.9L10.2 4A1.5 1.5 0 0 0 8.8 3H8.5V1.5z"/></svg>'

  const app = document.getElementById('app')
  const leftPane = document.getElementById('left')
  const splitter = document.getElementById('splitter')
  const kbList = document.getElementById('kb-list')
  const tocBody = document.getElementById('toc-body')
  const pathInput = document.getElementById('path-input')
  const pathRefresh = document.getElementById('path-refresh')

  let state = {
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
    leftWidth: DEFAULT_LEFT,
    fallbackIconUri: '',
    workspaceRoot: null,
    addressPath: ''
  }

  let pathInputDirty = false

  let contextMenuEl = null
  let pendingScrollNodeId = null

  function post(type, payload) {
    vscode.postMessage({ type, ...(payload || {}) })
  }

  function collapsedSet() {
    return new Set(state.collapsedIds || [])
  }

  function tocPinnedSet() {
    return new Set(state.tocPinnedIds || [])
  }

  function applyLayoutMode() {
    app.classList.remove('mode-multi', 'mode-single', 'mode-none')
    app.classList.add('mode-' + (state.mode || 'none'))
  }

  function applyLeftWidth(width) {
    if (state.mode !== 'multi') {
      return state.leftWidth
    }
    const maxLeft = Math.max(LEFT_MIN, app.clientWidth - RIGHT_MIN - splitter.offsetWidth)
    const next = Math.min(Math.max(LEFT_MIN, width), maxLeft)
    leftPane.style.width = `${next}px`
    leftPane.classList.toggle('icon-only', next <= ICON_ONLY_THRESHOLD)
    state.leftWidth = next
    return next
  }

  function hideContextMenu() {
    if (contextMenuEl) {
      contextMenuEl.remove()
      contextMenuEl = null
    }
  }

  /** items: Array<{ label: string, onPick: () => void }> */
  function showContextMenu(x, y, items) {
    hideContextMenu()
    const list = Array.isArray(items) ? items : []
    if (!list.length) return

    const menu = document.createElement('div')
    menu.className = 'ctx-menu'
    menu.style.left = `${x}px`
    menu.style.top = `${y}px`

    for (const entry of list) {
      const item = document.createElement('button')
      item.type = 'button'
      item.className = 'ctx-item'
      item.textContent = entry.label
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        hideContextMenu()
        entry.onPick()
      })
      menu.appendChild(item)
    }
    document.body.appendChild(menu)
    contextMenuEl = menu

    // Clamp the menu inside the webview viewport: flip to the left when it
    // would overflow the right edge, pull up when it would overflow the bottom
    // (otherwise items wrap vertically near the panel's right edge).
    const viewportW = document.documentElement.clientWidth
    const viewportH = document.documentElement.clientHeight
    const menuW = menu.offsetWidth
    const menuH = menu.offsetHeight
    let left = x
    let top = y
    if (left + menuW > viewportW - 4) left = Math.max(4, viewportW - menuW - 4)
    if (top + menuH > viewportH - 4) top = Math.max(4, viewportH - menuH - 4)
    menu.style.left = `${left}px`
    menu.style.top = `${top}px`

    const onDoc = (ev) => {
      if (contextMenuEl && !contextMenuEl.contains(ev.target)) {
        hideContextMenu()
        document.removeEventListener('mousedown', onDoc, true)
      }
    }
    setTimeout(() => document.addEventListener('mousedown', onDoc, true), 0)
  }

  function createPinButton(pinned, onToggle) {
    const pinBtn = document.createElement('button')
    pinBtn.type = 'button'
    pinBtn.className = 'kb-pin toc-pin' + (pinned ? ' is-pinned' : '')
    pinBtn.title = pinned ? '取消置顶' : '置顶'
    pinBtn.setAttribute('aria-label', pinned ? '取消置顶' : '置顶')
    pinBtn.innerHTML = PIN_SVG
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      onToggle()
    })
    return pinBtn
  }

  function gitStatusFor(repo) {
    if (!repo || !state.gitStatuses) return null
    return state.gitStatuses[repo] || null
  }

  function gitTooltip(status) {
    if (!status || !status.isRepo) return '非 git 仓库'
    const parts = []
    if (status.changed > 0) parts.push('dirty:' + status.changed)
    if (status.ahead > 0) parts.push('↑' + status.ahead)
    if (status.behind > 0) parts.push('↓' + status.behind)
    return parts.length ? parts.join(' ') : ''
  }

  function createGitBadges(status) {
    const wrap = document.createElement('span')
    wrap.className = 'git-badges'
    if (!status || !status.isRepo || status.error) {
      wrap.hidden = true
      return wrap
    }

    const tip = gitTooltip(status)
    if (tip) wrap.title = tip

    let any = false
    if (status.changed > 0) {
      const el = document.createElement('span')
      el.className = 'git-badge git-changed'
      el.textContent = String(status.changed)
      wrap.appendChild(el)
      any = true
    }
    if (status.ahead > 0) {
      const el = document.createElement('span')
      el.className = 'git-badge git-ahead'
      el.textContent = '↑' + status.ahead
      wrap.appendChild(el)
      any = true
    }
    if (status.behind > 0) {
      const el = document.createElement('span')
      el.className = 'git-badge git-behind'
      el.textContent = '↓' + status.behind
      wrap.appendChild(el)
      any = true
    }
    wrap.hidden = !any
    return wrap
  }

  function replaceGitBadges(parent, status) {
    if (!parent) return
    const next = createGitBadges(status)
    const prev = parent.querySelector(':scope > .git-badges')
    if (prev) prev.replaceWith(next)
    else parent.appendChild(next)
  }

  function currentFileMarks() {
    const status = gitStatusFor(state.selectedRepo)
    if (!status || !status.fileMarks || typeof status.fileMarks !== 'object') {
      return {}
    }
    return status.fileMarks
  }

  function createTocGitMark(letter) {
    const el = document.createElement('span')
    el.className = 'toc-git-mark'
    if (!letter) {
      el.hidden = true
      return el
    }
    el.classList.add('toc-git-mark-' + letter)
    el.textContent = letter
    el.title = letter
    return el
  }

  function upsertTocGitMark(row, letter) {
    if (!row) return
    const next = createTocGitMark(letter || '')
    const prev = row.querySelector(':scope > .toc-git-mark')
    const pinBtn = row.querySelector(':scope > .kb-pin, :scope > .toc-pin')
    if (prev) prev.replaceWith(next)
    else if (pinBtn) row.insertBefore(next, pinBtn)
    else row.appendChild(next)
  }

  function collectNoteOrder(nodes, out) {
    if (!Array.isArray(nodes)) return out
    for (const node of nodes) {
      if (node.type === 'note' && node.noteDir) out.push(node.noteDir)
      if (node.children) collectNoteOrder(node.children, out)
    }
    return out
  }

  function listChangeEntries() {
    const marks = currentFileMarks()
    const keys = Object.keys(marks)
    if (!keys.length) return []

    const order = collectNoteOrder(state.toc, [])
    const orderIndex = new Map(order.map((d, i) => [d, i]))
    const entries = []

    if (marks[GIT_README_MARK_KEY]) {
      entries.push({
        key: GIT_README_MARK_KEY,
        kind: 'readme',
        title: 'README.md',
        letter: marks[GIT_README_MARK_KEY]
      })
    }

    const noteKeys = keys
      .filter((k) => k !== GIT_README_MARK_KEY)
      .sort((a, b) => {
        const ia = orderIndex.has(a) ? orderIndex.get(a) : Number.MAX_SAFE_INTEGER
        const ib = orderIndex.has(b) ? orderIndex.get(b) : Number.MAX_SAFE_INTEGER
        if (ia !== ib) return ia - ib
        return a.localeCompare(b)
      })

    for (const noteDir of noteKeys) {
      entries.push({
        key: noteDir,
        kind: 'note',
        noteDir,
        title: displayNoteTitle(noteDir),
        letter: marks[noteDir]
      })
    }

    return mergeRenameEntries(entries)
  }

  /**
   * Display-level merge for unstaged note renames: git reports them as a
   * tracked deletion (old dir, 'D') plus an untracked new dir ('U'). TNotes
   * note indexes (first 4 digits) are unique + immutable, so same-index pairs
   * are exactly one rename. COUNT uses the raw porcelain count elsewhere, so
   * this only reshapes the rendered list.
   */
  function noteIndexFromDir(dir) {
    const m = /^(\d{4})\./.exec(dir || '')
    return m ? m[1] : null
  }

  function mergeRenameEntries(entries) {
    const consumed = new Set()
    const result = []
    for (const entry of entries) {
      if (consumed.has(entry)) continue
      if (entry.kind !== 'note') {
        result.push(entry)
        continue
      }
      const index = noteIndexFromDir(entry.noteDir)
      if (!index || (entry.letter !== 'D' && entry.letter !== 'U')) {
        result.push(entry)
        continue
      }
      const counterpart = entries.find(
        (other) =>
          other !== entry &&
          other.kind === 'note' &&
          noteIndexFromDir(other.noteDir) === index &&
          (entry.letter === 'D' ? other.letter === 'U' : other.letter === 'D')
      )
      if (!counterpart) {
        result.push(entry)
        continue
      }
      consumed.add(entry)
      consumed.add(counterpart)
      const oldEntry = entry.letter === 'D' ? entry : counterpart
      const newEntry = entry.letter === 'D' ? counterpart : entry
      result.push({
        ...newEntry,
        title: `${displayNoteTitle(oldEntry.noteDir)} → ${displayNoteTitle(newEntry.noteDir)}`,
        letter: 'R'
      })
    }
    return result
  }

  function renderChangesSection() {
    const entries = listChangeEntries()
    if (!entries.length) return null

    const collapsed = !!state.tocChangesCollapsed
    const section = document.createElement('div')
    section.className =
      'toc-section toc-changes-section' + (collapsed ? ' is-collapsed' : '')

    const heading = document.createElement('button')
    heading.type = 'button'
    heading.className = 'toc-pinned-toggle'
    heading.title = collapsed ? '展开变更' : '收起变更'
    heading.setAttribute('aria-expanded', collapsed ? 'false' : 'true')

    const chevron = document.createElement('span')
    chevron.className = 'toc-chevron visible'
    chevron.setAttribute('aria-hidden', 'true')
    chevron.textContent = collapsed ? '▸' : '▾'

    const title = document.createElement('span')
    title.className = 'toc-pinned-title-text'
    title.textContent = collapsed
      ? `变更 (${gitStatusFor(state.selectedRepo)?.changed ?? entries.length})`
      : '变更'

    heading.appendChild(chevron)
    heading.appendChild(title)
    heading.addEventListener('click', () => {
      if (!state.selectedRepo) return
      post('setTocChangesCollapsed', {
        repo: state.selectedRepo,
        collapsed: !collapsed
      })
    })
    section.appendChild(heading)

    if (!collapsed) {
      for (const entry of entries) {
        const row = document.createElement('div')
        row.className = 'toc-item toc-changes-item'
        row.dataset.gitKey = entry.key
        row.title = entry.title

        const icon = document.createElement('span')
        icon.className = 'toc-shortcut-icon'
        icon.textContent = entry.kind === 'readme' ? '◈' : '·'

        const label = document.createElement('span')
        label.className = 'toc-label'
        label.textContent = entry.title

        row.appendChild(icon)
        row.appendChild(label)
        row.appendChild(createTocGitMark(entry.letter))

        row.addEventListener('click', () => {
          if (entry.kind === 'readme') post('openRepoReadme')
          else if (entry.noteDir) post('openNote', { noteDir: entry.noteDir })
        })

        section.appendChild(row)
      }
    }

    return section
  }

  function syncChangesSection() {
    const existing = tocBody.querySelector('.toc-changes-section')
    const section = renderChangesSection()
    if (!section) {
      existing?.remove()
      return
    }
    if (existing) {
      existing.replaceWith(section)
      return
    }
    const readme = tocBody.querySelector('.toc-item.toc-readme')
    if (readme) {
      tocBody.insertBefore(section, readme)
      return
    }
    const pinned = tocBody.querySelector('.toc-pinned-section')
    if (pinned) {
      pinned.after(section)
      return
    }
    const header = tocBody.querySelector('.toc-repo-header')
    if (header) header.after(section)
    else tocBody.prepend(section)
  }

  function syncRowGitMarks() {
    const marks = currentFileMarks()
    for (const row of tocBody.querySelectorAll('[data-git-key]')) {
      if (row.closest('.toc-changes-section')) continue
      upsertTocGitMark(row, marks[row.dataset.gitKey] || '')
    }
  }

  function applyGitStatuses(statuses, tocChangesCollapsed) {
    state.gitStatuses = statuses && typeof statuses === 'object' ? statuses : {}
    if (typeof tocChangesCollapsed === 'boolean') {
      state.tocChangesCollapsed = tocChangesCollapsed
    }

    if (state.mode === 'multi') {
      for (const li of kbList.querySelectorAll('.kb-item[data-repo]')) {
        const repo = li.dataset.repo
        const status = gitStatusFor(repo)
        const tip = gitTooltip(status)
        li.title = tip ? repo + ' · ' + tip : repo || ''
        const pinBtn = li.querySelector(':scope > .kb-pin')
        const prev = li.querySelector(':scope > .git-badges')
        const next = createGitBadges(status)
        if (prev) prev.replaceWith(next)
        else if (pinBtn) li.insertBefore(next, pinBtn)
        else li.appendChild(next)
      }
    }

    if (state.mode === 'single' && state.selectedRepo) {
      const header = tocBody.querySelector('.toc-repo-header .toc-repo-text')
      replaceGitBadges(header, gitStatusFor(state.selectedRepo))
    }

    if (state.mode !== 'none' && state.selectedRepo) {
      syncChangesSection()
      syncRowGitMarks()
    }
  }

  function renderRepoHeader() {
    if (state.mode !== 'single') return null
    const header = document.createElement('div')
    header.className = 'toc-repo-header'

    const img = document.createElement('img')
    img.className = 'toc-repo-icon'
    img.src = state.repoIconUri || state.fallbackIconUri
    img.alt = ''
    img.draggable = false

    const title = document.createElement('div')
    title.className = 'toc-repo-title'
    title.textContent = state.repoTitle || state.selectedRepo || ''

    const text = document.createElement('div')
    text.className = 'toc-repo-text'
    text.appendChild(title)
    text.appendChild(createGitBadges(gitStatusFor(state.selectedRepo)))

    header.appendChild(img)
    header.appendChild(text)
    header.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      if (!state.selectedRepo) return
      showContextMenu(e.clientX, e.clientY, [
        {
          label: '复制路径',
          onPick: () => post('copyKbPath', { repo: state.selectedRepo })
        }
      ])
    })
    return header
  }

  function renderKbList() {
    kbList.innerHTML = ''
    hideContextMenu()
    if (state.mode !== 'multi') {
      return
    }
    if (!state.knowledgeBases.length) {
      const empty = document.createElement('div')
      empty.className = 'empty'
      empty.textContent = 'No TNotes.* knowledge bases found.'
      kbList.appendChild(empty)
      return
    }

    for (const kb of state.knowledgeBases) {
      const pinned = !!kb.pinned
      const status = gitStatusFor(kb.repo)
      const tip = gitTooltip(status)
      const li = document.createElement('li')
      li.className =
        'kb-item' +
        (kb.repo === state.selectedRepo ? ' selected' : '') +
        (pinned ? ' pinned' : '')
      li.title = tip ? kb.repo + ' · ' + tip : kb.repo
      li.setAttribute('aria-label', kb.repo)
      li.dataset.repo = kb.repo

      const iconWrap = document.createElement('span')
      iconWrap.className = 'kb-icon-wrap'

      const img = document.createElement('img')
      img.className = 'kb-icon'
      img.src = kb.iconUri || state.fallbackIconUri
      img.alt = ''
      img.draggable = false
      iconWrap.appendChild(img)

      if (pinned) {
        const badge = document.createElement('span')
        badge.className = 'kb-pin-badge'
        badge.setAttribute('aria-hidden', 'true')
        iconWrap.appendChild(badge)
      }

      const label = document.createElement('span')
      label.className = 'kb-label'
      label.textContent = kb.title || String(kb.repo || '').replace(/^TNotes\./, '')

      const gitBadges = createGitBadges(status)
      const pinBtn = createPinButton(pinned, () => post('togglePin', { repo: kb.repo }))

      li.appendChild(iconWrap)
      li.appendChild(label)
      li.appendChild(gitBadges)
      li.appendChild(pinBtn)

      li.addEventListener('click', () => {
        hideContextMenu()
        post('selectKb', { repo: kb.repo })
      })
      li.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        showContextMenu(e.clientX, e.clientY, [
          {
            label: pinned ? '取消置顶' : '置顶',
            onPick: () => post('togglePin', { repo: kb.repo })
          },
          {
            label: '复制路径',
            onPick: () => post('copyKbPath', { repo: kb.repo })
          },
          {
            label: '打开终端',
            onPick: () => post('openKbTerminal', { repo: kb.repo })
          }
        ])
      })

      kbList.appendChild(li)
    }
  }

  function displayNoteTitle(title) {
    return String(title || '').replace(/^\d{4}\.\s*/, '') || title
  }

  function toggleCollapsed(nodeId, currentlyCollapsed) {
    if (!state.selectedRepo) return
    post('setTocCollapsed', {
      repo: state.selectedRepo,
      nodeId,
      collapsed: !currentlyCollapsed
    })
  }

  function toggleTocPin(nodeId) {
    if (!state.selectedRepo) return
    post('toggleTocPin', { repo: state.selectedRepo, nodeId })
  }

  function createTocNodeEl(node, depth, collapsed, pinnedIds) {
    const row = document.createElement('div')
    const hasChildren = Array.isArray(node.children) && node.children.length > 0
    const isGroup = node.type === 'group'
    const isCollapsed = collapsed.has(node.nodeId)
    const pinned = pinnedIds.has(node.nodeId)
    const gitLetter =
      !isGroup && node.noteDir ? currentFileMarks()[node.noteDir] || '' : ''

    row.className =
      'toc-item' +
      (isGroup ? ' toc-group' : ' toc-note') +
      (node.completed ? ' completed' : '') +
      (isCollapsed ? ' collapsed' : '') +
      (pinned ? ' pinned' : '')
    row.style.paddingLeft = `${8 + depth * TOC_INDENT_PX}px`
    row.title = node.title
    row.dataset.nodeId = node.nodeId
    if (!isGroup && node.noteDir) row.dataset.gitKey = node.noteDir

    const chevron = document.createElement('button')
    chevron.type = 'button'
    chevron.className = 'toc-chevron'
    if (hasChildren) {
      chevron.classList.add('visible')
      chevron.textContent = isCollapsed ? '▸' : '▾'
      chevron.title = isCollapsed ? 'Expand' : 'Collapse'
      chevron.addEventListener('click', (e) => {
        e.stopPropagation()
        toggleCollapsed(node.nodeId, isCollapsed)
      })
    } else {
      chevron.classList.add('spacer')
      chevron.tabIndex = -1
      chevron.setAttribute('aria-hidden', 'true')
    }

    const mark = document.createElement('span')
    mark.className = 'toc-mark'
    if (!isGroup) {
      mark.classList.add(node.completed ? 'done' : 'todo')
      mark.textContent = node.completed ? '✓' : '○'
    }

    const label = document.createElement('span')
    label.className = 'toc-label'
    label.textContent = isGroup ? node.title : displayNoteTitle(node.title)

    const pinBtn = createPinButton(pinned, () => toggleTocPin(node.nodeId))

    row.appendChild(chevron)
    if (!isGroup) row.appendChild(mark)
    row.appendChild(label)
    if (!isGroup) row.appendChild(createTocGitMark(gitLetter))
    row.appendChild(pinBtn)

    row.addEventListener('click', (e) => {
      e.stopPropagation()
      if (isGroup) {
        if (hasChildren) toggleCollapsed(node.nodeId, isCollapsed)
        return
      }
      if (node.noteDir) {
        post('openNote', { noteDir: node.noteDir })
      }
    })

    // --- drag & drop reorder (0002: writes go through Core Workspace) ---
    row.draggable = true
    row.addEventListener('dragstart', (e) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', node.nodeId)
        e.dataTransfer.effectAllowed = 'move'
        // Custom very-faint drag ghost so the drop indicator stays visible.
        const ghost = row.cloneNode(true)
        ghost.style.opacity = '0.08'
        ghost.style.position = 'absolute'
        ghost.style.top = '-10000px'
        ghost.style.left = '-10000px'
        document.body.appendChild(ghost)
        e.dataTransfer.setDragImage(ghost, 0, 0)
        window.setTimeout(() => ghost.remove(), 0)
      }
      row.classList.add('dragging')
    })
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging')
      row.classList.remove('drop-before', 'drop-after', 'drop-inside')
    })
    row.addEventListener('dragover', (e) => {
      if (!e.dataTransfer || !e.dataTransfer.types.includes('text/plain')) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      const rect = row.getBoundingClientRect()
      const ratio = (e.clientY - rect.top) / Math.max(rect.height, 1)
      // Indicator aligns with the target's indent so before/after lines at
      // different tree levels are visually distinct (e.g. last child inside a
      // group vs the group itself).
      if (row.style.paddingLeft) {
        row.style.setProperty('--drop-indent', row.style.paddingLeft)
      }
      row.classList.remove('drop-before', 'drop-after', 'drop-inside')
      row.classList.add(
        ratio < 0.3 ? 'drop-before' : ratio > 0.7 ? 'drop-after' : 'drop-inside'
      )
    })
    row.addEventListener('dragleave', () => {
      row.classList.remove('drop-before', 'drop-after', 'drop-inside')
    })
    row.addEventListener('drop', (e) => {
      e.preventDefault()
      row.classList.remove('drop-before', 'drop-after', 'drop-inside')
      if (!e.dataTransfer) return
      const sourceNodeId = e.dataTransfer.getData('text/plain')
      if (!sourceNodeId || sourceNodeId === node.nodeId) return
      const rect = row.getBoundingClientRect()
      const ratio = (e.clientY - rect.top) / Math.max(rect.height, 1)
      const placement = ratio < 0.3 ? 'before' : ratio > 0.7 ? 'after' : 'inside'
      post('tocMove', {
        repo: state.selectedRepo,
        sourceNodeId,
        targetNodeId: node.nodeId,
        placement
      })
    })

    row.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()
      const items = [
        {
          label: '在上方新建笔记',
          onPick: () =>
            post('tocCreateNote', {
              repo: state.selectedRepo,
              targetNodeId: node.nodeId,
              placement: 'before'
            })
        },
        {
          label: '在上方新建分组',
          onPick: () =>
            post('tocCreateGroup', {
              repo: state.selectedRepo,
              targetNodeId: node.nodeId,
              placement: 'before'
            })
        },
        {
          label: '在下方新建笔记',
          onPick: () =>
            post('tocCreateNote', {
              repo: state.selectedRepo,
              targetNodeId: node.nodeId,
              placement: 'after'
            })
        },
        {
          label: '在下方新建分组',
          onPick: () =>
            post('tocCreateGroup', {
              repo: state.selectedRepo,
              targetNodeId: node.nodeId,
              placement: 'after'
            })
        },
        {
          label: pinned ? '取消置顶' : '置顶',
          onPick: () => toggleTocPin(node.nodeId)
        },
        {
          label: '重命名',
          onPick: () => post('tocRename', { repo: state.selectedRepo, nodeId: node.nodeId })
        }
      ]
      if (!isGroup && node.noteDir) {
        items.push({
          label: '复制路径',
          onPick: () => post('copyNotePath', { noteDir: node.noteDir })
        })
      }
      items.push({
        label: '删除',
        onPick: () => post('tocDelete', { repo: state.selectedRepo, nodeId: node.nodeId })
      })
      showContextMenu(e.clientX, e.clientY, items)
    })

    const fragment = document.createDocumentFragment()
    fragment.appendChild(row)

    if (hasChildren && !isCollapsed) {
      for (const child of node.children) {
        fragment.appendChild(createTocNodeEl(child, depth + 1, collapsed, pinnedIds))
      }
    }

    return fragment
  }

  function renderPinnedSection() {
    const nodes = state.tocPinnedNodes || []
    if (!nodes.length) return null

    const collapsed = !!state.tocPinnedCollapsed
    const section = document.createElement('div')
    section.className =
      'toc-section toc-pinned-section' + (collapsed ? ' is-collapsed' : '')

    const heading = document.createElement('button')
    heading.type = 'button'
    heading.className = 'toc-pinned-toggle'
    heading.title = collapsed ? '展开置顶' : '收起置顶'
    heading.setAttribute('aria-expanded', collapsed ? 'false' : 'true')

    const chevron = document.createElement('span')
    chevron.className = 'toc-chevron visible'
    chevron.setAttribute('aria-hidden', 'true')
    chevron.textContent = collapsed ? '▸' : '▾'

    const title = document.createElement('span')
    title.className = 'toc-pinned-title-text'
    title.textContent = collapsed ? `置顶 (${nodes.length})` : '置顶'

    heading.appendChild(chevron)
    heading.appendChild(title)
    heading.addEventListener('click', () => {
      if (!state.selectedRepo) return
      post('setTocPinnedCollapsed', {
        repo: state.selectedRepo,
        collapsed: !collapsed
      })
    })
    section.appendChild(heading)

    if (!collapsed) {
      for (const node of nodes) {
        const row = document.createElement('div')
        const isGroup = node.type === 'group'
        row.className =
          'toc-item toc-pinned-item' +
          (isGroup ? ' toc-group' : ' toc-note') +
          (node.completed ? ' completed' : '')
        row.dataset.nodeId = node.nodeId
        row.title = node.title
        if (!isGroup && node.noteDir) row.dataset.gitKey = node.noteDir

        const icon = document.createElement('span')
        icon.className = 'toc-shortcut-icon'
        icon.textContent = isGroup ? '▸' : '·'

        const mark = document.createElement('span')
        mark.className = 'toc-mark'
        if (!isGroup) {
          mark.classList.add(node.completed ? 'done' : 'todo')
          mark.textContent = node.completed ? '✓' : '○'
        }

        const label = document.createElement('span')
        label.className = 'toc-label'
        label.textContent = isGroup ? node.title : displayNoteTitle(node.title)

        const gitLetter =
          !isGroup && node.noteDir ? currentFileMarks()[node.noteDir] || '' : ''
        const pinBtn = createPinButton(true, () => toggleTocPin(node.nodeId))

        row.appendChild(icon)
        if (!isGroup) row.appendChild(mark)
        row.appendChild(label)
        if (!isGroup) row.appendChild(createTocGitMark(gitLetter))
        row.appendChild(pinBtn)

        row.addEventListener('click', () => {
          if (isGroup) {
            post('revealTocNode', { repo: state.selectedRepo, nodeId: node.nodeId })
          } else if (node.noteDir) {
            post('openNote', { noteDir: node.noteDir })
          }
        })
        row.addEventListener('contextmenu', (e) => {
          e.preventDefault()
          const items = [
            {
              label: '取消置顶',
              onPick: () => toggleTocPin(node.nodeId)
            }
          ]
          if (!isGroup && node.noteDir) {
            items.push({
              label: '复制路径',
              onPick: () => post('copyNotePath', { noteDir: node.noteDir })
            })
          }
          showContextMenu(e.clientX, e.clientY, items)
        })

        section.appendChild(row)
      }
    }

    return section
  }

  function renderReadmeRow() {
    const row = document.createElement('div')
    row.className = 'toc-item toc-readme'
    row.title = 'README.md'
    row.dataset.gitKey = GIT_README_MARK_KEY

    const icon = document.createElement('span')
    icon.className = 'toc-readme-icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = '◈'

    const label = document.createElement('span')
    label.className = 'toc-label'
    label.textContent = 'README.md'

    const gitLetter = currentFileMarks()[GIT_README_MARK_KEY] || ''

    row.appendChild(icon)
    row.appendChild(label)
    row.appendChild(createTocGitMark(gitLetter))
    row.addEventListener('click', () => post('openRepoReadme'))
    return row
  }

  function scrollToTocNode(nodeId) {
    const el = tocBody.querySelector(`.toc-tree [data-node-id="${CSS.escape(nodeId)}"]`)
    if (!el) return
    el.classList.add('toc-flash')
    el.scrollIntoView({ block: 'nearest' })
    setTimeout(() => el.classList.remove('toc-flash'), 1200)
  }

  function renderToc() {
    tocBody.innerHTML = ''

    if (state.mode === 'none') {
      const empty = document.createElement('div')
      empty.className = 'empty empty-center'
      empty.textContent = '未识别到 TNotes 知识库'
      tocBody.appendChild(empty)
      return
    }

    if (state.mode === 'multi' && !state.selectedRepo) {
      const empty = document.createElement('div')
      empty.className = 'empty'
      empty.textContent = 'Select a knowledge base'
      tocBody.appendChild(empty)
      return
    }

    const header = renderRepoHeader()
    if (header) tocBody.appendChild(header)

    const pinnedSection = renderPinnedSection()
    if (pinnedSection) tocBody.appendChild(pinnedSection)

    const changesSection = renderChangesSection()
    if (changesSection) tocBody.appendChild(changesSection)

    tocBody.appendChild(renderReadmeRow())

    if (state.tocError) {
      const err = document.createElement('div')
      err.className = 'empty'
      err.textContent = state.tocError
      tocBody.appendChild(err)
      return
    }

    if (!state.toc.length) {
      const empty = document.createElement('div')
      empty.className = 'empty'
      empty.textContent = 'Empty TOC'
      tocBody.appendChild(empty)
      return
    }

    const collapsed = collapsedSet()
    const pinnedIds = tocPinnedSet()
    const tree = document.createElement('div')
    tree.className = 'toc-tree'
    for (const node of state.toc) {
      tree.appendChild(createTocNodeEl(node, 0, collapsed, pinnedIds))
    }
    tocBody.appendChild(tree)

    if (pendingScrollNodeId) {
      const id = pendingScrollNodeId
      pendingScrollNodeId = null
      requestAnimationFrame(() => scrollToTocNode(id))
    }
  }

  function syncPathInput(force) {
    if (!pathInput) return
    if (!force && pathInputDirty && document.activeElement === pathInput) return
    const next = state.addressPath || state.workspaceRoot || ''
    if (pathInput.value !== next) pathInput.value = next
    pathInputDirty = false
  }

  function submitPathLoad() {
    if (!pathInput) return
    pathInputDirty = false
    post('loadRoot', { path: pathInput.value })
  }

  function render() {
    applyLayoutMode()
    applyLeftWidth(state.leftWidth)
    syncPathInput(false)
    renderKbList()
    renderToc()
  }

  function onMessage(event) {
    const msg = event.data
    if (!msg || !msg.type) return
    if (msg.type === 'scrollToTocNode' && typeof msg.nodeId === 'string') {
      pendingScrollNodeId = msg.nodeId
      requestAnimationFrame(() => scrollToTocNode(msg.nodeId))
      return
    }
    if (msg.type === 'gitStatus') {
      applyGitStatuses(msg.gitStatuses, msg.tocChangesCollapsed)
      return
    }
    if (msg.type === 'setState') {
      state = {
        ...state,
        mode: msg.mode || 'none',
        knowledgeBases: msg.knowledgeBases || [],
        selectedRepo: msg.selectedRepo ?? null,
        pinnedRepos: msg.pinnedRepos || [],
        toc: msg.toc || [],
        tocError: msg.tocError ?? null,
        collapsedIds: msg.collapsedIds || [],
        tocPinnedIds: msg.tocPinnedIds || [],
        tocPinnedNodes: msg.tocPinnedNodes || [],
        tocPinnedCollapsed: Boolean(msg.tocPinnedCollapsed),
        tocChangesCollapsed: Boolean(msg.tocChangesCollapsed),
        repoTitle: msg.repoTitle ?? null,
        repoIconUri: msg.repoIconUri ?? null,
        gitStatuses:
          msg.gitStatuses && typeof msg.gitStatuses === 'object'
            ? msg.gitStatuses
            : state.gitStatuses,
        leftWidth: typeof msg.leftWidth === 'number' ? msg.leftWidth : state.leftWidth,
        fallbackIconUri: msg.fallbackIconUri || state.fallbackIconUri,
        workspaceRoot: msg.workspaceRoot ?? null,
        addressPath:
          typeof msg.addressPath === 'string' ? msg.addressPath : state.addressPath
      }
      syncPathInput(true)
      render()
    }
  }

  if (pathInput) {
    pathInput.addEventListener('input', () => {
      pathInputDirty = true
    })
    pathInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        submitPathLoad()
      }
    })
  }
  if (pathRefresh) {
    pathRefresh.addEventListener('click', () => submitPathLoad())
  }

  let dragging = false
  let startX = 0
  let startWidth = 0

  function onPointerDown(e) {
    dragging = true
    startX = e.clientX
    startWidth = leftPane.getBoundingClientRect().width
    splitter.classList.add('dragging')
    document.body.classList.add('resizing')
    splitter.setPointerCapture?.(e.pointerId)
    e.preventDefault()
  }

  function onPointerMove(e) {
    if (!dragging) return
    applyLeftWidth(startWidth + (e.clientX - startX))
  }

  function onPointerUp() {
    if (!dragging) return
    dragging = false
    splitter.classList.remove('dragging')
    document.body.classList.remove('resizing')
    const width = applyLeftWidth(state.leftWidth)
    post('setSplit', { leftWidth: width })
  }

  splitter.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('message', onMessage)
  window.addEventListener('resize', () => applyLeftWidth(state.leftWidth))
  window.addEventListener('blur', hideContextMenu)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideContextMenu()
  })

  post('ready')
})()
