// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  apply: vi.fn(),
  workspace: {
    reloadNoteFromDisk: vi.fn(async () => undefined),
    flushForHistoryRestore: vi.fn(async () => ({
      dirtyDocuments: [],
      dirtyTabs: [],
      pendingRecoveries: [],
      pendingEdits: [],
      kbSettingsDirty: false
    }))
  },
  plan: vi.fn()
}))

vi.mock('../stores/workspace', () => ({ useWorkspaceStore: () => mocks.workspace }))
vi.mock('../stores/toast', () => ({ pushToast: vi.fn() }))

import HistoryRestoreDialog from './HistoryRestoreDialog.vue'
import { HistoryFlushError } from './flushWriters'

import type { HistoryRestorePlanDto, NoteHistoryEditorTab } from '../../../shared/contracts'

const OID = 'a'.repeat(40)

const tab = {
  id: 'note-history:kb-1:0042',
  type: 'note-history',
  knowledgeBaseId: 'kb-1',
  knowledgeBaseName: 'KB',
  noteIndex: '0042',
  noteUuid: 'note-1',
  commit: OID,
  title: '历史 · 0042',
  icon: null
} as NoteHistoryEditorTab

const plan: HistoryRestorePlanDto = {
  planId: 'history-restore-1',
  revision: 1,
  knowledgeBaseId: 'kb-1',
  sourceCommit: OID,
  head: 'b'.repeat(40),
  noteIndex: '0042',
  note: { relPath: 'notes/0042. A.md', bytes: 120 },
  resources: [
    { relPath: 'assets/0042-a.png', bytes: 2048 },
    { relPath: 'assets/0042-b.excalidraw', bytes: 512 }
  ],
  preserved: [{ relPath: 'assets/0042-new.png', bytes: 4096 }],
  writeCount: 3,
  totalBytes: 2680,
  backupMessage: 'backup: 0042 恢复历史版本前备份',
  backupRequired: true,
  limitations: [{ code: 'unowned-assets', message: '有 1 个资源归属不明确' }]
}

beforeEach(() => {
  mocks.plan.mockReset()
  mocks.apply.mockReset()
  mocks.workspace.flushForHistoryRestore.mockClear()
  mocks.workspace.reloadNoteFromDisk.mockClear()
  mocks.apply.mockResolvedValue({
    ok: true,
    value: {
      operationId: 'history-restore-1',
      backupCommit: 'b'.repeat(40),
      restoreCommit: 'c'.repeat(40),
      writtenPaths: ['notes/0042. A.md', 'assets/0042-a.png'],
      headDrift: false
    }
  })
  ;(window as unknown as { desk: unknown }).desk = {
    history: { plan: mocks.plan, apply: mocks.apply }
  }
})

async function open() {
  mocks.plan.mockResolvedValue({ ok: true, value: plan })
  const wrapper = mount(HistoryRestoreDialog, {
    props: { tab, commit: OID, expectedHead: 'b'.repeat(40) }
  })
  await flushPromises()
  return wrapper
}

describe('恢复影响范围确认', () => {
  it('先 flush 再建计划，展示正文/资源/保留资源/备份与限制', async () => {
    const wrapper = await open()
    expect(mocks.workspace.flushForHistoryRestore).toHaveBeenCalledWith('kb-1')
    expect(mocks.plan).toHaveBeenCalledWith(
      expect.objectContaining({
        knowledgeBaseId: 'kb-1',
        noteIndex: '0042',
        commit: OID,
        expectedHead: 'b'.repeat(40)
      })
    )
    expect(wrapper.get('[data-history-restore-note]').text()).toBe('notes/0042. A.md')
    expect(wrapper.get('[data-history-restore-resources]').text()).toContain('2 个')
    expect(wrapper.get('[data-history-restore-preserved]').text()).toContain('0042-new.png')
    expect(wrapper.get('[data-history-restore-size]').text()).toContain('3 个文件')
    expect(wrapper.get('[data-history-restore-backup]').text()).toContain('backup: 0042')
    expect(wrapper.get('[data-history-restore-limits]').text()).toContain('归属不明确')
  })

  it('确认恢复只提交计划 ID + revision，成功后失效旧编辑会话并显示结果', async () => {
    const wrapper = await open()
    const confirm = wrapper.get('[data-history-restore-confirm]')
    expect(confirm.attributes('disabled')).toBeUndefined()
    await confirm.trigger('click')
    await flushPromises()

    expect(mocks.apply).toHaveBeenCalledWith({ planId: 'history-restore-1', revision: 1 })
    expect(mocks.workspace.reloadNoteFromDisk).toHaveBeenCalledWith('kb-1', 'note-1')
    expect(wrapper.get('[data-history-restore-done]').text()).toContain('恢复完成')
    expect(wrapper.get('[data-history-restore-done]').text()).toContain('ccccccc')
    // 完成后按钮不再可点，取消文案变成关闭
    expect(wrapper.get('[data-history-restore-confirm]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-history-restore-cancel]').text()).toBe('关闭')
  })

  it('主进程拒绝恢复时显示错误且不动编辑会话', async () => {
    mocks.apply.mockResolvedValue({
      ok: false,
      error: { code: 'RESTORE_IN_FLIGHT', message: '该知识库已有恢复在进行' }
    })
    const wrapper = await open()
    await wrapper.get('[data-history-restore-confirm]').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-history-restore-error]').text()).toContain('已有恢复在进行')
    expect(mocks.workspace.reloadNoteFromDisk).not.toHaveBeenCalled()
  })

  it('取消会关闭对话框', async () => {
    const wrapper = await open()
    await wrapper.get('[data-history-restore-cancel]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('主进程拒绝时把原因显示出来，不显示任何影响范围', async () => {
    mocks.plan.mockResolvedValue({
      ok: false,
      error: { code: 'PENDING_WRITERS', message: '还有未完成的写入' }
    })
    const wrapper = mount(HistoryRestoreDialog, { props: { tab, commit: OID } })
    await flushPromises()
    expect(wrapper.get('[data-history-restore-error]').text()).toContain('还有未完成的写入')
    expect(wrapper.find('[data-history-restore-facts]').exists()).toBe(false)
    expect(wrapper.find('[data-history-restore-confirm]').exists()).toBe(false)
  })

  it('flush 失败（画布写不完）时停在对话框里并说明', async () => {
    mocks.workspace.flushForHistoryRestore.mockRejectedValueOnce(
      new HistoryFlushError(['assets/0042-a.excalidraw'], '画布还有没写完的内容：磁盘已满')
    )
    const wrapper = mount(HistoryRestoreDialog, { props: { tab, commit: OID } })
    await flushPromises()
    expect(wrapper.get('[data-history-restore-error]').text()).toContain('画布还有没写完的内容')
    expect(mocks.plan).not.toHaveBeenCalled()
  })
})
