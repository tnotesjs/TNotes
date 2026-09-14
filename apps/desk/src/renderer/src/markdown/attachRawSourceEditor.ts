import type { EditorView } from '@milkdown/kit/prose/view'
import { registerPendingEdit } from '../editor/markdown/pendingEdits'
import { DESK_RAW_BLOCK_COMMIT_META } from './readonlyGuard'

import {
  createContainerSourceEditor,
  type ContainerSourceEditorHandle
} from '../editor/markdown/containerSourceEditor'
import { deleteDeskRawBlockAt } from '../editor/markdown/rawBlockEmpty'
import { parseFencedCode, rebuildMermaidFence } from '../editor/markdown/diagramRenderer'
import {
  parseBilibiliVideoSource,
  parseWordListSource,
  parseNotesTableSource,
  rebuildBilibiliVideoSource,
  rebuildWordListSource,
  rebuildNotesTableSource
} from '../editor/markdown/componentBody'
import {
  parseContainerSource,
  preservedContainerSource,
  rebuildContainerSource
} from '../editor/markdown/containerBody'

export interface AttachRawSourceEditorDeps {
  knowledgeBaseId?: () => string
  noteUuid?: () => string
  isEffectivelyReadOnly: () => boolean
  rawSourceReadonlyListeners: Set<(readOnly: boolean) => void>
}

export interface RawSourceEditorContext {
  dom: HTMLElement
  source: string
  view: EditorView
  getPos: () => number | undefined
  label: string
  /** Structured callouts edit title+body only; fences stay locked. */
  structuredCallout?: boolean
  /** BilibiliVideo: edit BV id only; rebuild canonical full tag. */
  structuredBilibili?: boolean
  /** WordList: edit words + needSort; rebuild canonical full tag. */
  structuredWordList?: boolean
  /** Mermaid: edit diagram body only; fence + center stay locked (center via toggle). */
  structuredMermaid?: boolean
  /** Mindmap: edit diagram body only; fence locked. */
  structuredMindmap?: boolean
  /** NotesTable: edit ids list; rebuild tag. */
  structuredNotesTable?: boolean
  /** code-group / swiper: edit body only; container fences locked. */
  structuredContainerBody?: boolean
  /** Use the shared icon+Edit pill chrome without enabling a structured form. */
  editPill?: boolean
  /** Live atom source when writebacks update the node without remounting. */
  getSource?: () => string
  renderPreview: (source: string) => void
}

export interface RawSourceEditorHandle {
  (): void
  destroy(): void
  /** Pull the latest atom source into an open Edit panel (e.g. after highlight writeback). */
  syncFromAtom(): void
}

/**
 * Wires the edit button + inline editor onto an editable raw block. Structured
 * callouts (tip/info/…) expose title + body only; other blocks still edit the
 * full source. Commits update the atom source and are reconciled by
 * sourcePreservation.
 */
export const EDIT_PILL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.06 9.02 14.98 9.94 5.92 19H5v-.92l9.06-9.06ZM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41L18.37 3.29c-.2-.2-.45-.29-.71-.29ZM14.06 6.19 3 17.25V21h3.75L17.81 9.94 14.06 6.19Z"/></svg>`
export const DONE_PILL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.55 18.2 3.65 12.3l1.4-1.4 4.5 4.5L18.95 5.95l1.4 1.4z"/></svg>`

