import type { Ctx } from '@milkdown/kit/ctx'

import { formatIconSvg } from '../components/formatIcons'

import { insertDefaultTable } from './insertDefaultTable'
import { buildTNotesSlashGroup, type SlashMenuItem } from './slashMenu'

/**
 * 斜杠菜单 / 块手柄的配置：**Crepe 装配与自组装配共用一份**。
 *
 * 抽出来的理由和 `deskEditorConfigs` 一样：两条装配路径若各写一份菜单配置，图标、
 * 分组、TNotes 组项与搜索词很快会漂移，而 e2e（`.milkdown-slash-menu`）断言的是同一套 DOM。
 *
 * 依赖注入：`runSlashItem` 是组件内的插入逻辑（要拿编辑器实例与若干会话状态），
 * 所以由调用方传入。
 *
 * 这里刻意用**结构化**类型描述 builder 与配置，而不是引用某一侧的 `GroupBuilder` 类：
 * 那两个类各自带私有字段（`#groups`），TS 按名义类型比较会互不兼容，于是共用配置就没法
 * 同时喂给 Crepe 与我们的移植实现。结构化类型对两边都成立，也省掉了类型断言。
 */
export interface DeskBlockEditDeps {
  runSlashItem: (item: SlashMenuItem) => void
}

interface DeskMenuItemLike {
  key: string
  onRun?: (ctx: Ctx) => void
}

interface DeskGroupHandleLike {
  addItem: (
    key: string,
    item: { label: string; icon: string; onRun?: (ctx: unknown) => void }
  ) => unknown
}

interface DeskGroupBuilderLike {
  addGroup: (key: string, label: string) => DeskGroupHandleLike
  getGroup: (key: string) => { group: { items: DeskMenuItemLike[] } }
}

interface DeskGroupEntry {
  label?: string
  icon: string
}

export interface DeskBlockEditConfig {
  textGroup: {
    quote: DeskGroupEntry
    divider: DeskGroupEntry
  }
  listGroup: {
    bulletList: DeskGroupEntry
    orderedList: DeskGroupEntry
    taskList: DeskGroupEntry
  }
  advancedGroup: {
    codeBlock: DeskGroupEntry
    table: DeskGroupEntry
  }
  buildMenu: (builder: DeskGroupBuilderLike) => void
}

export function createDeskBlockEditConfig(deps: DeskBlockEditDeps): DeskBlockEditConfig {
  return {
    textGroup: {
      quote: { icon: formatIconSvg('quote') },
      divider: { icon: formatIconSvg('divider') }
    },
    listGroup: {
      bulletList: { icon: formatIconSvg('unordered-list') },
      orderedList: { icon: formatIconSvg('ordered-list') },
      taskList: { icon: formatIconSvg('checkbox') }
    },
    advancedGroup: {
      codeBlock: { icon: formatIconSvg('code-block') },
      table: { icon: formatIconSvg('table') }
    },
    buildMenu: (builder) => {
      const table = builder.getGroup('advanced').group.items.find((item) => item.key === 'table')
      if (table) table.onRun = (ctx) => insertDefaultTable(ctx, 'slash')
      buildTNotesSlashGroup(builder, {
        groupLabel: 'TNotes',
        onRun: (item) => {
          deps.runSlashItem(item)
        }
      })
    }
  }
}
