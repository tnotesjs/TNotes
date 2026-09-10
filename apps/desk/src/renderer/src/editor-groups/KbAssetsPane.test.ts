// @vitest-environment happy-dom

import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  AssetJournalDto,
  AssetOperationPlanDto,
  AssetScanReportDto,
  KbAssetsEditorTab,
  KnowledgeBaseDescriptor
} from '../../../shared/contracts'
import { useEditorStore } from '../stores/editor'
import { useWorkspaceStore } from '../stores/workspace'
import KbAssetsPane from './KbAssetsPane.vue'

const knowledgeBase: KnowledgeBaseDescriptor = {
  id: 'kb-a',
  configId: 'docs',
  name: 'docs',
  rootPath: '/tmp/docs',
  displayName: 'docs',
  icon: null,
  health: 'ready',
  diagnostics: [],
  noteCount: 1,
  snapshotRevision: 'v1'
}

const tab: KbAssetsEditorTab = {
  id: 'kb-assets:kb-a',
  type: 'kb-assets',
  knowledgeBaseId: 'kb-a',
  knowledgeBaseName: 'docs',
  title: '资源',
  icon: null
}

function reportDto(overrides: Partial<AssetScanReportDto> = {}): AssetScanReportDto {
  return {
    generation: 1,
    coverageComplete: true,
    batchCleanupAllowed: true,
    sources: [],
    assets: [
      {
        relPath: 'assets/used.png',
        name: 'used.png',
        size: 80,
        mtimeMs: 1,
        kind: 'image',
        status: 'referenced',
        references: [
          {
            sourceRelPath: 'notes/0001. 图.md',
            startOffset: 0,
            endOffset: 18,
            line: 8,
            column: 1,
            rawUrl: '../assets/used.png',
            decodedPath: 'assets/used.png',
            targetRelPath: 'assets/used.png',
            syntax: 'markdown-image',
            urlKind: 'relative',
            urlSuffix: '',
            rewritable: true,
            noteUuid: 'note-writable',
            noteTitle: '图'
          }
        ],
        protection: [],
        renameAllowed: true
      },
      {
        relPath: 'assets/idle.png',
        name: 'idle.png',
        size: 80,
        mtimeMs: 1,
        kind: 'image',
        status: 'idle-candidate',
        references: [],
        protection: [],
        renameAllowed: true
      }
    ],
    references: [],
    brokenLinks: [],
    diagnostics: [],
    adapters: [],
    duplicateGroups: [],
    stats: {
      assetCount: 2,
      assetBytes: 160,
      determinedReferenceCount: 1,
      uncertainReferenceCount: 0,
      mergeableDuplicateCount: 0,
      crossNoteDuplicateCount: 0
    },
    ...overrides
  }
}

function planDto(overrides: Partial<AssetOperationPlanDto> = {}): AssetOperationPlanDto {
  return {
    id: 'plan-1',
    kind: 'rename',
    generation: 1,
    coverageComplete: true,
    blockedReasons: [],
    estimated: { filesTouched: 2, bytesMoved: 80 },
    moves: [{ fromRelPath: 'assets/used.png', toRelPath: 'assets/renamed.png' }],
    sourceRelPaths: ['notes/0001. 图.md'],
    ...overrides
  }
}

function journalDto(overrides: Partial<AssetJournalDto> = {}): AssetJournalDto {
  return {
    planId: 'plan-1',
    kind: 'rename',
    stage: 'applied',
    createdAt: '2026-09-10T00:00:00.000Z',
    restorable: true,
    estimated: { filesTouched: 2, bytesMoved: 80 },
    moves: [{ fromRelPath: 'assets/used.png', toRelPath: 'assets/renamed.png' }],
    ...overrides
  }
}

function setupDesk(overrides: Record<string, unknown> = {}): {
  scan: ReturnType<typeof vi.fn>
  planRename: ReturnType<typeof vi.fn>
  planRecycle: ReturnType<typeof vi.fn>
  apply: ReturnType<typeof vi.fn>
  restore: ReturnType<typeof vi.fn>
  history: ReturnType<typeof vi.fn>
  openKbAssets: ReturnType<typeof vi.fn>
} {
  const scan = vi.fn(async () => ({ ok: true, value: reportDto() }))
  const planRename = vi.fn(async () => ({ ok: true, value: planDto() }))
  const planRecycle = vi.fn(async () => ({
    ok: true,
    value: planDto({
      id: 'plan-recycle',
      kind: 'recycle',
      moves: [{ fromRelPath: 'assets/idle.png' }],
      sourceRelPaths: []
    })
  }))
  const apply = vi.fn(async () => ({
    ok: true,
    value: { planId: 'plan-1', status: 'applied', changedPaths: ['assets/renamed.png'] }
  }))
  const restore = vi.fn(async () => ({
    ok: true,
    value: { planId: 'plan-1', status: 'applied', changedPaths: ['assets/used.png'] }
  }))
  const history = vi.fn(async () => ({ ok: true, value: [] as AssetJournalDto[] }))
  const assets = {
    scan,
    cancel: vi.fn(async () => ({ ok: true, value: undefined })),
    summaries: vi.fn(async () => ({ ok: true, value: [] })),
    planRename,
    planRecycle,
    apply,
    restore,
    history,
    onScanProgress: () => () => undefined,
    ...overrides
  }
  Object.defineProperty(window, 'desk', {
    configurable: true,
    value: { assets }
  })
  const workspace = useWorkspaceStore()
  workspace.overview = {
    path: '/tmp',
    knowledgeBases: [knowledgeBase],
    allKnowledgeBases: [knowledgeBase]
  }
  const openKbAssets = vi.spyOn(useEditorStore(), 'openKbAssets')
  return {
    scan: assets.scan as ReturnType<typeof vi.fn>,
    planRename: assets.planRename as ReturnType<typeof vi.fn>,
    planRecycle: assets.planRecycle as ReturnType<typeof vi.fn>,
    apply: assets.apply as ReturnType<typeof vi.fn>,
    restore: assets.restore as ReturnType<typeof vi.fn>,
    history: assets.history as ReturnType<typeof vi.fn>,
    openKbAssets
  }
}

