// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorStateCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { NodeSelection, TextSelection } from '@milkdown/kit/prose/state'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'
import { getMarkdown } from '@milkdown/kit/utils'

import {
  calloutBodyExitPosition,
  calloutFenceForInner,
  serializeCalloutMarkdown,
  wrapProjectedCalloutBody
} from './deskCallout'
import { projectRawBlocksForMilkdown, rawBlockProjectionPlugins } from './rawBlockProjection'
import { reconcileMarkdownSource } from './sourcePreservation'
import { createDeskCalloutView, deskCalloutKeymapPlugin } from '../../markdown/deskCalloutView'
import { createRawBlockSelectionPlugin } from '../../markdown/rawBlockInteractions'

const editors: Editor[] = []

afterEach(async () => {
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function createEditor(source: string): Promise<Editor> {
  const root = document.createElement('div')
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, projectRawBlocksForMilkdown(source))
    })
    .use(commonmark)
    .use(gfm)
    .use(rawBlockProjectionPlugins)
  editors.push(editor)
  await editor.create()
  return editor
}

describe('callout fence serialization', () => {
  it('keeps three colons when the body has no container fences', () => {
    expect(calloutFenceForInner(':::', 'hello\n\n```js\n:::\n```')).toBe(':::')
    expect(
      serializeCalloutMarkdown({
        calloutType: 'tip',
        title: '提示',
        openColons: ':::',
        inner: 'body'
      })
    ).toBe('::: tip 提示\n\nbody\n\n:::')
  })

  it('bumps the outer fence when the body contains a ::: container', () => {
    const inner = '::: code-group\n\n```js [a]\nx\n```\n\n:::'
    expect(calloutFenceForInner(':::', inner)).toBe('::::')
    expect(
      serializeCalloutMarkdown({
        calloutType: 'tip',
        title: 'A',
        openColons: ':::',
        inner
      })
    ).toContain(':::: tip A')
  })
})

describe('visual callout projection', () => {
  it('projects a titled tip around inner fences instead of an opaque raw container', () => {
    const source = ['::: tip Title', '', '```js', 'const x = 1', '```', '', ':::', ''].join('\n')
    const projected = projectRawBlocksForMilkdown(source)
    expect(projected).toContain('<!--desk-callout:v1:tip:')
    expect(projected).toContain('<!--/desk-callout:v1-->')
    expect(projected).not.toContain('<!--desk-raw-block:v1:raw-container')
    expect(projected).toContain('```js\nconst x = 1\n```')
  })

  it('keeps nested code-group atoms inside a longer-colon tip', () => {
    const source = [
      ':::: tip Nested',
      '',
      '::: code-group',
      '',
      '```js [a]',
      'const x = 1',
      '```',
      '',
      ':::',
      '',
      '::::',
      ''
    ].join('\n')
    const projected = projectRawBlocksForMilkdown(source)
    expect(projected).toContain('<!--desk-callout:v1:tip:')
    expect(projected).toContain('<!--desk-raw-block:v1:raw-container')
    expect(
      wrapProjectedCalloutBody({ calloutType: 'tip', title: 'Nested', openColons: '::::' }, 'inner')
    ).toContain('<!--desk-callout:v1:tip:')
  })
})

