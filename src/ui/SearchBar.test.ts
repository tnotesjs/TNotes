// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { MindmapSession, parseInlineSegments, resetNodeIdCounter } from '@tnotesjs/mindmap-core'
import SearchBar from './SearchBar.vue'

function mountSearch(markdown: string) {
  resetNodeIdCounter()
  const session = new MindmapSession({ markdown, fileName: 'search.tn-mindmap.md' })
  const version = ref(0)
  session.on('change', () => version.value++)
  session.on('matchChange', () => version.value++)
  session.on('collapseChange', () => version.value++)
  const host = document.createElement('div')
  document.body.append(host)
  const jump = vi.fn()
  const close = vi.fn()
  const app = createApp({
    setup: () => () => h(SearchBar, {
      session,
      visible: true,
      version: version.value,
      onJump: jump,
      onClose: close,
    }),
  })
  app.mount(host)
  return { session, host, jump, close }
}

async function settle() {
  await nextTick()
  await nextTick()
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('当前文档搜索结果视图', () => {
  it('格式化搜索结果进入编辑后仍显示样式，修改 label 保留链接地址', async () => {
    const { session, host } = mountSearch('# T\n\n- ~~[目标链接](https://old.example)~~\n')
    const node = session.document.root.children[0]
    const query = host.querySelector('.search-field input') as HTMLInputElement
    query.value = '目标'
    query.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()

    const editor = host.querySelector('.result-editor') as HTMLDivElement & { value: string }
    expect(editor.isContentEditable).toBe(true)
    expect(editor.querySelector('.strike')?.textContent).toBe('目标链接')
    expect(editor.querySelector('.link')?.textContent).toBe('目标链接')
    editor.focus()
    editor.value = '更新后的链接'
    editor.dispatchEvent(new Event('input', { bubbles: true }))
    editor.blur()
    await settle()

    const segment = parseInlineSegments(node.content.raw).find((item) => item.text === '更新后的链接')
    expect(segment?.marks.strike).toBe(true)
    expect(segment?.link?.url).toBe('https://old.example')
  })

  it('搜索结果无选区时 Cmd+E 格式化整个主题，Option+L 不再被拦截', async () => {
    const { session, host } = mountSearch('# T\n\n- alpha\n')
    const node = session.document.root.children[0]
    const query = host.querySelector('.search-field input') as HTMLInputElement
    query.value = 'alpha'
    query.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()

    const editor = host.querySelector('.result-editor') as HTMLDivElement & {
      value: string
      selectionStart: number
      selectionEnd: number
      setSelectionRange(start: number, end: number): void
    }
    editor.focus()
    editor.setSelectionRange(2, 2)
    const code = new KeyboardEvent('keydown', { key: 'e', metaKey: true, bubbles: true, cancelable: true })
    editor.dispatchEvent(code)
    await settle()
    expect(code.defaultPrevented).toBe(true)
    expect(node.content.raw).toBe('`alpha`')
    expect([editor.selectionStart, editor.selectionEnd]).toEqual([2, 2])

    editor.setSelectionRange(0, editor.value.length)
    const altL = new KeyboardEvent('keydown', { key: 'l', altKey: true, bubbles: true, cancelable: true })
    editor.dispatchEvent(altL)
    expect(altL.defaultPrevented).toBe(false)
    expect(node.content.raw).toBe('`alpha`')
  })

  it('搜索整份当前文档（含折叠/聚焦范围外节点），结果可直接编辑', async () => {
    const { session, host } = mountSearch(
      '# T\n\n- 当前分支\n  - 子主题\n- 其它分支\n  - [目标链接](https://old.example)\n',
    )
    const current = session.document.root.children[0]
    const other = session.document.root.children[1]
    session.setCollapsed(other.id, true)
    session.focusNode(current.id)

    const query = host.querySelector('.search-field input') as HTMLInputElement
    query.value = '目标'
    query.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()

    expect(host.querySelector('.search-count')?.textContent).toContain('1 个结果')
    expect(host.querySelector('.result-path')?.textContent).toContain('其它分支')
    const editor = host.querySelector('.result-editor') as HTMLInputElement
    expect(editor.value).toBe('目标链接')
    editor.value = '更新后的链接'
    editor.dispatchEvent(new Event('input', { bubbles: true }))
    editor.dispatchEvent(new Event('blur'))
    await settle()
    expect(other.children[0].content.raw).toBe('[更新后的链接](https://old.example)')
  })

  it('上下条定位、在当前视图显示与关闭均可操作', async () => {
    const { host, jump, close } = mountSearch('# T\n\n- alpha one\n- alpha two\n')
    const query = host.querySelector('.search-field input') as HTMLInputElement
    query.value = 'alpha'
    query.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()

    const nav = host.querySelectorAll('.search-nav button')
    ;(nav[1] as HTMLButtonElement).click()
    expect(jump).toHaveBeenCalledTimes(1)
    ;(host.querySelector('.reveal-button') as HTMLButtonElement).click()
    expect(jump).toHaveBeenCalledTimes(2)
    ;(host.querySelector('.search-close') as HTMLButtonElement).click()
    expect(close).toHaveBeenCalledOnce()
  })

  it('替换当前结果保留未命中文案、格式和链接地址', async () => {
    const { session, host } = mountSearch('# T\n\n- ~~[目标链接](https://old.example)~~\n- 另一个目标\n')
    const query = host.querySelector('[aria-label="查找"]') as HTMLInputElement
    const replacement = host.querySelector('[aria-label="替换为"]') as HTMLInputElement
    query.value = '目标'
    query.dispatchEvent(new Event('input', { bubbles: true }))
    replacement.value = '更新'
    replacement.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()

    const replaceButton = [...host.querySelectorAll<HTMLButtonElement>('.replace-button')]
      .find((button) => button.textContent === '替换')!
    replaceButton.click()
    await settle()

    const segment = parseInlineSegments(session.document.root.children[0].content.raw)
      .find((item) => item.text === '更新链接')
    expect(segment?.marks.strike).toBe(true)
    expect(segment?.link?.url).toBe('https://old.example')
    expect(session.document.root.children[1].content.text).toBe('另一个目标')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('已替换 1 处')
  })

  it('全部替换覆盖同一主题内的所有命中，并合并为一次可撤销修改', async () => {
    const source = '# T\n\n- **alpha alpha**\n- [alpha](https://old.example)\n- alpha\n'
    const { session, host } = mountSearch(source)
    const query = host.querySelector('[aria-label="查找"]') as HTMLInputElement
    const replacement = host.querySelector('[aria-label="替换为"]') as HTMLInputElement
    query.value = 'ALPHA'
    query.dispatchEvent(new Event('input', { bubbles: true }))
    replacement.value = 'beta'
    replacement.dispatchEvent(new Event('input', { bubbles: true }))
    await settle()

    const replaceAllButton = [...host.querySelectorAll<HTMLButtonElement>('.replace-button')]
      .find((button) => button.textContent === '全部替换')!
    replaceAllButton.click()
    await settle()

    expect(session.getMarkdown()).toContain('- **beta beta**')
    expect(session.getMarkdown()).toContain('- [beta](https://old.example)')
    expect(session.getMarkdown()).not.toContain('alpha')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('已替换 4 处')
    session.undo()
    expect(session.getMarkdown()).toBe(source)
    expect(session.canUndo).toBe(false)
  })

  it('在替换输入框按 Enter 只替换当前主题', async () => {
    const { session, host } = mountSearch('# T\n\n- first target\n- second target\n')
    const query = host.querySelector('[aria-label="查找"]') as HTMLInputElement
    const replacement = host.querySelector('[aria-label="替换为"]') as HTMLInputElement
    query.value = 'target'
    query.dispatchEvent(new Event('input', { bubbles: true }))
    replacement.value = 'done'
    replacement.dispatchEvent(new Event('input', { bubbles: true }))
    replacement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()

    expect(session.document.root.children.map((node) => node.content.text)).toEqual(['first done', 'second target'])
  })
})
