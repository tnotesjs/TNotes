import type { Ctx } from '@milkdown/kit/ctx'

import { Icon } from '@milkdown/kit/component'
import {
  computed,
  defineComponent,
  onUnmounted,
  ref,
  watch,
  watchEffect,
  type PropType,
  type Ref,
  h,
} from 'vue'

import type { BlockEditFeatureConfig } from '..'

import { keepAlive } from '../../utils/keep-alive'
import {
  DEFAULT_DESK_BLOCK_EDIT_FEATURES,
  type DeskBlockEditFeatures
} from '../features'
import { getGroups } from './config'

keepAlive(h)

type MenuProps = {
  ctx: Ctx
  features: DeskBlockEditFeatures
  /** Desk 扩展：菜单项按几列排（>1 时键盘上下跨列、左右按行）。默认 1（上游行为）。 */
  columns?: number
  /** Desk 扩展：给 `.menu-group` 打的布局标记（Desk 传 `compact-grid`，样式表依赖它）。 */
  groupDataLayout?: string
  show: Ref<boolean>
  filter: Ref<string>
  hide: () => void
  config?: BlockEditFeatureConfig
}

export const Menu = defineComponent<MenuProps>({
  props: {
    features: {
      type: Object as PropType<DeskBlockEditFeatures>,
      default: () => DEFAULT_DESK_BLOCK_EDIT_FEATURES
    },
    columns: {
      type: Number,
      default: 1
    },
    groupDataLayout: {
      type: String,
      default: undefined
    },
    ctx: {
      type: Object,
      required: true,
    },
    show: {
      type: Object,
      required: true,
    },
    filter: {
      type: Object,
      required: true,
    },
    hide: {
      type: Function,
      required: true,
    },
    config: {
      type: Object,
      required: false,
    },
  },
  setup({ ctx, features, columns, groupDataLayout, show, filter, hide, config }) {
    const host = ref<HTMLElement>()
    const groupInfo = computed(() => getGroups(filter.value, config, features))
    const hoverIndex = ref(0)
    const prevMousePosition = ref({ x: -999, y: -999 })

    const onPointerMove = (e: MouseEvent) => {
      const { x, y } = e
      prevMousePosition.value = { x, y }
    }

    watch([groupInfo, show], () => {
      const { size } = groupInfo.value
      if (size === 0 && show.value) hide()
      else if (hoverIndex.value >= size) hoverIndex.value = 0
    })

    const onHover = (
      index: number | ((prev: number) => number),
      after?: (index: number) => void
    ) => {
      const prevHoverIndex = hoverIndex.value
      const next = typeof index === 'function' ? index(prevHoverIndex) : index
      after?.(next)
      hoverIndex.value = next
    }

    const scrollToIndex = (index: number) => {
      const target = host.value?.querySelector<HTMLElement>(
        `[data-index="${index}"]`
      )
      const scrollRoot = host.value?.querySelector<HTMLElement>('.menu-groups')

      if (!target || !scrollRoot) return

      scrollRoot.scrollTop = target.offsetTop - scrollRoot.offsetTop
    }

    const runByIndex = (index: number) => {
      const item = groupInfo.value.groups
        .flatMap((group) => group.items)
        .at(index)
      if (item?.onRun && ctx) item.onRun(ctx)

      hide()
    }

    const columnCount = Math.max(1, columns ?? 1)

    /** 同组内按列上下移动；越界时（仅多列布局）跨到相邻组。 */
    const moveVertical = (index: number, direction: 1 | -1): number => {
      const { groups } = groupInfo.value
      const group = groups.find((entry) => entry.range[0] <= index && entry.range[1] > index)
      if (!group) return index
      const nextLocal = index - group.range[0] + direction * columnCount
      if (nextLocal >= 0 && nextLocal < group.items.length) return group.range[0] + nextLocal
      // 单列布局保持上游语义：纵向不跨组。
      if (columnCount <= 1) return index
      const adjacent = groups[groups.indexOf(group) + direction]
      if (!adjacent) return index
      return direction === 1 ? adjacent.range[0] : adjacent.range[1] - 1
    }

    /** 单列：左右键跨组（上游语义）；多列：先在同一行内左右走，到行边界再跨组。 */
    const moveHorizontal = (index: number, direction: 1 | -1): number => {
      const { groups } = groupInfo.value
      const group = groups.find((entry) => entry.range[0] <= index && entry.range[1] > index)
      if (!group) return index
      if (columnCount > 1) {
        const local = index - group.range[0]
        const nextLocal = local + direction
        const sameRow =
          nextLocal >= 0 &&
          nextLocal < group.items.length &&
          Math.floor(nextLocal / columnCount) === Math.floor(local / columnCount)
        if (sameRow) return group.range[0] + nextLocal
      }
      const adjacent = groups[groups.indexOf(group) + direction]
      if (!adjacent) return index
      return direction === 1 ? adjacent.range[0] : adjacent.range[1] - 1
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        hide?.()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        return onHover((index) => moveVertical(index, 1), scrollToIndex)
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        return onHover((index) => moveVertical(index, -1), scrollToIndex)
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        return onHover((index) => moveHorizontal(index, -1), scrollToIndex)
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        return onHover((index) => moveHorizontal(index, 1), scrollToIndex)
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        runByIndex(hoverIndex.value)
      }
    }

    const getOnPointerEnter = (index: number) => (e: MouseEvent) => {
      const prevPos = prevMousePosition.value
      if (!prevPos) return

      const { x, y } = e
      if (x === prevPos.x && y === prevPos.y) return

      onHover(index)
    }

    watchEffect(() => {
      const isShown = show.value
      if (isShown) {
        window.addEventListener('keydown', onKeydown, { capture: true })
      } else {
        window.removeEventListener('keydown', onKeydown, { capture: true })
      }
    })
    onUnmounted(() => {
      window.removeEventListener('keydown', onKeydown, { capture: true })
    })

    return () => {
      return (
        <div ref={host} onPointerdown={(e) => e.preventDefault()}>
          <nav class="tab-group">
            <ul>
              {groupInfo.value.groups.map((group) => (
                <li
                  key={group.key}
                  onPointerdown={() => onHover(group.range[0], scrollToIndex)}
                  class={
                    hoverIndex.value >= group.range[0] &&
                    hoverIndex.value < group.range[1]
                      ? 'selected'
                      : ''
                  }
                >
                  {group.label}
                </li>
              ))}
            </ul>
          </nav>
          <div class="menu-groups" onPointermove={onPointerMove}>
            {groupInfo.value.groups.map((group) => (
              <div key={group.key} class="menu-group" data-layout={groupDataLayout}>
                <h6>{group.label}</h6>
                <ul>
                  {group.items.map((item) => (
                    <li
                      key={item.key}
                      data-index={item.index}
                      class={hoverIndex.value === item.index ? 'hover' : ''}
                      onPointerenter={getOnPointerEnter(item.index)}
                      onPointerdown={() => {
                        host.value
                          ?.querySelector(`[data-index="${item.index}"]`)
                          ?.classList.add('active')
                      }}
                      onPointerup={() => {
                        host.value
                          ?.querySelector(`[data-index="${item.index}"]`)
                          ?.classList.remove('active')
                        runByIndex(item.index)
                      }}
                    >
                      <Icon icon={item.icon} />
                      <span>{item.label}</span>
                      {item.shortcut ? (
                        // Desk 扩展：快捷词直接由菜单渲染（类名与样式表、e2e 断言一致）。
                        <span
                          class="desk-slash-menu__shortcut"
                          aria-label={`快捷方式 ${item.shortcut}`}
                        >
                          {item.shortcut}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )
    }
  },
})