describe('visual callout editor round-trip', () => {
  it('parses a tip as deskCallout with an inner code_block', async () => {
    const source = ['::: tip Title', '', '```js', 'const x = 1', '```', '', ':::', ''].join('\n')
    const editor = await createEditor(source)
    editor.action((ctx) => {
      const doc = ctx.get(editorStateCtx).doc
      const types: string[] = []
      doc.descendants((node) => {
        types.push(node.type.name)
      })
      expect(types).toContain('deskCallout')
      expect(types).toContain('code_block')
      expect(types).not.toContain('deskRawBlock')
    })
    const markdown = editor.action(getMarkdown())
    expect(markdown).not.toContain('desk-callout')
    expect(markdown).toContain('::: tip Title')
    expect(markdown).toContain('```js')
    expect(markdown).toContain('const x = 1')
  })

  it('preserves original bytes until the callout itself changes', async () => {
    const source = 'before\r\n\r\n::: tip 💡 TIP\r\n\r\nkeep me  \r\n\r\n:::\r\n\r\nafter\r\n'
    const editor = await createEditor(source)
    const baseline = editor.action(getMarkdown())
    expect(reconcileMarkdownSource(source, baseline, baseline)).toBe(source)

    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.state.doc.descendants((node, pos) => {
        if (node.type.name !== 'deskCallout') return
        view.dispatch(
          view.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            title: 'Edited'
          })
        )
      })
    })
    const current = editor.action(getMarkdown())
    const reconciled = reconcileMarkdownSource(source, baseline, current)
    expect(reconciled).toContain('::: tip Edited')
    expect(reconciled).toContain('keep me')
    expect(reconciled).toContain('before')
    expect(reconciled).toContain('after')
    expect(reconciled).not.toBe(source)
  })

  it('serializes a nested code-group with a longer outer fence', async () => {
    const source = [
      ':::: tip Nested',
      '',
      '::: code-group',
      '',
      '```js [a]',
      'const x = 1',
      '```',
      '',
      ':::',
      '',
      '::::',
      ''
    ].join('\n')
    const editor = await createEditor(source)
    editor.action((ctx) => {
      const types = new Set<string>()
      ctx.get(editorStateCtx).doc.descendants((node) => {
        types.add(node.type.name)
      })
      expect(types.has('deskCallout')).toBe(true)
      expect(types.has('deskRawBlock')).toBe(true)
    })
    const markdown = editor.action(getMarkdown())
    expect(markdown.startsWith(':::: tip Nested')).toBe(true)
    expect(markdown).toContain('::: code-group')
  })
})

