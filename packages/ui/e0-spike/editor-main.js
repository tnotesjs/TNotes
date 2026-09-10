// E3 验证：编辑会话自动写盘 + 承载位置交接（撤销历史保留、键盘焦点重建）+ flush。
// 注意：编辑器的样式表必须由宿主引入一次，否则容器尺寸计算会失控。
import '@excalidraw/excalidraw/index.css'

import { createExcalidrawSession, persistedSceneSignature } from '../src/excalidraw/editorSession'
import { mountExcalidrawHost } from '../src/excalidraw/editorHost'

const emptyScene = {
  type: 'excalidraw',
  version: 2,
  source: 'e3-fixture',
  elements: [],
  appState: { viewBackgroundColor: '#ffffff' },
  files: {}
}

const saves = []
const session = createExcalidrawSession({
  initialContent: JSON.stringify(emptyScene),
  initialRevision: 'rev-0',
  debounceMs: 200,
  maxWaitMs: 1000,
  save: async ({ content, expectedRevision }) => {
    saves.push({
      expectedRevision,
      elements: JSON.parse(content).elements.length,
      bytes: content.length
    })
    return { ok: true, revision: `rev-${saves.length}` }
  }
})

const host = mountExcalidrawHost({
  host: document.getElementById('host'),
  content: JSON.stringify(emptyScene),
  theme: 'light',
  fontBase: '/',
  onChange: (content) => {
    // 宿主侧过滤展示状态：只有持久化内容变化才进会话
    if (persistedSceneSignature(content) === persistedSceneSignature(session.currentContent())) {
      return
    }
    session.update(content)
  },
  onReady: (api) => {
    window.__e0api = api
  }
})

const status = document.getElementById('status')
function paint() {
  status.textContent = `state=${session.state.value} saves=${saves.length} pending=${session.hasPending()}`
}
setInterval(paint, 200)

document.getElementById('move').addEventListener('click', () => {
  document.getElementById('fullscreen').classList.add('active')
  document.getElementById('card').style.display = 'none'
  host.transferTo(document.getElementById('fullscreen'))
  paint()
})
document.getElementById('back').addEventListener('click', () => {
  document.getElementById('fullscreen').classList.remove('active')
  document.getElementById('card').style.display = ''
  host.transferTo(document.getElementById('card'))
  paint()
})
document.getElementById('flush').addEventListener('click', () => {
  void session.flush().then(paint)
})

document.getElementById('overlay').addEventListener('click', () => {
  document.body.classList.toggle('overlay')
  paint()
})

window.__e3 = {
  saves,
  state: () => session.state.value,
  pending: () => session.hasPending(),
  elements: () => window.__e0api?.getSceneElements?.()?.length ?? -1,
  tool: () => window.__e0api?.getAppState?.().activeTool?.type ?? 'none',
  activeElement: () => {
    const element = document.activeElement
    return element
      ? `${element.tagName.toLowerCase()}.${(element.className || '').toString().slice(0, 30)}`
      : 'none'
  },
  flush: () => session.flush(),
  setActiveTool: (type) => window.__e0api?.setActiveTool?.({ type })
}
paint()
