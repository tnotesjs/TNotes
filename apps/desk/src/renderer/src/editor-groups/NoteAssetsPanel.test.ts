// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useWorkspaceStore } from '../stores/workspace'
import NoteAssetsPanel from './NoteAssetsPanel.vue'

import type {
  AssetOperationPlanDto,
  DeskResult,
  KbFileEntryDto,
  KbFilesListResultDto
} from '../../../shared/contracts'

const KB = 'kb-a'
const NOTE_UUID = 'uuid-0007'
const NOTE = 'notes/0007. 笔记.md'

interface PanelProps {
  knowledgeBaseId: string
  noteUuid: string
  noteRelPath: string
  noteIndex: string
  source: string
  readOnly: boolean
}

const baseProps: PanelProps = {
  knowledgeBaseId: KB,
  noteUuid: NOTE_UUID,
  noteRelPath: NOTE,
  noteIndex: '0007',
  source: '',
  readOnly: false
}

function fileEntry(relPath: string, bytes = 2048): KbFileEntryDto {
  return {
    name: relPath.split('/').pop() ?? relPath,
    relPath,
    kind: 'file',
    bytes,
    textLike: false
  }
}

function planDto(
  kind: 'rename' | 'recycle',
  overrides: Partial<AssetOperationPlanDto> = {}
): AssetOperationPlanDto {
  return {
    id: `plan-${kind}`,
    kind,
    generation: 1,
    coverageComplete: true,
    blockedReasons: [],
    estimated: { filesTouched: 1, bytesMoved: 2048 },
    moves: [],
    sourceRelPaths: [],
    ...overrides
  }
}

let listing: KbFileEntryDto[] = []
let listOverride: DeskResult<KbFilesListResultDto> | null = null
let list: ReturnType<typeof vi.fn>
let planRename: ReturnType<typeof vi.fn>
let planRecycle: ReturnType<typeof vi.fn>
let apply: ReturnType<typeof vi.fn>
let notesSave: ReturnType<typeof vi.fn>

/** 只等微任务：面板的取列表 / 计划 / 应用全是 promise 链，没有需要真正计时的等待。 */
async function flushMicrotasks(): Promise<void> {
  for (let index = 0; index < 8; index += 1) await Promise.resolve()
  await nextTick()
}

async function mountPanel(
  overrides: Partial<PanelProps> = {}
): Promise<{ wrapper: ReturnType<typeof mount>; saveDocument: ReturnType<typeof vi.spyOn> }> {
  const workspace = useWorkspaceStore()
  const saveDocument = vi.spyOn(workspace, 'saveDocument').mockResolvedValue(undefined)
  const wrapper = mount(NoteAssetsPanel, {
    props: { ...baseProps, ...overrides },
    attachTo: document.body
  })
  await flushMicrotasks()
  return { wrapper, saveDocument }
}

