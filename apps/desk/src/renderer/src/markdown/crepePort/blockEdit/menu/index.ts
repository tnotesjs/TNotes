import type { Ctx } from '@milkdown/kit/ctx'
import { rootCtx } from '@milkdown/kit/core'
import type { EditorView } from '@milkdown/kit/prose/view'

import {
  SlashProvider,
  slashFactory,
  type SlashProviderOptions,
} from '@milkdown/kit/plugin/slash'
import {
  TextSelection,
  type PluginView,
  type Selection,
} from '@milkdown/kit/prose/state'
import { $ctx } from '@milkdown/kit/utils'
import { createApp, ref, type App, type Ref } from 'vue'

import {
  DEFAULT_DESK_BLOCK_EDIT_FEATURES,
  type DeskBlockEditFeatures
} from '../features'
import type { BlockEditFeatureConfig } from '../index'

import { isInCodeBlock, isInList } from '../../utils'
import { Menu } from './component'
import { constrainSlashMenu, editorVisibleBoundary, type RectLike } from './constrain'

export const menu = slashFactory('CREPE_MENU')

interface MenuAPI {
  show: (pos: number) => void
  hide: () => void
}

export const menuAPI = $ctx(
  {
    show: () => {},
    hide: () => {},
  } as MenuAPI,
  'menuAPICtx'
)

export function configureMenu(
  ctx: Ctx,
  config?: BlockEditFeatureConfig,
  features: DeskBlockEditFeatures = DEFAULT_DESK_BLOCK_EDIT_FEATURES
) {
  ctx.set(menu.key, {
    view: (view) => new MenuView(ctx, view, config, features),
  })
}

class MenuView implements PluginView {
  readonly #content: HTMLElement
  readonly #app: App
  readonly #filter: Ref<string>
  readonly #slashProvider: SlashProvider
  readonly #constrain: () => void
  readonly #detachConstrain: () => void
  #programmaticallyPos: number | null = null

  constructor(
    ctx: Ctx,
    view: EditorView,
    config?: BlockEditFeatureConfig,
    features: DeskBlockEditFeatures = DEFAULT_DESK_BLOCK_EDIT_FEATURES
  ) {
    const content = document.createElement('div')
    content.classList.add('milkdown-slash-menu')
    const show = ref(false)

    const filter = ref('')
    this.#filter = filter

    const hide = this.hide

    const app = createApp(Menu, {
      ctx,
      config,
      features,
      // Desk 扩展：双列紧凑网格（样式表用 data-layout 选网格，键盘导航按列数走）。
      columns: config?.slashMenuLayout?.columns,
      groupDataLayout: config?.slashMenuLayout?.groupDataLayout,
      show,
      filter,
      hide,
    })
    this.#app = app
    app.mount(content)

    this.#content = content
    // oxlint-disable-next-line ts/no-this-alias
    const self = this
    const slashMenuOptions = (config?.slashMenu ??
      {}) as Partial<SlashProviderOptions>
    this.#slashProvider = new SlashProvider({
      content: this.#content,
      debounce: 20,
      shouldShow(this: SlashProvider, view: EditorView) {
        if (
          isInCodeBlock(view.state.selection) ||
          isInList(view.state.selection)
        )
          return false

        const currentText = this.getContent(view, (node) =>
          ['paragraph', 'heading'].includes(node.type.name)
        )

        if (currentText == null) return false

        if (!isSelectionAtEndOfNode(view.state.selection)) {
          return false
        }

        const pos = self.#programmaticallyPos

        filter.value = currentText.startsWith('/')
          ? currentText.slice(1)
          : currentText

        if (typeof pos === 'number') {
          const maxSize = view.state.doc.nodeSize - 2
          const validPos = Math.min(pos, maxSize)
          if (
            view.state.doc.resolve(validPos).node() !==
            view.state.doc.resolve(view.state.selection.from).node()
          ) {
            self.#programmaticallyPos = null

            return false
          }

          return true
        }

        if (!currentText.startsWith('/')) return false

        return true
      },
      offset: slashMenuOptions.offset ?? 10,
      middleware: slashMenuOptions.middleware,
      floatingUIOptions: slashMenuOptions.floatingUIOptions,
      root: slashMenuOptions.root,
    })

    // Desk 扩展：把菜单夹进编辑器可见区域（原先是 Desk 侧的 DOM 补丁层）。
    const obstacles = (): RectLike | null => config?.slashMenuViewport?.obstacles?.() ?? null
    const root = (): HTMLElement | null => {
      const value = ctx.get(rootCtx) as unknown
      return value instanceof HTMLElement ? value : null
    }
    this.#constrain = () => {
      if (this.#content.dataset.show !== 'true') return
      const host = root()
      if (!host) return
      constrainSlashMenu(this.#content, editorVisibleBoundary(host), obstacles)
    }
    const onViewportChange = () => this.#constrain()
    const hostElement = root()
    hostElement?.addEventListener('scroll', onViewportChange, { passive: true })
    window.addEventListener('resize', onViewportChange, { passive: true })
    this.#detachConstrain = () => {
      hostElement?.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', onViewportChange)
    }

    this.#slashProvider.onShow = () => {
      show.value = true
      requestAnimationFrame(() => this.#constrain())
    }
    this.#slashProvider.onHide = () => {
      show.value = false
    }
    this.update(view)

    ctx.set(menuAPI.key, {
      show: (pos) => this.show(pos),
      hide: () => this.hide(),
    })
  }

  update = (view: EditorView) => {
    this.#slashProvider.update(view)
    this.#constrain()
  }

  show = (pos: number) => {
    this.#programmaticallyPos = pos
    this.#filter.value = ''
    this.#slashProvider.show()
  }

  hide = () => {
    this.#programmaticallyPos = null
    this.#slashProvider.hide()
  }

  destroy = () => {
    this.#detachConstrain()
    this.#slashProvider.destroy()
    this.#app.unmount()
    this.#content.remove()
  }
}

function isSelectionAtEndOfNode(selection: Selection) {
  if (!(selection instanceof TextSelection)) return false

  const { $head } = selection
  const parent = $head.parent
  const offset = $head.parentOffset

  return offset === parent.content.size
}
