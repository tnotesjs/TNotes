// @vitest-environment happy-dom

import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useEditorStore } from './editor'

import type { AppSettings, KnowledgeBaseDescriptor } from '../../../shared/contracts'

const settings: AppSettings = {
  version: 1,
  theme: 'system',
  density: 'comfortable',
  defaultNoteView: 'visual',
  defaultNotePageWidth: 'standard',
  noteTocDisplay: 'expanded',
  appZoomPercent: 100,
  autosave: { enabled: true, delayMs: 800 },
  createNotePosition: 'top',
  workspaceLayout: 'kb-dir-content',
  prettier: true,
  ide: 'vscode',
  gitPath: null,
  nodePath: null,
  confirmBeforeCommit: false,
  tabs: { maxOpenCount: 10, wrap: true, autoRevealInToc: true },
  toc: {
    showNoteIndex: true,
    showNoteStatus: true,
    doneEmoji: '✅',
    undoneEmoji: '⏰',
    changesCollapsedByDefault: true
  },
  imageUpload: {
    defaultTarget: 'local',
    github: {
      repository: '',
      branch: 'main',
      path: '/',
      cdnTemplate: '',
      fileNameFormat: '${YY}-${MM}-${DD}-${HH}-${mm}-${ss}'
    },
    optimize: {
      encoder: 'sharp',
      strength: 'medium',
      maxDimension: null,
      outputFormat: 'keep'
    }
  },
  updates: { autoCheck: true },
  hiddenKnowledgeBases: [],
  knowledgeBases: {}
}

const knowledgeBase: KnowledgeBaseDescriptor = {
  id: 'kb-a',
  configId: 'TNotes.docs',
  name: 'TNotes.docs',
  rootPath: '/tmp/TNotes.docs',
  displayName: 'docs',
  icon: null,
  health: 'ready',
  diagnostics: [],
  noteCount: 3,
  snapshotRevision: 'revision'
}

const otherKnowledgeBase: KnowledgeBaseDescriptor = {
  ...knowledgeBase,
  id: 'kb-b',
  configId: 'TNotes.react',
  name: 'TNotes.react',
  rootPath: '/tmp/TNotes.react',
  displayName: 'react'
}