beforeEach(() => {
  setActivePinia(createPinia())
  listing = []
  listOverride = null
  list = vi.fn(
    async () => listOverride ?? { ok: true, value: { relPath: 'assets', entries: listing } }
  )
  planRename = vi.fn(async () => ({ ok: true, value: planDto('rename') }))
  planRecycle = vi.fn(async () => ({ ok: true, value: planDto('recycle') }))
  apply = vi.fn(async () => ({
    ok: true,
    value: { planId: 'plan-rename', status: 'applied', changedPaths: [] }
  }))
  notesSave = vi.fn()
  Object.defineProperty(window, 'desk', {
    configurable: true,
    value: {
      kbFiles: { list, read: vi.fn() },
      assets: { planRename, planRecycle, apply },
      notes: { save: notesSave }
    }
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  Reflect.deleteProperty(window, 'desk')
  document.body.replaceChildren()
})

describe('NoteAssetsPanel 分区与只读', () => {
  it('列出引用的资源、编号匹配的资源与引用缺失，并给出各自的行内操作', async () => {
    listing = [
      fileEntry('assets/0007-a.png'),
      fileEntry('assets/0007-b.png', 512),
      fileEntry('assets/0001-old.png')
    ]
    const source = [
      '![图](../assets/0007-a.png)',
      '![旧](../assets/0001-old.png)',
      '![缺](../assets/0007-gone.png)'
    ].join('\n')
    const { wrapper } = await mountPanel({ source })

    // 引用的资源：磁盘上存在的两处；缺失的那处不进这一区，避免与警告区重复
    const referenced = wrapper.get('[data-note-assets-section="referenced"]')
    expect(referenced.findAll('[data-note-assets-row]').map((row) => row.text())).toEqual([
      expect.stringContaining('0001-old.png'),
      expect.stringContaining('0007-a.png')
    ])
    const aRow = wrapper.get('[data-note-assets-row="assets/0007-a.png"]')
    expect(aRow.text()).toContain('2 KB')
    expect(aRow.text()).toContain('引用 1 次')
    expect(aRow.find('.row-insert').exists()).toBe(true)
    expect(aRow.find('.row-locate').exists()).toBe(true)

    // 被引用但编号不匹配 → 修复按钮，title 说明改成什么名字
    const fix = wrapper.get('[data-note-assets-row="assets/0001-old.png"] .row-fix')
    expect(fix.attributes('disabled')).toBeUndefined()
    expect(fix.attributes('title')).toContain('0007-old.png')

    // 编号匹配但没有被引用 → 无效资源，给删除按钮
    const ownRow = wrapper.get(
      '[data-note-assets-section="own"] [data-note-assets-row="assets/0007-b.png"]'
    )
    expect(ownRow.text()).toContain('未被引用')
    expect(ownRow.find('.row-delete').exists()).toBe(true)
    // 编号匹配且被引用的资源不是无效资源，没有删除按钮
    expect(
      wrapper
        .get('[data-note-assets-section="own"] [data-note-assets-row="assets/0007-a.png"]')
        .find('.row-delete')
        .exists()
    ).toBe(false)

    // 引用缺失：警告分区，给出正文行号
    const missing = wrapper.get('[data-note-assets-section="missing"]')
    expect(missing.text()).toContain('磁盘上没有')
    expect(missing.get('[data-note-assets-row="assets/0007-gone.png"]').text()).toContain(
      '正文第 3 行'
    )
    expect(missing.find('.row-insert').exists()).toBe(false)
    expect(missing.find('.row-delete').exists()).toBe(false)
  })

  it('没有任何资源时给出引导式空状态', async () => {
    const { wrapper } = await mountPanel()
    expect(wrapper.get('[data-note-assets-empty]').text()).toContain('这篇笔记还没有资源')
    expect(wrapper.find('[data-note-assets-section="own"]').exists()).toBe(false)
  })

  it('取列表失败时显示原因，而不是静默的空列表', async () => {
    listOverride = { ok: false, error: { code: 'ENOENT', message: 'assets 目录读不了' } }
    const { wrapper } = await mountPanel()
    expect(wrapper.get('[data-note-assets-error]').text()).toContain('assets 目录读不了')
    expect(wrapper.find('[data-note-assets-empty]').exists()).toBe(false)
  })

  it('只读文档禁用插入 / 修复 / 删除并给出 title，复制与定位仍可用', async () => {
    listing = [
      fileEntry('assets/0007-a.png'),
      fileEntry('assets/0001-old.png'),
      fileEntry('assets/0007-b.png')
    ]
    const source = ['![图](../assets/0007-a.png)', '![旧](../assets/0001-old.png)'].join('\n')
    const { wrapper } = await mountPanel({ source, readOnly: true })

    const insert = wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-insert')
    expect(insert.attributes('disabled')).toBeDefined()
    expect(insert.attributes('title')).toBe('文档只读：不能插入资源')

    const fix = wrapper.get('[data-note-assets-row="assets/0001-old.png"] .row-fix')
    expect(fix.attributes('disabled')).toBeDefined()
    expect(fix.attributes('title')).toBe('文档只读：不能修复编号')

    const remove = wrapper.get('[data-note-assets-section="own"] .row-delete')
    expect(remove.attributes('disabled')).toBeDefined()
    expect(remove.attributes('title')).toBe('文档只读：不能删除资源')

    expect(
      wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-copy').attributes('disabled')
    ).toBeUndefined()
    expect(
      wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-locate').attributes('disabled')
    ).toBeUndefined()
  })
})

describe('NoteAssetsPanel 复制、定位与插入', () => {
  it('复制的是相对笔记文件的路径，并就地提示 1.2 秒后复位', async () => {
    listing = [fileEntry('assets/0007-a.png')]
    const { wrapper } = await mountPanel({ source: '![图](../assets/0007-a.png)' })
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })

    const copy = wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-copy')
    vi.useFakeTimers()
    try {
      await copy.trigger('click')
      await flushMicrotasks()
      expect(writeText).toHaveBeenCalledWith('../assets/0007-a.png')
      expect(copy.text()).toBe('已复制')

      vi.advanceTimersByTime(1300)
      await flushMicrotasks()
      expect(copy.text()).toBe('复制路径')
    } finally {
      vi.useRealTimers()
    }
  })

  it('剪贴板不可用时给出错误提示，不假装已复制', async () => {
    listing = [fileEntry('assets/0007-a.png')]
    const { wrapper } = await mountPanel({ source: '![图](../assets/0007-a.png)' })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn(async () => {
          throw new Error('denied')
        })
      }
    })
    await wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-copy').trigger('click')
    await flushMicrotasks()
    expect(wrapper.get('[data-note-assets-action-error]').text()).toContain('复制失败')
    expect(wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-copy').text()).toBe(
      '复制路径'
    )
  })

  it('定位与插入只发事件，由父容器落地', async () => {
    listing = [fileEntry('assets/0007-a.png')]
    const { wrapper } = await mountPanel({ source: '![图](../assets/0007-a.png)' })

    await wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-locate').trigger('click')
    await wrapper.get('[data-note-assets-row="assets/0007-a.png"] .row-insert').trigger('click')
    await wrapper.get('[data-note-assets-close]').trigger('click')

    expect(wrapper.emitted('locate')).toEqual([['../assets/0007-a.png']])
    expect(wrapper.emitted('insert')).toEqual([['assets/0007-a.png']])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('点击缩略图在面板内行内放大，再点一次收起，且不注入 HTML', async () => {
    listing = [fileEntry('assets/0007-a.png')]
    const { wrapper } = await mountPanel({ source: '![图](../assets/0007-a.png)' })

    const row = wrapper.get('[data-note-assets-row="assets/0007-a.png"]')
    const thumb = row.get('.thumb-button')
    expect(thumb.attributes('aria-expanded')).toBe('false')
    expect(thumb.get('img').attributes('src')).toContain('path=..%2Fassets%2F0007-a.png')

    await thumb.trigger('click')
    expect(row.find('.zoom-frame').exists()).toBe(true)
    expect(row.get('.zoom-frame img').attributes('src')).toContain('assets%2F0007-a.png')
    expect(thumb.attributes('aria-expanded')).toBe('true')

    await row.get('.zoom-frame').trigger('click')
    expect(row.find('.zoom-frame').exists()).toBe(false)
  })

  it('非图片显示类型图标而不是缩略图', async () => {
    listing = [fileEntry('assets/0007-a.pdf')]
    const { wrapper } = await mountPanel({ source: '[下载](../assets/0007-a.pdf)' })
    const row = wrapper.get('[data-note-assets-row="assets/0007-a.pdf"]')
    expect(row.get('.thumb-badge').text()).toBe('PDF')
    expect(row.find('.thumb-button').exists()).toBe(false)
    expect(row.find('.row-insert').exists()).toBe(false)
  })
})

