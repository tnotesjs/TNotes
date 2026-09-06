import { canRunHeadingFold, runHeadingFold } from './headingFoldBridge'

export interface PaletteCommand {
  id: string
  title: string
  category: string
  hint: string
  keywords: string[]
  shortcut?: string
  enabled: () => boolean
  run: () => void | Promise<void>
}

export interface PaletteCommandContext {
  saveDocument: () => Promise<void>
  openSettings: () => void
}

export function createPaletteCommands(context: PaletteCommandContext): PaletteCommand[] {
  const foldEnabled = (): boolean => canRunHeadingFold()
  return [
    {
      id: 'fold-all',
      title: '全部折叠标题',
      category: '编辑器',
      hint: 'Fold All',
      keywords: ['fold', 'all', 'collapse', 'fold all'],
      enabled: foldEnabled,
      run: () => void runHeadingFold('fold-all')
    },
    {
      id: 'unfold-all',
      title: '全部展开标题',
      category: '编辑器',
      hint: 'Unfold All',
      keywords: ['unfold', 'all', 'expand', 'unfold all'],
      enabled: foldEnabled,
      run: () => void runHeadingFold('unfold-all')
    },
    ...([1, 2, 3, 4, 5, 6] as const).flatMap((level) => [
      {
        id: `fold-level-${level}`,
        title: `折叠 ${level} 级标题`,
        category: '编辑器',
        hint: `Fold Level ${level}`,
        keywords: ['fold', 'level', `h${level}`, `heading ${level}`, `fold level ${level}`],
        enabled: foldEnabled,
        run: () => void runHeadingFold(`fold-level-${level}`)
      },
      {
        id: `unfold-level-${level}`,
        title: `展开 ${level} 级标题`,
        category: '编辑器',
        hint: `Unfold Level ${level}`,
        keywords: ['unfold', 'expand', 'level', `h${level}`, `heading ${level}`, `unfold level ${level}`],
        enabled: foldEnabled,
        run: () => void runHeadingFold(`unfold-level-${level}`)
      }
    ]),
    {
      id: 'save-note',
      title: '保存当前笔记',
      category: '笔记',
      hint: 'Save',
      keywords: ['save', '保存'],
      shortcut: '⌘ S',
      enabled: () => true,
      run: () => context.saveDocument()
    },
    {
      id: 'open-settings',
      title: '打开设置',
      category: '应用',
      hint: 'Settings',
      keywords: ['settings', 'preferences', '设置'],
      enabled: () => true,
      run: () => context.openSettings()
    }
  ]
}

export function commandQuery(raw: string): string {
  return raw.startsWith('>') ? raw.slice(1).trim() : raw.trim()
}

export function isCommandMode(raw: string): boolean {
  return raw.startsWith('>')
}

export function filterPaletteCommands(
  commands: readonly PaletteCommand[],
  rawQuery: string
): PaletteCommand[] {
  const query = commandQuery(rawQuery).toLowerCase()
  if (!query) return [...commands]
  return commands.filter((command) => {
    const haystack = [command.title, command.category, command.hint, command.id, ...command.keywords]
      .join(' ')
      .toLowerCase()
    return matchesQuery(haystack, query)
  })
}

export function matchesQuery(haystack: string, query: string): boolean {
  if (!query) return true
  if (haystack.includes(query)) return true
  let index = 0
  for (const character of haystack) {
    if (character === query[index]) index += 1
    if (index >= query.length) return true
  }
  return false
}