async function mountPane(): Promise<ReturnType<typeof mount>> {
  const wrapper = mount(KbAssetsPane, {
    props: { tab, active: true },
    attachTo: document.body
  })
  await flushPromises()
  return wrapper
}

beforeEach(() => setActivePinia(createPinia()))

afterEach(() => {
  document.body.replaceChildren()
  Reflect.deleteProperty(window, 'desk')
})

describe('KbAssetsPane write flow', () => {
  it('previews a rename then applies only the plan id', async () => {
    const { planRename, apply } = setupDesk()
    const wrapper = await mountPane()
    const used = wrapper.findAll('.file-row').find((row) => row.text().includes('used.png'))
    expect(used).toBeTruthy()
    await used!.trigger('click')
    await wrapper.get('.detail-actions .save-button').trigger('click')
    await wrapper.get('.rename-dest').setValue('assets/renamed.png')
    await wrapper.get('.kb-assets-dialog footer .save-button').trigger('click')
    await flushPromises()
    expect(planRename).toHaveBeenCalledExactlyOnceWith(
      'kb-a',
      'assets/used.png',
      'assets/renamed.png',
      1
    )
    expect(wrapper.text()).toContain('notes/0001. 图.md')
    await wrapper.get('.kb-assets-dialog footer .save-button').trigger('click')
    await flushPromises()
    expect(apply).toHaveBeenCalledExactlyOnceWith('kb-a', 'plan-1')
    wrapper.unmount()
  })

  it('shows coverage as 仍需适配来源 and does not apply a blocked plan', async () => {
    const { apply } = setupDesk({
      planRename: vi.fn(async () => ({
        ok: true,
        value: planDto({
          blockedReasons: ['该资源存在未知引用或覆盖未完成，不能重命名']
        })
      }))
    })
    const wrapper = await mountPane()
    const used = wrapper.findAll('.file-row').find((row) => row.text().includes('used.png'))
    expect(used).toBeTruthy()
    await used!.trigger('click')
    await wrapper.get('.detail-actions .save-button').trigger('click')
    await wrapper.get('.kb-assets-dialog footer .save-button').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('仍需适配来源')
    expect(
      wrapper.get('.kb-assets-dialog footer .save-button').attributes('disabled')
    ).toBeDefined()
    expect(apply).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('recycles an idle candidate via plan id and restores from history', async () => {
    const historyItems = [journalDto({ kind: 'recycle', planId: 'plan-recycle' })]
    let records: AssetJournalDto[] = []
    const { planRecycle, apply, restore, history } = setupDesk()
    history.mockImplementation(async () => ({ ok: true, value: records }))
    apply.mockImplementation(async (_knowledgeBaseId: string, planId: string) => {
      records = historyItems
      return { ok: true, value: { planId, status: 'applied', changedPaths: [] } }
    })
    const wrapper = await mountPane()
    const idle = wrapper.findAll('.file-row').find((row) => row.text().includes('idle.png'))
    expect(idle).toBeTruthy()
    await idle!.trigger('click')
    const recycleBtn = wrapper
      .findAll('.detail-actions button')
      .find((btn) => btn.text() === '移入回收区')
    expect(recycleBtn).toBeTruthy()
    await recycleBtn!.trigger('click')
    await flushPromises()
    expect(planRecycle).toHaveBeenCalledExactlyOnceWith('kb-a', ['assets/idle.png'], 1)
    await wrapper.get('.kb-assets-dialog footer .save-button').trigger('click')
    await flushPromises()
    expect(apply).toHaveBeenCalledExactlyOnceWith('kb-a', 'plan-recycle')
    await wrapper.findAll('.view-tabs button')[3].trigger('click')
    expect(wrapper.text()).toContain('回收')
    await wrapper.get('.history-row .ghost').trigger('click')
    await wrapper.get('.kb-assets-dialog footer .save-button').trigger('click')
    await flushPromises()
    expect(restore).toHaveBeenCalledExactlyOnceWith('kb-a', 'plan-recycle')
    wrapper.unmount()
  })

  it('surfaces dirty-document apply failures as 有未保存文档', async () => {
    const { apply } = setupDesk({
      apply: vi.fn(async () => ({
        ok: false,
        error: {
          code: 'INVALID_OPERATION',
          message: '「图」有未保存更改，请先保存或丢弃后再整理资源',
          details: {
            blockedReasons: [
              {
                code: 'dirty-document',
                message: '「图」有未保存更改，请先保存或丢弃后再整理资源'
              }
            ]
          }
        }
      }))
    })
    const wrapper = await mountPane()
    const used = wrapper.findAll('.file-row').find((row) => row.text().includes('used.png'))
    expect(used).toBeTruthy()
    await used!.trigger('click')
    await wrapper.get('.detail-actions .save-button').trigger('click')
    await wrapper.get('.kb-assets-dialog footer .save-button').trigger('click')
    await flushPromises()
    await wrapper.get('.kb-assets-dialog footer .save-button').trigger('click')
    await flushPromises()
    expect(apply).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('有未保存文档')
    wrapper.unmount()
  })
})