describe('NoteAssetsPanel 修复编号与删除', () => {
  it('修复编号先保存笔记，再按笔记编号重命名并重新取列表，不改笔记源文', async () => {
    listing = [fileEntry('assets/0001-old.png')]
    const { wrapper, saveDocument } = await mountPanel({ source: '![旧](../assets/0001-old.png)' })

    await wrapper.get('[data-note-assets-row="assets/0001-old.png"] .row-fix').trigger('click')
    await flushMicrotasks()

    expect(saveDocument).toHaveBeenCalledWith('kb-a:uuid-0007')
    expect(planRename).toHaveBeenCalledWith(KB, 'assets/0001-old.png', 'assets/0007-old.png')
    expect(apply).toHaveBeenCalledWith(KB, 'plan-rename')
    expect(list).toHaveBeenCalledTimes(2)
    // 引用改写由主进程计划完成：面板不能自己去写笔记
    expect(notesSave).not.toHaveBeenCalled()
    expect(saveDocument.mock.invocationCallOrder[0]).toBeLessThan(
      planRename.mock.invocationCallOrder[0]!
    )
  })

  it('删除是两步行内确认：先取消不发计划，确认后才回收并重新取列表', async () => {
    listing = [fileEntry('assets/0007-b.png')]
    const { wrapper, saveDocument } = await mountPanel()
    const row = wrapper.get('[data-note-assets-row="assets/0007-b.png"]')

    await row.get('.row-delete').trigger('click')
    expect(row.find('.row-confirm').exists()).toBe(true)
    expect(planRecycle).not.toHaveBeenCalled()

    await row.get('.row-cancel').trigger('click')
    expect(row.find('.row-confirm').exists()).toBe(false)

    await row.get('.row-delete').trigger('click')
    await row.get('.row-confirm').trigger('click')
    await flushMicrotasks()

    expect(saveDocument).toHaveBeenCalledWith('kb-a:uuid-0007')
    // targeted：逐个确认的定向删除，主进程据此放开「画布真相源受保护」这一条
    expect(planRecycle).toHaveBeenCalledWith(KB, ['assets/0007-b.png'], undefined, {
      targeted: true
    })
    expect(apply).toHaveBeenCalledWith(KB, 'plan-recycle')
    expect(list).toHaveBeenCalledTimes(2)
  })

  it('删无效画布时两半一起交给主进程（`.svg` + 同名 `.excalidraw`）', async () => {
    listing = [fileEntry('assets/0007-pair.svg'), fileEntry('assets/0007-pair.excalidraw')]
    const { wrapper } = await mountPanel()
    const row = wrapper.get('[data-note-assets-row="assets/0007-pair.svg"]')

    await row.get('.row-delete').trigger('click')
    await row.get('.row-confirm').trigger('click')
    await flushMicrotasks()

    expect(planRecycle).toHaveBeenCalledWith(
      KB,
      ['assets/0007-pair.svg', 'assets/0007-pair.excalidraw'],
      undefined,
      { targeted: true }
    )
  })

  it('计划被门禁阻止时把 blockedReasons 显示在面板内，且不执行', async () => {
    listing = [fileEntry('assets/0007-b.png')]
    planRecycle.mockResolvedValueOnce({
      ok: true,
      value: planDto('recycle', { blockedReasons: ['笔记有未保存内容', '有画布未写完'] })
    })
    const { wrapper } = await mountPanel()
    const row = wrapper.get('[data-note-assets-row="assets/0007-b.png"]')

    await row.get('.row-delete').trigger('click')
    await row.get('.row-confirm').trigger('click')
    await flushMicrotasks()

    const message = wrapper.get('[data-note-assets-action-error]').text()
    expect(message).toContain('笔记有未保存内容')
    expect(message).toContain('有画布未写完')
    expect(apply).not.toHaveBeenCalled()
  })

  it('应用失败时显示 error.message，操作期间禁用按钮并提示忙碌', async () => {
    listing = [fileEntry('assets/0007-b.png')]
    let release: () => void = () => undefined
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    planRecycle.mockImplementationOnce(async () => {
      await gate
      return { ok: true, value: planDto('recycle') }
    })
    apply.mockResolvedValueOnce({
      ok: false,
      error: { code: 'GATE', message: '写门禁暂停了整理' }
    })
    const { wrapper } = await mountPanel()
    const row = wrapper.get('[data-note-assets-row="assets/0007-b.png"]')

    await row.get('.row-delete').trigger('click')
    await row.get('.row-confirm').trigger('click')
    await flushMicrotasks()

    expect(wrapper.find('[data-note-assets-busy]').exists()).toBe(true)
    expect(wrapper.get('[data-note-assets-refresh]').attributes('disabled')).toBeDefined()
    expect(row.get('.row-copy').attributes('disabled')).toBeDefined()
    expect(planRecycle).toHaveBeenCalledTimes(1)

    release()
    await flushMicrotasks()

    expect(wrapper.find('[data-note-assets-busy]').exists()).toBe(false)
    expect(wrapper.get('[data-note-assets-action-error]').text()).toContain('写门禁暂停了整理')
  })
})

describe('NoteAssetsPanel 刷新', () => {
  it('点刷新重新取一次列表', async () => {
    listing = [fileEntry('assets/0007-a.png')]
    const { wrapper } = await mountPanel()
    await wrapper.get('[data-note-assets-refresh]').trigger('click')
    await flushPromises()
    expect(list).toHaveBeenCalledTimes(2)
    expect(list).toHaveBeenLastCalledWith({ knowledgeBaseId: KB, relPath: 'assets' })
  })
})
