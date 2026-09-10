// E0 spike：在纯 DOM 宿主里挂载 React + Excalidraw，验证
// 1) 能否挂载并渲染；2) 同一实例换 DOM 承载位置后原生撤销历史是否保留；
// 3) 卸载重挂会丢历史（对照）；4) 首屏耗时与产物体积。
import '@excalidraw/excalidraw/index.css'

import React, { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { Excalidraw } from '@excalidraw/excalidraw'

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

window.__e0 = {
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
