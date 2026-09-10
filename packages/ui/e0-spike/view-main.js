// E2 验证：共享只读组件在真实浏览器里渲染「中文 + 箭头 + 透明图片」的深浅两主题。
import { createApp, h, ref } from 'vue'

import { ExcalidrawSvg } from '../src/entries/excalidraw-view'

const TRANSPARENT =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

const element = {
  id: 'base',
  angle: 0,
  strokeColor: '#1e1e1e',
  backgroundColor: 'transparent',
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

const scene = {
  type: 'excalidraw',
  version: 2,
  source: 'e2-fixture',
  appState: { viewBackgroundColor: '#ffffff' },
  elements: [
    {
      ...element,
      id: 'rect-1',
      type: 'rectangle',
      x: 40,
      y: 40,
      width: 220,
      height: 120,
      backgroundColor: '#a5d8ff'
    },
    {
      ...element,
      id: 'text-1',
      type: 'text',
      x: 60,
      y: 190,
      width: 260,
      height: 25,
      text: '中文标签 TNotes 画布',
      originalText: '中文标签 TNotes 画布',
      fontSize: 20,
      fontFamily: 1,
      textAlign: 'left',
      verticalAlign: 'top',
      containerId: null,
      lineHeight: 1.25,
      baseline: 18
    },
    {
      ...element,
      id: 'arrow-1',
      type: 'arrow',
      x: 300,
      y: 60,
      width: 160,
      height: 90,
      points: [
        [0, 0],
        [160, 90]
      ],
      lastCommittedPoint: null,
      startBinding: null,
      endBinding: null,
      startArrowhead: null,
      endArrowhead: 'arrow'
    },
    {
      ...element,
      id: 'image-1',
      type: 'image',
      x: 320,
      y: 190,
      width: 80,
      height: 80,
      fileId: 'file-1',
      status: 'saved',
      scale: [1, 1]
    }
  ],
  files: {
    'file-1': { id: 'file-1', mimeType: 'image/png', dataURL: TRANSPARENT, created: 1 }
  }
}

const dark = ref(false)
document.getElementById('theme').addEventListener('click', () => {
  dark.value = !dark.value
  document.body.classList.toggle('dark', dark.value)
  document.documentElement.classList.toggle('dark', dark.value)
})

createApp({
  setup: () => () =>
    h(ExcalidrawSvg, {
      content: JSON.stringify(scene),
      theme: dark.value ? 'dark' : 'light',
      height: 320,
      label: 'E2 只读画布样例'
    })
}).mount('#mount')
