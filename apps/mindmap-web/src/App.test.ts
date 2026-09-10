// @vitest-environment happy-dom
/* eslint-disable vue/one-component-per-file -- 本文件内的组件仅用于隔离 App 视图路由测试。 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import type { MindmapSession } from '@tnotesjs/mindmap-core'

vi.mock('./ui/MindmapView.vue', () => ({
  default: defineComponent({
    name: 'MindmapViewStub',
    props: { session: { type: Object, required: true } },
    emits: ['requestSearch'],
    setup(props, { emit }) {
      function focusDeepest() {
        const session = props.session as MindmapSession
        const levels = Array.from({ length: 12 }, (_, index) => `${'  '.repeat(index)}- L${index + 1}`)
        session.setMarkdown(`# T\n\n${levels.join('\n')}\n`)
        let target = session.document.root.children[0]
        while (target.children[0]) target = target.children[0]
        session.focusNode(target.id)
      }
      return () => h('div', [
        h('button', {
          'data-view': 'map',
          onClick: () => emit('requestSearch'),
        }, '脑图内搜索'),
        h('button', { 'data-focus-deepest': '', onClick: focusDeepest }, '进入深层主题'),
      ])
    },
  }),
}))

vi.mock('./ui/OutlineView.vue', () => ({
  default: defineComponent({
    name: 'OutlineViewStub',
    emits: ['requestSearch'],
    setup(_props, { emit }) {
      return () => h('button', {
        'data-view': 'outline',
        onClick: () => emit('requestSearch'),
      }, '大纲内搜索')
    },
  }),
}))

vi.mock('./ui/MarkdownView.vue', () => ({
  default: defineComponent({
    name: 'MarkdownViewStub',
    setup: () => () => h('div', { 'data-view': 'source' }),
  }),
}))

vi.mock('./ui/SearchBar.vue', () => ({
  default: defineComponent({
    name: 'SearchBarStub',
    props: { visible: Boolean },
    setup(props) {
      return () => props.visible ? h('div', { 'data-search-results': 'outline' }) : null
    },
  }),
}))

import App from './App.vue'

async function settle() {
  await nextTick()
  await nextTick()
}

function mountApp() {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(App)
  app.mount(host)
  return { app, host }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('搜索视图路由', () => {
  it('首次打开显示 Web 层默认测试示例和对应文件名', () => {
    const { app, host } = mountApp()
    expect(host.querySelector('.file-name')?.textContent).toBe('TNotes-Mindmap-使用指南.tn-mindmap.md')
    expect([...host.querySelectorAll('button')].some((button) => button.textContent === '载入默认测试示例')).toBe(true)
    app.unmount()
  })

  it('脑图发起搜索时切换为大纲结果视图，返回脑图时关闭搜索', async () => {
    const { app, host } = mountApp()
    expect(host.querySelector('[data-view="map"]')).not.toBeNull()

    ;(host.querySelector('[data-view="map"]') as HTMLButtonElement).click()
    await settle()
    expect(host.querySelector('[data-view="map"]')).toBeNull()
    expect(host.querySelector('[data-view="outline"]')).not.toBeNull()
    expect(host.querySelector('[data-search-results="outline"]')).not.toBeNull()

    ;(host.querySelector('[aria-label="脑图视图"]') as HTMLButtonElement).click()
    await settle()
    expect(host.querySelector('[data-view="map"]')).not.toBeNull()
    expect(host.querySelector('[data-search-results="outline"]')).toBeNull()
    app.unmount()
  })

  it('脑图中按 Cmd/Ctrl+F 同样进入大纲搜索结果', async () => {
    const { app, host } = mountApp()
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'f',
      metaKey: true,
      bubbles: true,
      cancelable: true,
    }))
    await settle()

    expect(host.querySelector('[data-view="outline"]')).not.toBeNull()
    expect(host.querySelector('[data-search-results="outline"]')).not.toBeNull()
    app.unmount()
  })
})

describe('聚焦主题导航', () => {
  it('直接进入深层节点后完整渲染全部真实祖先层级', async () => {
    const { app, host } = mountApp()

    ;(host.querySelector('[data-focus-deepest]') as HTMLButtonElement).click()
    await settle()

    const crumbs = [...host.querySelectorAll<HTMLElement>('.focus-crumb')]
    expect(crumbs.map((item) => item.textContent?.trim())).toEqual([
      '全部',
      ...Array.from({ length: 12 }, (_, index) => `L${index + 1}`),
    ])
    expect(crumbs[crumbs.length - 1]?.getAttribute('aria-current')).toBe('page')
    app.unmount()
  })
})