describe('editor store tab semantics', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(100)
  })

  afterEach(() => vi.useRealTimers())

  it('reuses one preview tab per group and keeps a double-opened tab', () => {
    const editor = useEditorStore()
    editor.configure(settings)

    const firstId = editor.openNote(knowledgeBase, 'note-a', 'A', 'visual')
    const secondId = editor.openNote(knowledgeBase, 'note-b', 'B', 'visual')

    expect(editor.activeGroup?.tabs).toHaveLength(1)
    expect(secondId).toBe(firstId)
    expect(editor.activeTab).toMatchObject({ id: firstId, noteUuid: 'note-b', preview: true })

    editor.keepOpen(editor.activeTab!.id)
    editor.openNote(knowledgeBase, 'note-c', 'C', 'visual')

    expect(editor.activeGroup?.tabs).toHaveLength(2)
    expect(editor.activeGroup?.tabs[0]).toMatchObject({ noteUuid: 'note-b', preview: false })
    expect(editor.activeTab).toMatchObject({ noteUuid: 'note-c', preview: true })
  })

  it('protects pinned tabs from explicit close', () => {
    const editor = useEditorStore()
    const tabId = editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    const groupId = editor.activeGroup!.id

    editor.setPinned(tabId, true)

    expect(editor.close(groupId, tabId)).toBe(false)
    expect(editor.activeGroup?.tabs).toHaveLength(1)
  })

  it('uses the configured page width for new notes and lets each note override it', () => {
    const editor = useEditorStore()
    editor.configure({ ...settings, defaultNotePageWidth: 'wide' })

    const firstId = editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    expect(editor.activeTab).toMatchObject({ id: firstId, pageWidth: 'wide' })

    editor.toggleNotePageWidth(firstId)
    expect(editor.activeTab).toMatchObject({ id: firstId, pageWidth: 'standard' })

    editor.configure(settings)
    expect(editor.activeTab).toMatchObject({ id: firstId, pageWidth: 'standard' })
    editor.openNote(knowledgeBase, 'note-b', 'B', 'visual', undefined, 'permanent')
    expect(editor.activeTab).toMatchObject({ noteUuid: 'note-b', pageWidth: 'standard' })
  })

  it('改无关设置不会重置标签的页宽覆盖', () => {
    const editor = useEditorStore()
    editor.configure(settings)
    const tabId = editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    editor.toggleNotePageWidth(tabId)
    expect(editor.activeTab).toMatchObject({ id: tabId, pageWidth: 'wide' })

    // 只改主题：默认页宽没变，覆盖必须保留
    editor.configure({ ...settings, theme: 'dark' })
    expect(editor.activeTab).toMatchObject({ id: tabId, pageWidth: 'wide' })

    // 默认页宽真的变了才回写
    editor.configure({ ...settings, defaultNotePageWidth: 'wide' })
    expect(editor.activeTab).toMatchObject({ id: tabId, pageWidth: 'wide' })
  })

  it('toggles the side outline independently of page width', () => {
    const editor = useEditorStore()
    editor.configure(settings)
    const firstId = editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    expect(editor.activeTab).toMatchObject({ id: firstId, outlineVisible: true })

    editor.toggleNoteOutlineVisible(firstId)
    expect(editor.activeTab).toMatchObject({ id: firstId, outlineVisible: false })
    editor.toggleNoteOutlineVisible(firstId)
    expect(editor.activeTab).toMatchObject({ id: firstId, outlineVisible: true })
  })

  it('keeps the last note scope while a web tab is active', () => {
    const editor = useEditorStore()
    editor.configure(settings)
    editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    expect(editor.activeNoteScope).toEqual({ noteUuid: 'note-a', noteTitle: 'A' })

    editor.openWeb('https://example.com')
    expect(editor.activeTab?.type).toBe('web')
    expect(editor.activeNoteScope).toEqual({ noteUuid: 'note-a', noteTitle: 'A' })
  })

  it('evicts the oldest closable tab when the configured limit is reached', () => {
    const editor = useEditorStore()
    editor.configure({ ...settings, tabs: { ...settings.tabs, maxOpenCount: 2 } })

    editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    vi.setSystemTime(200)
    editor.openNote(knowledgeBase, 'note-b', 'B', 'visual', undefined, 'permanent')
    vi.setSystemTime(300)
    editor.openNote(knowledgeBase, 'note-c', 'C', 'visual', undefined, 'permanent')

    expect(editor.activeGroup?.tabs.map((tab) => tab.type === 'note' && tab.noteUuid)).toEqual([
      'note-b',
      'note-c'
    ])
  })

  it('keeps tabs, web pages, and split layout independent for each knowledge base', () => {
    const editor = useEditorStore()
    editor.configure(settings)
    editor.switchKnowledgeBase(knowledgeBase.id, new Set(['note-a', 'note-b']))

    editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    editor.openNote(knowledgeBase, 'note-b', 'B', 'visual', 'right', 'permanent')
    const webTabId = editor.openWeb('https://example.com')
    expect(editor.layout.type).toBe('split')
    if (editor.layout.type !== 'split') throw new Error('expected a split layout')
    editor.resizeSplit(editor.layout.id, 0.68)

    editor.switchKnowledgeBase(otherKnowledgeBase.id, new Set(['react-a']))
    expect(editor.groups.flatMap((group) => group.tabs)).toEqual([])
    editor.openNote(otherKnowledgeBase, 'react-a', 'React A', 'visual', undefined, 'permanent')

    editor.switchKnowledgeBase(knowledgeBase.id, new Set(['note-a', 'note-b']))
    expect(editor.layout).toMatchObject({ type: 'split', ratio: 0.68 })
    expect(
      editor.groups
        .flatMap((group) => group.tabs)
        .map((tab) => (tab.type === 'note' ? `note:${tab.noteUuid}` : `web:${tab.id}`))
    ).toEqual(['note:note-a', 'note:note-b', `web:${webTabId}`])

    editor.switchKnowledgeBase(otherKnowledgeBase.id, new Set(['react-a']))
    expect(editor.layout.type).toBe('group')
    expect(editor.activeTab).toMatchObject({ type: 'note', noteUuid: 'react-a' })
  })

  it('persists every knowledge base editor session and restores the selected one', () => {
    const editor = useEditorStore()
    editor.configure(settings)
    editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    editor.openWeb('https://example.com/a')
    editor.openNote(otherKnowledgeBase, 'react-a', 'React A', 'visual', undefined, 'permanent')
    const session = editor.toSession(otherKnowledgeBase.id)

    setActivePinia(createPinia())
    const restored = useEditorStore()
    restored.configure(settings)
    restored.restore(session, [knowledgeBase, otherKnowledgeBase])

    expect(restored.activeKnowledgeBaseId).toBe(otherKnowledgeBase.id)
    expect(restored.activeTab).toMatchObject({ type: 'note', noteUuid: 'react-a' })
    restored.switchKnowledgeBase(knowledgeBase.id, new Set(['note-a']))
    expect(restored.groups.flatMap((group) => group.tabs).map((tab) => tab.type)).toEqual([
      'note',
      'web'
    ])
  })

  it('removes missing note tabs and collapses empty split groups when restoring a knowledge base', () => {
    const editor = useEditorStore()
    editor.configure(settings)
    editor.openNote(knowledgeBase, 'note-a', 'A', 'visual', undefined, 'permanent')
    editor.openNote(knowledgeBase, 'note-b', 'B', 'visual', 'right', 'permanent')
    expect(editor.layout.type).toBe('split')

    editor.switchKnowledgeBase(otherKnowledgeBase.id, new Set(['react-a']))
    editor.switchKnowledgeBase(knowledgeBase.id, new Set(['note-b']))

    expect(editor.layout.type).toBe('group')
    expect(editor.groups).toHaveLength(1)
    expect(editor.activeTab).toMatchObject({ type: 'note', noteUuid: 'note-b' })
  })
})

