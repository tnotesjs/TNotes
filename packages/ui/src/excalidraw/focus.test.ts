// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  restoreCanvasKeyboardFocus,
  restoreCanvasKeyboardFocusWhenReady
} from './focus'

function fixture(height: number): { host: HTMLDivElement; canvas: HTMLCanvasElement } {
  const host = document.createElement('div')
  const canvas = document.createElement('canvas')
  canvas.className = 'excalidraw__canvas interactive'
  canvas.getBoundingClientRect = () => ({ height, width: 400 }) as DOMRect
  host.append(canvas)
  document.body.append(host)
  return { host, canvas }
}

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('画布键盘焦点', () => {
  it('补 tabindex 并把焦点交给交互画布', () => {
    const { host, canvas } = fixture(600)

    expect(restoreCanvasKeyboardFocus(host)).toBe(true)
    expect(canvas.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(canvas)
  })

  it('没有交互画布时不抢焦点并返回 false', () => {
    const host = document.createElement('div')
    const button = document.createElement('button')
    host.append(button)
    document.body.append(host)
    button.focus()

    expect(restoreCanvasKeyboardFocus(host)).toBe(false)
    // blur 掉当前焦点后没有可聚焦目标：焦点回到 body，不会落到别的控件上
    expect(document.activeElement).toBe(document.body)
  })

  it('画布还在 display:none 里（高度 0）时不聚焦，等布局就绪后再聚焦', () => {
    const { host, canvas } = fixture(0)
    const frames: Array<() => void> = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(() => callback(0))
      return frames.length
    })

    restoreCanvasKeyboardFocusWhenReady(host)
    // 关键回归点：还没布局就 focus() 会静默失败、焦点留在 body，快捷键收不到
    expect(document.activeElement).not.toBe(canvas)
    expect(frames.length).toBeGreaterThan(0)

    canvas.getBoundingClientRect = () => ({ height: 600, width: 400 }) as DOMRect
    frames.forEach((run) => run())
    expect(document.activeElement).toBe(canvas)
  })
})