export function attachRawSourceEditor(
  ctx: RawSourceEditorContext,
  deps: AttachRawSourceEditorDeps
): RawSourceEditorHandle {
  const { isEffectivelyReadOnly, rawSourceReadonlyListeners } = deps
  const liveSource = (): string => ctx.getSource?.() ?? ctx.source
  /** Document atom — preview cache (`getSource`) can be ahead of this. */
  const atomSource = (): string => {
    const position = ctx.getPos()
    if (position != null) {
      const node = ctx.view.state.doc.nodeAt(position)
      if (node?.type.name === 'deskRawBlock') return String(node.attrs.source ?? '')
    }
    return ctx.source
  }
  const structured = Boolean(
    ctx.structuredCallout ||
    ctx.structuredBilibili ||
    ctx.structuredWordList ||
    ctx.structuredMermaid ||
    ctx.structuredMindmap ||
    ctx.structuredNotesTable ||
    ctx.structuredContainerBody
  )
  const useEditPill = structured || Boolean(ctx.editPill)
  const editButton = document.createElement('button')
  editButton.type = 'button'
  editButton.className = useEditPill
    ? 'desk-raw-block__edit desk-raw-block__edit--pill'
    : 'desk-raw-block__edit'
  editButton.innerHTML = EDIT_PILL_ICON
  editButton.setAttribute('aria-label', '编辑源码')
  editButton.title = '编辑源码'
  const editorHost = document.createElement('div')
  editorHost.className = structured
    ? 'desk-raw-block__editor desk-raw-block__editor--structured'
    : 'desk-raw-block__editor'
  editorHost.hidden = true
  ctx.dom.append(editButton, editorHost)

  let editorValue = liveSource()
  /** Skip publishDraft while pulling atom → Edit panel (avoids preview remount). */
  let suppressPublish = false
  let draftTitle = ''
  let draftBody = ''
  /**
   * 进入编辑时的结构化基线。用户没有改动时保持原始字节：重建只做空白/冒号规范化，
   * 「打开编辑 → 点完成」不应该把未改动的块弄脏。外部内容同步时会一起更新。
   */
  let structuredBaseline: { source: string; title: string; body: string } | null = null
  let draftMermaidBody = ''
  let draftMindmapBody = ''
  let draftNotesTableIds = ''
  let draftContainerBody = ''
  let draftBilibiliId = ''
  let draftBilibiliAutoplay = false
  let draftBilibiliMuted = false
  let draftWordListText = ''
  let draftWordListNeedSort = false
  let syncTimer: ReturnType<typeof setTimeout> | null = null
  let blurCommitTimer: ReturnType<typeof setTimeout> | null = null
  let editing = false
  let editorHandle: ContainerSourceEditorHandle | null = null

  const fitEditorToSource = (value: string): void => {
    const lines = Math.max(1, value.split(/\r?\n/).length)
    editorHost.style.setProperty('--desk-raw-editor-height', `${Math.min(320, lines * 24 + 16)}px`)
  }

  /**
   * 编辑器里**真实显示**的文本。
   *
   * 结构化块把标题与围栏放进了表头字段（`::: details 标题` 的围栏、``` 围栏、`层` 控件……），
   * CodeMirror 里只有正文；非结构化块 CM 里才是整块源码。
   * 高度必须按这个字符串算 —— 按 `editorValue`（重建后的整块源码）算会多出「围栏 + 标题 +
   * 块间空行」好几行，底部就留一大片空白（3 行正文被撑成 7 行的高度）。
   */
  const editorShownText = (): string => {
    if (ctx.structuredWordList) return draftWordListText
    if (ctx.structuredMermaid) return draftMermaidBody
    if (ctx.structuredMindmap) return draftMindmapBody
    if (ctx.structuredNotesTable) return draftNotesTableIds
    if (ctx.structuredContainerBody) return draftContainerBody
    if (structured) return draftBody
    return editorValue
  }

  const clearBlurCommit = (): void => {
    if (blurCommitTimer != null) {
      clearTimeout(blurCommitTimer)
      blurCommitTimer = null
    }
  }

  const closeEditing = (): void => {
    clearBlurCommit()
    if (syncTimer != null) {
      clearTimeout(syncTimer)
      syncTimer = null
    }
    editing = false
    editorHandle?.destroy()
    editorHandle = null
    editorHost.hidden = true
    editButton.hidden = false
    editButton.disabled = false
    pendingEdit.changed()
  }

  const applyReadonly = (readOnly: boolean): void => {
    if (readOnly) {
      if (syncTimer != null) {
        clearTimeout(syncTimer)
        syncTimer = null
      }
      if (editing) writeAtom()
      closeEditing()
      editButton.hidden = true
      editButton.disabled = true
      return
    }
    if (!editing) {
      editButton.hidden = false
      editButton.disabled = false
    }
  }

  const pullLatestDraft = (): void => {
    if (!editorHandle) return
    const latest = editorHandle.getValue()
    if (ctx.structuredCallout) draftBody = latest
    else if (ctx.structuredContainerBody) draftContainerBody = latest
    else if (ctx.structuredMermaid) draftMermaidBody = latest
    else if (ctx.structuredMindmap) draftMindmapBody = latest
    else if (ctx.structuredNotesTable) draftNotesTableIds = latest
    else if (!structured) editorValue = latest
  }

  /** Write the open draft onto the ProseMirror atom. Preview cache is not the atom. */
  const writeAtom = (): boolean => {
    if (!editing) return false
    pullLatestDraft()
    if (ctx.structuredCallout || ctx.structuredContainerBody || structured) {
      publishDraft({ ignoreReadOnly: true })
    }
    if (syncTimer != null) {
      clearTimeout(syncTimer)
      syncTimer = null
    }
    if (editorValue === atomSource()) return false
    const position = ctx.getPos()
    if (position == null) return false
    const currentNode = ctx.view.state.doc.nodeAt(position)
    if (currentNode?.type.name !== 'deskRawBlock') return false
    ctx.view.dispatch(
      ctx.view.state.tr
        .setNodeMarkup(position, undefined, {
          ...(currentNode.attrs as Record<string, unknown>),
          source: editorValue
        })
        .setMeta(DESK_RAW_BLOCK_COMMIT_META, true)
    )
    return true
  }

  const commit = (): void => {
    if (!editing) return
    if (isEffectivelyReadOnly()) {
      applyReadonly(true)
      return
    }
    writeAtom()
    setTimeout(closeEditing, 0)
  }

  /** Empty source + Backspace at doc start → delete the atom (Crepe code-block UX). */
  const removeBlockOnEmptyBackspace = (): boolean => {
    if (isEffectivelyReadOnly()) return false
    const position = ctx.getPos()
    if (position == null) return false
    if (syncTimer != null) {
      clearTimeout(syncTimer)
      syncTimer = null
    }
    clearBlurCommit()
    const handle = editorHandle
    editorHandle = null
    editing = false
    handle?.destroy()
    return deleteDeskRawBlockAt(ctx.view, position)
  }

  const unchangedStructuredSource = (draft: { title?: string; body: string }): string | null =>
    preservedContainerSource(structuredBaseline, liveSource(), draft)

  const publishDraft = (options?: { ignoreReadOnly?: boolean }): void => {
    if (suppressPublish) return
    if (!options?.ignoreReadOnly && isEffectivelyReadOnly()) return
    if (ctx.structuredBilibili) {
      const parsed = parseBilibiliVideoSource(liveSource())
      editorValue = rebuildBilibiliVideoSource({
        id: draftBilibiliId,
        autoplay: draftBilibiliAutoplay,
        muted: draftBilibiliMuted,
        trailingNewline: parsed?.trailingNewline ?? true
      })
    } else if (ctx.structuredWordList) {
      const parsed = parseWordListSource(liveSource())
      const words = draftWordListText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
      editorValue = rebuildWordListSource({
        words,
        needSort: draftWordListNeedSort,
        trailingNewline: parsed?.trailingNewline ?? true
      })
    } else if (ctx.structuredMermaid) {
      const center = parseFencedCode(editorValue).center
      editorValue = rebuildMermaidFence(liveSource(), center, draftMermaidBody)
    } else if (ctx.structuredMindmap) {
      const fence = parseFencedCode(liveSource())
      const trailingNewline = /\r?\n$/.test(liveSource())
      const open = fence.title ? `\`\`\`mindmap [${fence.title}]` : '```mindmap'
      const core = `${open}\n${draftMindmapBody.replace(/\n$/, '')}\n\`\`\``
      editorValue = trailingNewline ? `${core}\n` : core
    } else if (ctx.structuredNotesTable) {
      const ids = draftNotesTableIds
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
      editorValue = rebuildNotesTableSource({
        ids,
        trailingNewline: parseNotesTableSource(liveSource())?.trailingNewline ?? true
      })
    } else if (ctx.structuredContainerBody) {
      const parsed = parseContainerSource(liveSource())
      editorValue =
        unchangedStructuredSource({ body: draftContainerBody }) ??
        rebuildContainerSource(liveSource(), {
          title: parsed.title,
          body: draftContainerBody,
          name: parsed.name
        })
    } else {
      const parsed = parseContainerSource(liveSource())
      editorValue =
        unchangedStructuredSource({ title: draftTitle.trim(), body: draftBody }) ??
        rebuildContainerSource(liveSource(), {
          title: draftTitle,
          body: draftBody,
          name: parsed.name
        })
    }
    fitEditorToSource(editorShownText())
    pendingEdit.changed()
    if (syncTimer != null) clearTimeout(syncTimer)
    syncTimer = setTimeout(() => {
      ctx.renderPreview(editorValue)
      expandDetailsPreview()
    }, 250)
  }

  /** Details stays open while the structured editor is active. */
  const expandDetailsPreview = (): void => {
    const details = ctx.dom.querySelector(
      'details.custom-block-details'
    ) as HTMLDetailsElement | null
    if (details) details.open = true
  }

  /** Structured callouts: leaving the editor chrome auto-commits (Done). */
  const scheduleCommitOnBlur = (event: FocusEvent): void => {
    if (!structured || !editing) return
    const next = event.relatedTarget
    if (next instanceof Node && editorHost.contains(next)) return
    clearBlurCommit()
    const leftForSure = next instanceof Node && !editorHost.contains(next)
    blurCommitTimer = setTimeout(() => {
      blurCommitTimer = null
      if (!editing) return
      if (!leftForSure) {
        const active = document.activeElement
        if (active instanceof Node && editorHost.contains(active)) return
      }
      commit()
    }, 0)
  }

  if (structured) {
    editorHost.addEventListener('focusout', scheduleCommitOnBlur)
  }

  const startEditing = (): void => {
    if (editing || isEffectivelyReadOnly()) return
    editing = true
    editorValue = liveSource()
    editButton.hidden = true
    editButton.disabled = true
    expandDetailsPreview()

    editorHost.replaceChildren()

    if (ctx.structuredBilibili) {
      const parsed = parseBilibiliVideoSource(liveSource())
      draftBilibiliId = parsed?.id ?? ''
      draftBilibiliAutoplay = parsed?.autoplay ?? false
      draftBilibiliMuted = parsed?.muted ?? false
      fitEditorToSource(editorValue)

      const done = document.createElement('button')
      done.type = 'button'
      done.className = 'desk-raw-block__edit desk-raw-block__edit--pill desk-raw-block__editor-done'
      done.innerHTML = DONE_PILL_ICON
      done.setAttribute('aria-label', '完成编辑')
      done.title = '完成编辑'
      done.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        commit()
      })

      const fields = document.createElement('div')
      fields.className = 'desk-raw-block__editor-fields'

      const idInput = document.createElement('input')
      idInput.type = 'text'
      idInput.className = 'desk-raw-block__editor-title'
      idInput.value = draftBilibiliId
      idInput.placeholder = 'BVID，例如 BV1QR4y1y7GG'
      idInput.spellcheck = false
      idInput.addEventListener('input', () => {
        draftBilibiliId = idInput.value.trim()
        publishDraft()
      })
      idInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          commit()
        }
        if (
          event.key === 'Backspace' &&
          draftBilibiliId === '' &&
          idInput.selectionStart === 0 &&
          idInput.selectionEnd === 0
        ) {
          event.preventDefault()
          removeBlockOnEmptyBackspace()
        }
      })

      const toggles = document.createElement('div')
      toggles.className = 'desk-raw-block__editor-toggles'

      const autoplayLabel = document.createElement('label')
      autoplayLabel.className = 'desk-raw-block__editor-toggle'
      const autoplayInput = document.createElement('input')
      autoplayInput.type = 'checkbox'
      autoplayInput.checked = draftBilibiliAutoplay
      autoplayInput.addEventListener('change', () => {
        draftBilibiliAutoplay = autoplayInput.checked
        publishDraft()
      })
      autoplayLabel.append(autoplayInput, document.createTextNode('自动播放'))

      const mutedLabel = document.createElement('label')
      mutedLabel.className = 'desk-raw-block__editor-toggle'
      const mutedInput = document.createElement('input')
      mutedInput.type = 'checkbox'
      mutedInput.checked = draftBilibiliMuted
      mutedInput.addEventListener('change', () => {
        draftBilibiliMuted = mutedInput.checked
        publishDraft()
      })
      mutedLabel.append(mutedInput, document.createTextNode('静音'))

      toggles.append(autoplayLabel, mutedLabel)
      fields.append(idInput, toggles)
      editorHost.append(done, fields)
      editorHost.hidden = false
      window.setTimeout(() => idInput.focus(), 0)
      return
    }

    if (ctx.structuredWordList) {
      const parsed = parseWordListSource(liveSource())
      draftWordListText = (parsed?.words ?? []).join('\n')
      draftWordListNeedSort = parsed?.needSort ?? false
      fitEditorToSource(editorShownText())

      const done = document.createElement('button')
      done.type = 'button'
      done.className = 'desk-raw-block__edit desk-raw-block__edit--pill desk-raw-block__editor-done'
      done.innerHTML = DONE_PILL_ICON
      done.setAttribute('aria-label', '完成编辑')
      done.title = '完成编辑'
      done.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        commit()
      })

      const fields = document.createElement('div')
      fields.className = 'desk-raw-block__editor-fields'

      const cmHost = document.createElement('div')
      cmHost.className = 'desk-raw-block__editor-cm'

      const toggles = document.createElement('div')
      toggles.className = 'desk-raw-block__editor-toggles'
      const sortLabel = document.createElement('label')
      sortLabel.className = 'desk-raw-block__editor-toggle'
      const sortInput = document.createElement('input')
      sortInput.type = 'checkbox'
      sortInput.checked = draftWordListNeedSort
      sortInput.addEventListener('change', () => {
        draftWordListNeedSort = sortInput.checked
        publishDraft()
      })
      sortLabel.append(sortInput, document.createTextNode('按字母排序'))
      toggles.append(sortLabel)

      fields.append(cmHost, toggles)
      editorHost.append(done, fields)
      editorHost.hidden = false

      editorHandle = createContainerSourceEditor(
        cmHost,
        draftWordListText,
        (value) => {
          draftWordListText = value
          publishDraft()
        },
        () => commit(),
        {
          onEmptyBackspace: removeBlockOnEmptyBackspace,
          placeholder: '每行一个单词'
        }
      )
      return
    }

    if (ctx.structuredMermaid) {
      draftMermaidBody = parseFencedCode(liveSource()).code
      fitEditorToSource(editorShownText())

      const done = document.createElement('button')
      done.type = 'button'
      done.className = 'desk-raw-block__edit desk-raw-block__edit--pill desk-raw-block__editor-done'
      done.innerHTML = DONE_PILL_ICON
      done.setAttribute('aria-label', '完成编辑')
      done.title = '完成编辑'
      done.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        commit()
      })

      const fields = document.createElement('div')
      fields.className = 'desk-raw-block__editor-fields'

      const cmHost = document.createElement('div')
      cmHost.className = 'desk-raw-block__editor-cm'
      fields.append(cmHost)
      editorHost.append(done, fields)
      editorHost.hidden = false

      editorHandle = createContainerSourceEditor(
        cmHost,
        draftMermaidBody,
        (value) => {
          draftMermaidBody = value
          publishDraft()
        },
        () => commit(),
        {
          onEmptyBackspace: removeBlockOnEmptyBackspace,
          placeholder: '输入 Mermaid 图表源码…'
        }
      )
      return
    }

    if (ctx.structuredMindmap || ctx.structuredContainerBody) {
      draftMindmapBody = ctx.structuredMindmap ? parseFencedCode(liveSource()).code : ''
      draftContainerBody = ctx.structuredContainerBody
        ? parseContainerSource(liveSource()).body
        : ''
      if (ctx.structuredContainerBody) {
        const parsed = parseContainerSource(liveSource())
        structuredBaseline = { source: liveSource(), title: parsed.title, body: parsed.body }
      }
      const initial = ctx.structuredMindmap ? draftMindmapBody : draftContainerBody
      fitEditorToSource(editorShownText())

      const done = document.createElement('button')
      done.type = 'button'
      done.className = 'desk-raw-block__edit desk-raw-block__edit--pill desk-raw-block__editor-done'
      done.innerHTML = DONE_PILL_ICON
      done.setAttribute('aria-label', '完成编辑')
      done.title = '完成编辑'
      done.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        commit()
      })

      const fields = document.createElement('div')
      fields.className = 'desk-raw-block__editor-fields'
      const cmHost = document.createElement('div')
      cmHost.className = 'desk-raw-block__editor-cm'
      fields.append(cmHost)
      editorHost.append(done, fields)
      editorHost.hidden = false

      editorHandle = createContainerSourceEditor(
        cmHost,
        initial,
        (value) => {
          if (ctx.structuredMindmap) draftMindmapBody = value
          else draftContainerBody = value
          publishDraft()
        },
        () => commit(),
        {
          onEmptyBackspace: removeBlockOnEmptyBackspace,
          placeholder: ctx.structuredMindmap ? '输入思维导图 Markdown…' : '编辑容器正文…'
        }
      )
      return
    }

    if (ctx.structuredNotesTable) {
      draftNotesTableIds = (parseNotesTableSource(liveSource())?.ids ?? []).join('\n')
      fitEditorToSource(editorShownText())

      const done = document.createElement('button')
      done.type = 'button'
      done.className = 'desk-raw-block__edit desk-raw-block__edit--pill desk-raw-block__editor-done'
      done.innerHTML = DONE_PILL_ICON
      done.setAttribute('aria-label', '完成编辑')
      done.title = '完成编辑'
      done.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        commit()
      })

      const fields = document.createElement('div')
      fields.className = 'desk-raw-block__editor-fields'
      const cmHost = document.createElement('div')
      cmHost.className = 'desk-raw-block__editor-cm'
      fields.append(cmHost)
      editorHost.append(done, fields)
      editorHost.hidden = false

      editorHandle = createContainerSourceEditor(
        cmHost,
        draftNotesTableIds,
        (value) => {
          draftNotesTableIds = value
          publishDraft()
        },
        () => commit(),
        {
          onEmptyBackspace: removeBlockOnEmptyBackspace,
          placeholder: '每行一个笔记 ID'
        }
      )
      return
    }

    if (structured) {
      const parsed = parseContainerSource(liveSource())
      draftTitle = parsed.title
      draftBody = parsed.body
      // Keep the stored source until the user edits — rebuild only normalizes
      // blank lines and would otherwise dirty an untouched block on Done.
      structuredBaseline = { source: liveSource(), title: parsed.title, body: parsed.body }
      fitEditorToSource(editorShownText())

      const done = document.createElement('button')
      done.type = 'button'
      done.className = 'desk-raw-block__edit desk-raw-block__edit--pill desk-raw-block__editor-done'
      done.innerHTML = DONE_PILL_ICON
      done.setAttribute('aria-label', '完成编辑')
      done.title = '完成编辑'
      done.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        commit()
      })

      const fields = document.createElement('div')
      fields.className = 'desk-raw-block__editor-fields'

      const titleInput = document.createElement('input')
      titleInput.type = 'text'
      titleInput.className = 'desk-raw-block__editor-title'
      titleInput.value = draftTitle
      titleInput.placeholder = '可选标题'
      titleInput.addEventListener('input', () => {
        draftTitle = titleInput.value
        publishDraft()
      })

      const cmHost = document.createElement('div')
      cmHost.className = 'desk-raw-block__editor-cm'
      fields.append(titleInput, cmHost)
      editorHost.append(done, fields)
      editorHost.hidden = false

      editorHandle = createContainerSourceEditor(
        cmHost,
        draftBody,
        (value) => {
          draftBody = value
          publishDraft()
        },
        () => commit(),
        {
          onEmptyBackspace: removeBlockOnEmptyBackspace,
          placeholder: '输入正文…'
        }
      )
    } else {
      const header = document.createElement('div')
      header.className = 'desk-raw-block__editor-header'
      const label = document.createElement('span')
      label.className = 'desk-raw-block__editor-label'
      label.textContent = ctx.label
      const done = document.createElement('button')
      done.type = 'button'
      done.className = 'desk-raw-block__edit desk-raw-block__edit--pill desk-raw-block__editor-done'
      done.innerHTML = DONE_PILL_ICON
      done.setAttribute('aria-label', '完成编辑')
      done.title = '完成编辑'
      header.append(label, done)
      done.addEventListener('click', (event) => {
        event.preventDefault()
        commit()
      })

      fitEditorToSource(editorShownText())
      const cmHost = document.createElement('div')
      cmHost.className = 'desk-raw-block__editor-cm'
      editorHost.append(header, cmHost)
      editorHost.hidden = false

      editorHandle = createContainerSourceEditor(
        cmHost,
        liveSource(),
        (value) => {
          if (isEffectivelyReadOnly()) return
          editorValue = value
          pendingEdit.changed()
          fitEditorToSource(value)
          if (syncTimer != null) clearTimeout(syncTimer)
          syncTimer = setTimeout(() => ctx.renderPreview(editorValue), 250)
        },
        () => commit(),
        { onEmptyBackspace: removeBlockOnEmptyBackspace }
      )
    }
    window.setTimeout(() => editorHandle?.focus(), 0)
  }

  editButton.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    startEditing()
  })
  const pendingEdit = registerPendingEdit({
    knowledgeBaseId: deps.knowledgeBaseId,
    noteUuid: deps.noteUuid,
    dirty: () => {
      if (!editing) return false
      if (editorHandle) {
        const latest = editorHandle.getValue()
        if (ctx.structuredCallout && latest !== draftBody) return true
        if (ctx.structuredContainerBody && latest !== draftContainerBody) return true
        if (ctx.structuredMermaid && latest !== draftMermaidBody) return true
        if (ctx.structuredMindmap && latest !== draftMindmapBody) return true
        if (ctx.structuredNotesTable && latest !== draftNotesTableIds) return true
        if (!structured && latest !== editorValue) return true
      }
      return editorValue !== atomSource()
    },
    flush: commit
  })
  rawSourceReadonlyListeners.add(applyReadonly)
  applyReadonly(isEffectivelyReadOnly())

  const destroy = (): void => {
    if (editing) writeAtom()
    pendingEdit.dispose()
    rawSourceReadonlyListeners.delete(applyReadonly)
    if (structured) {
      editorHost.removeEventListener('focusout', scheduleCommitOnBlur)
    }
    clearBlurCommit()
    if (syncTimer != null) clearTimeout(syncTimer)
    editorHandle?.destroy()
    editorHandle = null
  }

  const syncFromAtom = (): void => {
    if (!editing || !editorHandle) return
    const next = liveSource()
    editorValue = next
    // setValue fires docChanged → onChange → publishDraft; suppress so we don't
    // re-render the visual preview (and remount tab editors) while syncing.
    suppressPublish = true
    try {
      if (ctx.structuredCallout) {
        const parsed = parseContainerSource(next)
        draftTitle = parsed.title
        draftBody = parsed.body
        structuredBaseline = { source: next, title: parsed.title, body: parsed.body }
        editorHandle.setValue(draftBody)
        const titleInput = editorHost.querySelector(
          '.desk-raw-block__editor-title'
        ) as HTMLInputElement | null
        if (titleInput && document.activeElement !== titleInput) {
          titleInput.value = draftTitle
        }
        return
      }
      if (ctx.structuredContainerBody) {
        const parsed = parseContainerSource(next)
        draftContainerBody = parsed.body
        structuredBaseline = { source: next, title: parsed.title, body: parsed.body }
        editorHandle.setValue(draftContainerBody)
        return
      }
      if (ctx.structuredMermaid) {
        draftMermaidBody = parseFencedCode(next).code
        editorHandle.setValue(draftMermaidBody)
        return
      }
      if (ctx.structuredMindmap) {
        draftMindmapBody = parseFencedCode(next).code
        editorHandle.setValue(draftMindmapBody)
        return
      }
      editorHandle.setValue(next)
    } finally {
      suppressPublish = false
    }
  }

  return Object.assign(destroy, { destroy, syncFromAtom })
}