describe('画布标签页（E4）', () => {
  const path = 'assets/0042-26-09-11-10-20-30.excalidraw'

  beforeEach(() => {
    setActivePinia(createPinia())
    useEditorStore().configure(settings)
  })

  it('同一文件重复打开只保留一个标签页，并定位到已有实例', () => {
    const editor = useEditorStore()
    const first = editor.openExcalidraw(knowledgeBase, path)
    const second = editor.openExcalidraw(knowledgeBase, path)

    expect(second).toBe(first)
    expect(editor.groups.flatMap((group) => group.tabs)).toHaveLength(1)
    expect(editor.activeTab).toMatchObject({
      type: 'excalidraw',
      relPath: path,
      ownerNoteIndex: '0042',
      title: '0042-26-09-11-10-20-30.excalidraw'
    })
  })

  it('不同文件各自开标签，KB 切换后各自保留', () => {
    const editor = useEditorStore()
    editor.openExcalidraw(knowledgeBase, path)
    editor.openExcalidraw(knowledgeBase, 'assets/0043-26-09-11-10-20-30.excalidraw')
    expect(editor.groups.flatMap((group) => group.tabs)).toHaveLength(2)

    editor.switchKnowledgeBase(otherKnowledgeBase.id, new Set(['react-a']))
    editor.switchKnowledgeBase(knowledgeBase.id, new Set(['note-a']))
    expect(
      editor.groups
        .flatMap((group) => group.tabs)
        .filter((tab) => tab.type === 'excalidraw')
        .map((tab) => tab.relPath)
    ).toEqual([path, 'assets/0043-26-09-11-10-20-30.excalidraw'])
  })

  it('失效状态与重命名后的身份可以更新，并可跨会话恢复', () => {
    const editor = useEditorStore()
    const tabId = editor.openExcalidraw(knowledgeBase, path)
    editor.updateExcalidrawTabMeta(tabId, {
      relPath: 'assets/0042-26-09-11-11-00-00.excalidraw',
      title: '0042-26-09-11-11-00-00.excalidraw',
      invalid: true
    })
    expect(editor.activeTab).toMatchObject({
      relPath: 'assets/0042-26-09-11-11-00-00.excalidraw',
      invalid: true
    })

    const session = editor.toSession(knowledgeBase.id)
    setActivePinia(createPinia())
    const restored = useEditorStore()
    restored.configure(settings)
    restored.restore(session, [knowledgeBase, otherKnowledgeBase])

    // 文件缺失/损坏是状态，不是重建理由：恢复后仍带着 invalid 标记
    expect(restored.activeTab).toMatchObject({ type: 'excalidraw', invalid: true })
  })

  it('反序列化时丢弃未知知识库的画布标签，但保留没有 noteUuid 的合法标签', () => {
    const editor = useEditorStore()
    editor.openExcalidraw(knowledgeBase, path)
    const session = editor.toSession(knowledgeBase.id)

    setActivePinia(createPinia())
    const restored = useEditorStore()
    restored.configure(settings)
    // 只认识另一个 KB：本 KB 的画布标签应被丢弃，且不抛错
    restored.restore(session, [otherKnowledgeBase])
    expect(restored.groups.flatMap((group) => group.tabs)).toHaveLength(0)
  })

  it('资源重命名后标签跟随新路径与新归属，不新建标签页', () => {
    const editor = useEditorStore()
    editor.openExcalidraw(knowledgeBase, path)
    const next = 'assets/0043-26-09-11-12-00-00.excalidraw'

    editor.repathExcalidrawTab(knowledgeBase.id, path, next)

    expect(editor.groups.flatMap((group) => group.tabs)).toHaveLength(1)
    expect(editor.activeTab).toMatchObject({
      type: 'excalidraw',
      relPath: next,
      title: '0043-26-09-11-12-00-00.excalidraw',
      ownerNoteIndex: '0043',
      invalid: false
    })
    // 改名后再点开新路径仍然定位到同一个标签，不会出现第二个写者
    const reopened = editor.openExcalidraw(knowledgeBase, next)
    expect(reopened).toBe(editor.activeTab?.id)
    expect(editor.groups.flatMap((group) => group.tabs)).toHaveLength(1)
  })

  it('拆分画布标签只搬移、不复制（同一文件不出现两个编辑会话）', () => {
    const editor = useEditorStore()
    const canvasTabId = editor.openExcalidraw(knowledgeBase, path)
    const noteTabId = editor.openNote(
      knowledgeBase,
      'note-a',
      'A',
      'visual',
      undefined,
      'permanent'
    )
    const groupId = editor.activeGroupId
    expect(editor.groups).toHaveLength(1)

    editor.splitTab(canvasTabId, groupId, 'right')

    const tabs = editor.groups.flatMap((group) => group.tabs)
    expect(editor.groups).toHaveLength(2)
    expect(tabs.filter((tab) => tab.type === 'excalidraw')).toHaveLength(1)
    expect(tabs.map((tab) => tab.id).sort()).toEqual([canvasTabId, noteTabId].sort())
  })

  it('画布被回收（toRelPath 为空）只置失效，不按旧路径重建', () => {
    const editor = useEditorStore()
    editor.openExcalidraw(knowledgeBase, path)

    editor.repathExcalidrawTab(knowledgeBase.id, path, null)

    expect(editor.activeTab).toMatchObject({ type: 'excalidraw', relPath: path, invalid: true })
  })

  it('重命名只影响目标路径，其他 KB 与别的画布标签不受影响', () => {
    const editor = useEditorStore()
    const other = 'assets/0043-26-09-11-12-00-00.excalidraw'
    editor.openExcalidraw(knowledgeBase, path)
    editor.openExcalidraw(knowledgeBase, other)
    editor.openExcalidraw(otherKnowledgeBase, path)

    editor.repathExcalidrawTab(knowledgeBase.id, path, 'assets/0042-26-09-11-13-00-00.excalidraw')

    editor.switchKnowledgeBase(otherKnowledgeBase.id)
    expect(editor.activeTab).toMatchObject({ type: 'excalidraw', relPath: path, invalid: false })
    editor.switchKnowledgeBase(knowledgeBase.id)
    expect(
      editor.groups
        .flatMap((group) => group.tabs)
        .filter((tab) => tab.type === 'excalidraw')
        .map((tab) => [tab.relPath, Boolean(tab.invalid)])
    ).toEqual([
      ['assets/0042-26-09-11-13-00-00.excalidraw', false],
      [other, false]
    ])
  })
})
