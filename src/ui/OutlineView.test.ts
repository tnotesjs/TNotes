// @vitest-environment happy-dom
/**
 * 大纲视图编辑交互的组件级测试（对齐幕布行为）。
 * 覆盖 Enter 的四种光标场景 / Backspace 合并 / Tab 升降级 / 多行粘贴。
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { MindmapSession, resetNodeIdCounter } from '../engine'
import OutlineView from './OutlineView.vue'

const MD = '# T\n\n- a\n  - a1\n  - a2\n- b\n'

function mountOutline(markdown = MD) {
  resetNodeIdCounter()
  const session = new MindmapSession({ markdown, fileName: 't.tn-mindmap.md' })
  const version = ref(0)
  session.on('change', () => version.value++)
  session.on('selectionChange', () => version.value++)
  session.on('collapseChange', () => version.value++)
  session.on('focusChange', () => version.value++)

  const host = document.createElement('div')
  document.body.appendChild(host)
  const app = createApp({
    setup: () => () => h(OutlineView, { session, version: version.value }),
  })
  app.mount(host)
  return { session, host, app }
}

function inputOf(host: HTMLElement, id: string): HTMLInputElement | null {
  return host.querySelector(`input.row-input[data-id="${id}"]`)
}

function keydown(input: HTMLInputElement, key: string, opts: KeyboardEventInit = {}) {
  input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts }))
}

async function settle() {
  await nextTick()
  await nextTick()
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('大纲 Enter 行为（幕布对齐）', () => {
  it('光标在行尾：下方插入同级空行，光标移入新行', async () => {
    const { session, host } = mountOutline()
    const a = session.document.root.children[0]
    const input = inputOf(host, a.id)!
    input.focus()
    input.setSelectionRange(1, 1) // 'a' 行尾
    keydown(input, 'Enter')
    await settle()

    const md = session.getMarkdown()
    expect(md).toContain('- a\n  - a1\n  - a2\n- \n- b\n')

    // 光标移到新行（空行，位于 a 与 b 之间）
    const active = document.activeElement as HTMLInputElement
    expect(active?.classList.contains('row-input')).toBe(true)
    expect(active?.value).toBe('')
    expect(active?.dataset.id).not.toBe(a.id)
  })

  it('光标在行中：分裂节点，前半留当前行，后半进新行，光标在新行行首', async () => {
    const { session, host } = mountOutline()
    const a1 = session.document.root.children[0].children[0]
    // 先把 a1 改成 hello 并提交
    session.updateNodeRaw(a1.id, 'hello')
    await settle()

    const input = inputOf(host, a1.id)!
    input.focus()
    expect(input.value).toBe('hello')
    input.setSelectionRange(2, 2) // he|llo
    keydown(input, 'Enter')
    await settle()

    const md = session.getMarkdown()
    expect(md).toContain('  - he\n  - llo\n')

    const active = document.activeElement as HTMLInputElement
    expect(active?.value).toBe('llo')
    expect(active?.selectionStart).toBe(0)
    expect(active?.dataset.id).not.toBe(a1.id)
  })

  it('光标在行首：上方插入空行，光标在上面的空行', async () => {
    const { session, host } = mountOutline()
    const a1 = session.document.root.children[0].children[0]
    const input = inputOf(host, a1.id)!
    input.focus()
    input.setSelectionRange(0, 0)
    keydown(input, 'Enter')
    await settle()

    expect(session.getMarkdown()).toContain('  - \n  - a1\n')

    const active = document.activeElement as HTMLInputElement
    expect(active?.value).toBe('')
    expect(active?.dataset.id).not.toBe(a1.id)
  })

  it('有展开子节点的父行行尾 Enter：下方插入同级空行', async () => {
    const { session, host } = mountOutline()
    const a = session.document.root.children[0]
    const input = inputOf(host, a.id)!
    input.focus()
    input.setSelectionRange(1, 1)
    keydown(input, 'Enter')
    await settle()

    // a 的子节点保持 a1/a2，新空行是 a 的同级
    const md = session.getMarkdown()
    expect(md).toContain('- a\n  - a1\n  - a2\n- \n- b\n')
  })

  it('新建空行未输入即提交（blur）会被移除', async () => {
    const { session, host } = mountOutline()
    const a = session.document.root.children[0]
    const input = inputOf(host, a.id)!
    input.focus()
    input.setSelectionRange(1, 1)
    keydown(input, 'Enter')
    await settle()
    // 不输入，直接 Esc
    const active = document.activeElement as HTMLInputElement
    keydown(active, 'Escape')
    await settle()
    expect(session.getMarkdown()).toBe(MD)
  })
})

describe('大纲 Backspace / Tab 行为', () => {
  it('行首 Backspace：合并到视觉上一行，光标在拼接点', async () => {
    const { session, host } = mountOutline()
    const a2 = session.document.root.children[0].children[1]
    const input = inputOf(host, a2.id)!
    input.focus()
    input.setSelectionRange(0, 0)
    keydown(input, 'Backspace')
    await settle()

    expect(session.getMarkdown()).toContain('  - a1a2\n')
    const active = document.activeElement as HTMLInputElement
    expect(active?.value).toBe('a1a2')
    expect(active?.selectionStart).toBe(2)
  })

  it('空行行首 Backspace：删除本行并聚焦上一行末尾', async () => {
    const { session, host } = mountOutline('# T\n\n- a\n- \n- b\n')
    const empty = session.document.root.children[1]
    const input = inputOf(host, empty.id)!
    input.focus()
    input.setSelectionRange(0, 0)
    keydown(input, 'Backspace')
    await settle()

    expect(session.getMarkdown()).toBe('# T\n\n- a\n- b\n')
    const active = document.activeElement as HTMLInputElement
    expect(active?.value).toBe('a')
    expect(active?.selectionStart).toBe(1)
  })

  it('编辑态 Tab 降级并保持编辑焦点', async () => {
    const { session, host } = mountOutline()
    const b = session.document.root.children[1]
    const input = inputOf(host, b.id)!
    input.focus()
    input.setSelectionRange(1, 1)
    keydown(input, 'Tab')
    await settle()

    expect(session.getMarkdown()).toContain('- a\n  - a1\n  - a2\n  - b\n')
    const active = document.activeElement as HTMLInputElement
    expect(active?.dataset.id).toBe(b.id)
  })
})

describe('大纲粘贴 / 复制', () => {
  it('多行粘贴按缩进解析为子树插入当前行之后', async () => {
    const { session, host } = mountOutline()
    const a = session.document.root.children[0]
    const input = inputOf(host, a.id)!
    input.focus()

    const clipboardData = {
      getData: () => '- x\n  - x1\n- y',
    } as unknown as ClipboardEvent['clipboardData']
    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', { value: clipboardData })
    input.dispatchEvent(event)
    await settle()

    expect(session.getMarkdown()).toContain('- a\n  - a1\n  - a2\n- x\n  - x1\n- y\n- b\n')
  })

  it('无选中文本时 Cmd+C 复制整棵子树为 markdown 列表', async () => {
    const { session, host } = mountOutline()
    const a = session.document.root.children[0]
    const input = inputOf(host, a.id)!
    input.focus()
    input.setSelectionRange(0, 0) // 无选区

    let copied = ''
    const event = new Event('copy', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', {
      value: { setData: (_t: string, data: string) => (copied = data) },
    })
    input.dispatchEvent(event)
    await settle()

    expect(copied).toBe('- a\n  - a1\n  - a2')
  })
})
