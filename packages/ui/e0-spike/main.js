// E0 spike：在纯 DOM 宿主里挂载 React + Excalidraw，验证
// 1) 能否挂载并渲染；2) 同一实例换 DOM 承载位置后原生撤销历史是否保留；
// 3) 卸载重挂会丢历史（对照）；4) 首屏耗时与产物体积。
import '@excalidraw/excalidraw/index.css'

import React, { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { Excalidraw, exportToSvg } from '@excalidraw/excalidraw'

const host = document.getElementById('host')
const status = document.getElementById('status')
const card = document.getElementById('card')
const fullscreen = document.getElementById('fullscreen')

let root = null
let api = null
let mountStartedAt = 0
let firstPaintMs = null

function setStatus(text) {
  status.textContent = text
  window.__e0.statusText = text
}

function mount() {
  mountStartedAt = performance.now()
  firstPaintMs = null
  root = createRoot(host)
  root.render(
    createElement(Excalidraw, {
      excalidrawAPI: (next) => {
        api = next
        window.__e0api = next
        requestAnimationFrame(() => {
          if (firstPaintMs === null) firstPaintMs = performance.now() - mountStartedAt
        })
      }
    })
  )
}

function unmount() {
  root?.unmount()
  root = null
  api = null
  window.__e0api = null
}

/**
 * E2 探针：只读 SVG 导出到底长什么样——字体是否内嵌、图片是否 data URL、
 * 有没有 foreignObject / 外链，决定了 <img> 与 SSG 能否视觉一致。
 */
async function exportProbe() {
  const element = {
    id: 'rect-1',
    type: 'rectangle',
    x: 20,
    y: 20,
    width: 200,
    height: 120,
    angle: 0,
    strokeColor: '#1e1e1e',
    backgroundColor: '#a5d8ff',
    fillStyle: 'hachure',
    strokeWidth: 2,
    roughness: 1,
    opacity: 100,
    seed: 1,
    version: 1,
    versionNonce: 1,
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false
  }
  const label = {
    ...element,
    id: 'text-1',
    type: 'text',
    x: 30,
    y: 160,
    width: 220,
    height: 25,
    text: '中文标签 TNotes',
    fontSize: 20,
    fontFamily: 1,
    textAlign: 'left',
    verticalAlign: 'top',
    containerId: null,
    originalText: '中文标签 TNotes',
    lineHeight: 1.25,
    baseline: 18
  }
  const dataURL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  const files = {
    'file-1': { id: 'file-1', mimeType: 'image/png', dataURL, created: 1 }
  }
  const image = {
    ...element,
    id: 'image-1',
    type: 'image',
    x: 260,
    y: 20,
    width: 60,
    height: 60,
    fileId: 'file-1',
    status: 'saved',
    scale: [1, 1]
  }
  const svg = await exportToSvg({
    elements: [element, label, image],
    appState: { exportWithDarkMode: false, exportBackground: true },
    files
  })
  const markup = svg.outerHTML
  const urls = [...markup.matchAll(/url\((?:"|')?([^"')]+)/g)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith('data:'))
  return {
    length: markup.length,
    hasFontFace: markup.includes('@font-face'),
    hasForeignObject: markup.includes('foreignObject'),
    inlinesImage: markup.includes('data:image/png'),
    externalUrls: [...new Set(urls)].slice(0, 5),
    mentionsVirgil: /Virgil|Excalifont|Nunito/.test(markup)
  }
}

/**
 * E0 发现：移动宿主 DOM 后键盘快捷键失效（指针正常）。这里把候选修法都暴露出来，
 * 由驱动脚本逐个验证，找到真正有效的那一种再落进宿主组件。
 */
const strategies = {
  clickInteractiveCanvas: async () => {
    const canvas = document.querySelector('.excalidraw__canvas.interactive')
    const box = canvas?.getBoundingClientRect()
    if (!canvas || !box) return 'no-canvas'
    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: box.left + 20,
        clientY: box.top + 20,
        pointerId: 1,
        isPrimary: true
      })
    )
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        clientX: box.left + 20,
        clientY: box.top + 20,
        pointerId: 1,
        isPrimary: true
      })
    )
    return 'clickInteractiveCanvas'
  },
  setActiveTool: async () => {
    api?.setActiveTool?.({ type: 'selection' })
    return 'setActiveTool'
  },
  focusTextarea: async () => {
    document.querySelector('.excalidraw textarea')?.focus?.()
    return 'focusTextarea'
  },
  rafThenFocusTextarea: async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    document.querySelector('.excalidraw textarea')?.focus?.()
    return 'rafThenFocusTextarea'
  },
  blurThenFocusCanvas: async () => {
    document.activeElement?.blur?.()
    const canvas = document.querySelector('.excalidraw__canvas.interactive')
    canvas?.setAttribute('tabindex', '0')
    canvas?.focus?.()
    return 'blurThenFocusCanvas'
  },
  containerFocusHandler: async () => {
    const container = document.querySelector('.excalidraw')
    container?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    document.querySelector('.excalidraw textarea')?.focus?.()
    return 'containerFocusHandler'
  }
}

window.__e0 = {
  exportProbe,
  focusWith: async (name) => {
    const strategy = strategies[name]
    if (!strategy) return 'unknown'
    return await strategy()
  },
  activeElement: () => {
    const element = document.activeElement
    if (!element) return 'none'
    return `${element.tagName.toLowerCase()}.${(element.className || '').toString().slice(0, 40)}`
  },
  statusText: '',
  mount,
  unmount,
  elements: () => api?.getSceneElements?.()?.length ?? -1,
  /**
   * 公开 API 只有 history.clear，没有程序化 undo：改用工具栏撤销按钮的可用状态
   * 判断历史栈里还有没有条目（这是「历史是否保留」最直接的信号）。
   */
  undoButtonState: () => {
    const button = document.querySelector('[data-testid="button-undo"]')
    if (!button) return { found: false, disabled: null }
    return {
      found: true,
      disabled: button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true'
    }
  },
  /** 把焦点放回画布（移动 DOM 后必须显式聚焦，键盘事件才会送到编辑器） */
  focusCanvas: () => {
    document.querySelector('.excalidraw__canvas')?.focus?.()
    const textarea = document.querySelector('.excalidraw textarea')
    textarea?.focus?.()
  },
  firstPaintMs: () => firstPaintMs,
  moveTo: (where) => {
    // 只移动宿主节点：不卸载 React 树，模拟「卡片 → 全屏」交接
    if (where === 'fullscreen') {
      fullscreen.append(host)
      fullscreen.classList.add('active')
      card.style.display = 'none'
    } else {
      card.append(host)
      fullscreen.classList.remove('active')
      card.style.display = ''
    }
    setStatus(`moved:${where}`)
  },
  hasEditor: () => Boolean(document.querySelector('.excalidraw'))
}

document.getElementById('move').addEventListener('click', () => window.__e0.moveTo('fullscreen'))
document.getElementById('back').addEventListener('click', () => window.__e0.moveTo('card'))
document.getElementById('remount').addEventListener('click', () => {
  unmount()
  mount()
})

mount()