describe('callout title keyboard from body', () => {
  async function createNavEditor(source: string): Promise<Editor> {
    const root = document.createElement('div')
    document.body.append(root)
    const editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, projectRawBlocksForMilkdown(source))
      })
      .use(commonmark)
      .use(gfm)
      .use(rawBlockProjectionPlugins)
      .use(createDeskCalloutView())
      .use(deskCalloutKeymapPlugin)
      .use(createRawBlockSelectionPlugin())
    editors.push(editor)
    await editor.create()
    return editor
  }

  it('callout body 末尾的 ↓/→ 给出 callout 之后的位置（不会被 gapcursor 抢走跳到文档开头）', async () => {
    const editor = await createNavEditor(
      [
        '## 提示块',
        '',
        '::: tip 💡 TIP',
        '',
        '第一段。',
        '',
        '第二段。',
        '',
        ':::',
        '',
        '提示块区结束段落',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const state = ctx.get(editorStateCtx)
      let calloutPos = -1
      let calloutEnd = -1
      const paragraphs: number[] = []
      state.doc.descendants((node, pos) => {
        if (node.type.name !== 'deskCallout') return true
        calloutPos = pos
        calloutEnd = pos + node.nodeSize
        node.descendants((child, childPos) => {
          if (child.type.name === 'paragraph') {
            paragraphs.push(pos + 1 + childPos + 1 + child.content.size)
          }
          return true
        })
        return false
      })
      expect(calloutPos).toBeGreaterThan(-1)
      expect(paragraphs).toHaveLength(2)
      // 第一段末尾：callout 里后面还有内容，不该往下走
      expect(calloutBodyExitPosition(state.doc.resolve(paragraphs[0]!), 'down')).toBeNull()
      // 最后一段末尾：给 callout 之后的位置（两种方向都算到底）
      expect(calloutBodyExitPosition(state.doc.resolve(paragraphs[1]!), 'down')).toBe(calloutEnd)
      expect(calloutBodyExitPosition(state.doc.resolve(paragraphs[1]!), 'right')).toBe(calloutEnd)
      // 同一段中间：只有 → 要求到行尾，↓ 在最后一行任意位置都可以离开
      expect(calloutBodyExitPosition(state.doc.resolve(paragraphs[1]! - 2), 'right')).toBeNull()
      // 光标不在 callout 里
      expect(calloutBodyExitPosition(state.doc.resolve(1), 'down')).toBeNull()
    })
  })

  it('连着多个 callout 时，非第一个 callout 的 body ↑ 也能进自己的标题', async () => {
    // 回归：isCaretEnteringCalloutTitle 原来用 index(depth-1) 判断「是不是第一个子节点」，
    // 把 callout 自己在文档里的下标也算进去了 —— 只要 callout 不是文档第一块就恒 false，
    // ↑ 于是落到 PM gapcursor / virtual-cursor 手里把光标带到文档开头。
    const editor = await createNavEditor(
      [
        '## 提示块',
        '',
        '::: tip 💡 TIP',
        '',
        '提示块正文。',
        '',
        ':::',
        '',
        '::: warning ⚠️ WARNING',
        '',
        '警告块正文。',
        '',
        ':::',
        '',
        '::: danger ❌ ERROR',
        '',
        '错误块正文。',
        '',
        ':::',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const callouts: Array<{ pos: number; bodyEnd: number; title: string }> = []
      view.state.doc.descendants((node, position) => {
        if (node.type.name !== 'deskCallout') return true
        const title = String((node.attrs as { title?: string }).title ?? '')
        let bodyEnd = position + 1
        node.descendants((child, childPos) => {
          if (child.type.name === 'paragraph') {
            bodyEnd = position + 1 + childPos + 1 + child.content.size
          }
          return true
        })
        callouts.push({ pos: position, bodyEnd, title })
        return false
      })
      expect(callouts).toHaveLength(3)
      // 第三个 callout（ERROR）的 body 末尾按 ↑：必须聚焦它自己的标题，而不是跳走
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, callouts[2]!.bodyEnd))
      )
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
      )
      const titles = [...view.dom.querySelectorAll('.desk-callout__title')]
      expect(titles).toHaveLength(3)
      expect(document.activeElement).toBe(titles[2])
      expect((titles[2] as HTMLInputElement).value).toContain('ERROR')
      // 从标题再按 ↑：回到上一个 callout 的 body（不越过前面的块）
      ;(document.activeElement as HTMLInputElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
      )
      expect(view.state.selection.from).toBeGreaterThan(callouts[1]!.pos)
      expect(view.state.selection.from).toBeLessThanOrEqual(callouts[1]!.bodyEnd)
    })
  })

  it('ArrowUp from mid first body line focuses the title without selecting the previous fence', async () => {
    const editor = await createNavEditor(
      [
        '```js',
        'const x = 1',
        '```',
        '',
        '::: tip 提示题',
        '',
        '这是 PowerShell 的经典坑',
        '',
        ':::',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let bodyMid = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'paragraph' && node.textContent.includes('经典坑')) {
          bodyMid = position + 1 + 8
        }
      })
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, bodyMid)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
      )
      const title = view.dom.querySelector('.desk-callout__title')
      expect(title).toBeInstanceOf(HTMLInputElement)
      expect(document.activeElement).toBe(title)
      expect(view.dom.querySelector('.desk-code-block--whole-selected')).toBeNull()
      expect((title as HTMLInputElement).selectionStart).toBe(
        Math.min(8, (title as HTMLInputElement).value.length)
      )
    })
  })

  it('ArrowUp from the title whole-selects the previous code fence', async () => {
    const editor = await createNavEditor(
      [
        '```js',
        'const x = 1',
        '```',
        '',
        '::: tip 提示题',
        '',
        '这是 PowerShell 的经典坑',
        '',
        ':::',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const title = view.dom.querySelector('.desk-callout__title')
      expect(title).toBeInstanceOf(HTMLInputElement)
      const titleEl = title as HTMLInputElement
      titleEl.focus()
      titleEl.setSelectionRange(titleEl.value.length, titleEl.value.length)
      titleEl.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
      )
      expect(document.activeElement).not.toBe(titleEl)
      expect(view.dom.querySelector('.desk-code-block--whole-selected')).toBeTruthy()
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
    })
  })

  it('ArrowDown from the line above a callout focuses the title', async () => {
    const editor = await createNavEditor(
      [
        '```js',
        'const x = 1',
        '```',
        '',
        '::: tip 提示题',
        '',
        '这是 PowerShell 的经典坑',
        '',
        ':::',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let calloutPos = -1
      view.state.doc.forEach((node, offset) => {
        if (node.type.name === 'deskCallout' && calloutPos < 0) calloutPos = offset
      })
      expect(calloutPos).toBeGreaterThan(-1)
      const before = view.state.doc.resolve(calloutPos).nodeBefore
      let caret = -1
      if (before?.type.name === 'paragraph') {
        caret = calloutPos - before.nodeSize + 1
      } else {
        const para = view.state.schema.nodes.paragraph.create()
        view.dispatch(view.state.tr.insert(calloutPos, para))
        caret = calloutPos + 1
      }
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, caret)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
      )
      const title = view.dom.querySelector('.desk-callout__title')
      expect(title).toBeInstanceOf(HTMLInputElement)
      expect(document.activeElement).toBe(title)
    })
  })
})
