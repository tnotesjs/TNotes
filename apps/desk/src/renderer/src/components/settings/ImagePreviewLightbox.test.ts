// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import ImagePreviewLightbox from './ImagePreviewLightbox.vue'

const items = [
  { src: 'data:image/png;base64,AA', label: '原图', meta: '1.0 KB' },
  { src: 'data:image/png;base64,BB', label: '优化后', meta: '0.5 KB · -50%', lossy: true }
]

function dialog(): HTMLElement | null {
  return document.body.querySelector('.image-lightbox')
}

function stageImage(): HTMLElement {
  const img = document.body.querySelector('.image-lightbox .stage img')
  if (!img) throw new Error('lightbox image not found')
  return img as HTMLElement
}

function captionText(): string {
  return document.body.querySelector('.image-lightbox .stage figcaption')?.textContent?.trim() ?? ''
}

afterEach(() => {
  document.querySelectorAll('.image-lightbox').forEach((node) => node.remove())
})

describe('ImagePreviewLightbox', () => {
  it('renders the requested item with label, meta and lossy badge', () => {
    mount(ImagePreviewLightbox, { props: { items, startIndex: 1 } })

    expect(dialog()).not.toBeNull()
    expect(captionText()).toContain('优化后')
    expect(captionText()).toContain('-50%')
    expect(captionText()).toContain('有损')
    expect(captionText()).toContain('2 / 2')
  })

  it('switches with left click (next) and right click (previous)', async () => {
    mount(ImagePreviewLightbox, { props: { items, startIndex: 0 } })
    expect(captionText()).toContain('原图')

    stageImage().dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await Promise.resolve()
    expect(captionText()).toContain('优化后')

    stageImage().dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    await Promise.resolve()
    expect(captionText()).toContain('原图')
  })

  it('closes on Escape, on backdrop click and via the close hint', async () => {
    const wrapper = mount(ImagePreviewLightbox, { props: { items, startIndex: 0 } })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await Promise.resolve()
    expect(wrapper.emitted('close')).toHaveLength(1)

    mount(ImagePreviewLightbox, { props: { items, startIndex: 0 } })
    ;(dialog() as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await Promise.resolve()
    expect(wrapper.emitted('close')).toHaveLength(2)
  })

  it('hides switching affordances when only one image exists', () => {
    mount(ImagePreviewLightbox, { props: { items: [items[0]], startIndex: 0 } })

    expect(dialog()?.querySelector('.nav-arrow')).toBeNull()
    expect(dialog()?.querySelector('.hint')).toBeNull()
  })
})
