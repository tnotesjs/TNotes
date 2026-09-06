import { describe, expect, it } from 'vitest'

import { isStandaloneImageParagraph } from './standaloneImageParagraph'

import type { Node } from '@milkdown/kit/prose/model'

function node(name: string, children: Node[] = []): Node {
  return {
    type: { name },
    childCount: children.length,
    child: (index: number) => children[index]
  } as Node
}

describe('isStandaloneImageParagraph', () => {
  const image = node('image')

  it('accepts a paragraph that only contains images', () => {
    expect(isStandaloneImageParagraph(node('paragraph', [image]))).toBe(true)
    expect(isStandaloneImageParagraph(node('paragraph', [image, image]))).toBe(true)
  })

  it('rejects empty or mixed text paragraphs', () => {
    expect(isStandaloneImageParagraph(node('paragraph'))).toBe(false)
    expect(isStandaloneImageParagraph(node('paragraph', [image, node('text')]))).toBe(false)
    expect(isStandaloneImageParagraph(node('heading', [image]))).toBe(false)
  })
})
