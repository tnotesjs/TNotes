// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { DOMParser } from '@milkdown/kit/prose/model'

import {
  applyImageClipboardAttrs,
  imageAttrPlugins,
  markdownSrcFromClipboardUrl,
  readPastedImageAttrs
} from './imageAttrs'

const editors: Editor[] = []

afterEach(async () => {
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function createEditor(source = '![](../assets/a.png) {w=719px}\n'): Promise<Editor> {
  const root = document.createElement('div')
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, source)
    })
    .use(commonmark)
    .use(imageAttrPlugins)
  editors.push(editor)
  await editor.create()
  return editor
}

describe('image clipboard attrs', () => {
  it('recovers a note-local path from the asset protocol', () => {
    expect(markdownSrcFromClipboardUrl('tnotes-asset://asset?path=../assets/image-3.png')).toBe(
      '../assets/image-3.png'
    )
    expect(markdownSrcFromClipboardUrl('../assets/image-3.png')).toBe('../assets/image-3.png')
  })

  it('reads width, align, and markdown src from copied image HTML', () => {
    const figure = document.createElement('figure')
    figure.className = 'tn-image desk-image tn-image--center'
    const stack = document.createElement('div')
    stack.className = 'desk-image__stack is-sized'
    stack.style.width = '232px'
    const image = document.createElement('img')
    image.setAttribute('src', 'tnotes-asset://asset?path=../assets/image-4.png')
    applyImageClipboardAttrs(image, {
      src: '../assets/image-4.png',
      width: '232px',
      align: 'center'
    })
    stack.append(image)
    figure.append(stack)

    expect(readPastedImageAttrs(image)).toEqual({
      src: '../assets/image-4.png',
      alt: '',
      title: '',
      width: '232px',
      align: 'center'
    })
  })

  it('falls back to figure classes and stack width when data attrs are missing', () => {
    const figure = document.createElement('figure')
    figure.className = 'desk-image tn-image--right'
    const stack = document.createElement('div')
    stack.className = 'desk-image__stack'
    stack.style.width = '50%'
    const image = document.createElement('img')
    image.setAttribute('src', 'tnotes-asset://asset?path=../assets/a.png')
    image.setAttribute('alt', '说明')
    stack.append(image)
    figure.append(stack)

    expect(readPastedImageAttrs(image)).toEqual({
      src: '../assets/a.png',
      alt: '说明',
      title: '',
      width: '50%',
      align: 'right'
    })
  })

  it('parses pasted HTML into image nodes that keep width and align', async () => {
    const editor = await createEditor('before\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const host = document.createElement('div')
      host.innerHTML =
        '<img src="tnotes-asset://asset?path=../assets/a.png" data-tn-src="../assets/a.png" data-tn-width="719px" data-tn-align="center" alt="">'
      const parsed = DOMParser.fromSchema(view.state.schema).parse(host)
      let width = ''
      let align = ''
      let src = ''
      parsed.descendants((node) => {
        if (node.type.name !== 'image') return
        src = String(node.attrs.src ?? '')
        width = String(node.attrs.width ?? '')
        align = String(node.attrs.align ?? '')
      })
      expect(src).toBe('../assets/a.png')
      expect(width).toBe('719px')
      expect(align).toBe('center')
      expect(parsed.textContent).toContain('{w=719px align=center}')
    })
  })
})
