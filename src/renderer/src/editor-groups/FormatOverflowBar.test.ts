// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import FormatOverflowBar from './FormatOverflowBar.vue'

const items = ['one', 'two', 'three', 'four', 'five'] as const

function box(width: number): DOMRect {
  return {
    width,
    height: 32,
    top: 0,
    left: 0,
    bottom: 32,
    right: width,
    x: 0,
    y: 0,
    toJSON: () => ({})
  }
}

function stubLayout(root: Element, available: number, itemWidth = 32, moreWidth = 32): void {
  Object.defineProperty(root, 'clientWidth', { configurable: true, value: available })
  root.querySelectorAll('[data-overflow-measure]').forEach((element) => {
    Object.defineProperty(element, 'getBoundingClientRect', {
      configurable: true,
      value: () => box(itemWidth)
    })
  })
  const more = root.querySelector('[data-overflow-more-measure]')
  if (more) {
    Object.defineProperty(more, 'getBoundingClientRect', {
      configurable: true,
      value: () => box(moreWidth)
    })
  }
}

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      callback: ResizeObserverCallback
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback
      }
      observe(target: Element): void {
        stubLayout(target, 134)
        this.callback([], this)
      }
      unobserve(): void {
        return
      }
      disconnect(): void {
        return
      }
    }
  )
})

afterEach(() => {
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

describe('FormatOverflowBar', () => {
  it('hides trailing actions behind the more button when the bar is narrow', async () => {
    const wrapper = mount(FormatOverflowBar, {
      attachTo: document.body,
      props: { items: [...items] },
      slots: {
        item: ({ item }: { item: string }) => item
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[aria-label="更多"]').isVisible()).toBe(true)
    expect(wrapper.get('.format-overflow__inline').text()).toContain('one')
    expect(wrapper.get('.format-overflow__inline').text()).not.toContain('five')
    wrapper.unmount()
  })

  it('shows overflowed actions when the pointer enters the more button', async () => {
    const wrapper = mount(FormatOverflowBar, {
      attachTo: document.body,
      props: { items: [...items] },
      slots: {
        item: ({ item }: { item: string }) => item
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.get('[aria-label="更多"]').trigger('mouseenter')
    await wrapper.vm.$nextTick()
    const menu = document.querySelector('[aria-label="更多格式"]')
    expect(menu?.textContent).toContain('four')
    expect(menu?.textContent).toContain('five')
    expect(menu?.textContent).not.toContain('one')
    wrapper.unmount()
  })

  it('disables the more button and does not open the menu when disabled', async () => {
    const wrapper = mount(FormatOverflowBar, {
      attachTo: document.body,
      props: { items: [...items], disabled: true },
      slots: {
        item: ({ item }: { item: string }) => item
      }
    })
    await wrapper.vm.$nextTick()
    const more = wrapper.get('[aria-label="更多"]')
    expect(more.attributes('disabled')).toBeDefined()
    await more.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('[aria-label="更多格式"]')).toBeNull()
    wrapper.unmount()
  })
})
