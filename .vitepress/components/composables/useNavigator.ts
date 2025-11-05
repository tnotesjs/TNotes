import { computed, ref, watch } from 'vue'

export interface RootItem {
  icon?: { src: string }
  title: string
  completed_notes_count: number
  details: string
  link: string
  created_at?: number
  updated_at?: number
  is_visible_in_root_folder?: boolean
}

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'count-asc'
  | 'count-desc'
  | 'updated-asc'
  | 'updated-desc'
  | 'created-asc'
  | 'created-desc'

export function useNavigator(rootData: any) {
  // 状态
  const activeKey = ref<string | null>(null)
  const sortOption = ref<SortOption>('updated-desc')
  const tnotesDir = ref('')
  const searchQuery = ref('')
  const sectionStates = ref<Record<number, boolean>>({})

  // 计算属性：过滤和排序后的知识库列表
  const sortedRootItems = computed(() => {
    const visibleItems = Object.entries(
      rootData.config.root_items as Record<string, RootItem>
    ).filter(([_, item]) => item.is_visible_in_root_folder !== false)

    // 搜索过滤
    const filteredItems = searchQuery.value
      ? visibleItems.filter(([key, item]) => {
          const searchLower = searchQuery.value.toLowerCase()
          return (
            key.toLowerCase().includes(searchLower) ||
            item.title?.toLowerCase().includes(searchLower) ||
            item.details?.toLowerCase().includes(searchLower)
          )
        })
      : visibleItems

    // 排序
    return filteredItems.sort((a, b) => {
      switch (sortOption.value) {
        case 'name-asc':
          return (a[1].title || a[0]).localeCompare(b[1].title || b[0])
        case 'name-desc':
          return (b[1].title || b[0]).localeCompare(a[1].title || a[0])
        case 'count-asc':
          return (
            (a[1].completed_notes_count || 0) -
            (b[1].completed_notes_count || 0)
          )
        case 'count-desc':
          return (
            (b[1].completed_notes_count || 0) -
            (a[1].completed_notes_count || 0)
          )
        case 'updated-asc':
          return (a[1].updated_at || 0) - (b[1].updated_at || 0)
        case 'updated-desc':
          return (b[1].updated_at || 0) - (a[1].updated_at || 0)
        case 'created-asc':
          return (a[1].created_at || 0) - (b[1].created_at || 0)
        case 'created-desc':
          return (b[1].created_at || 0) - (a[1].created_at || 0)
        default:
          return (a[1].title || a[0]).localeCompare(b[1].title || b[0])
      }
    })
  })

  // 当前选中的侧边栏数据
  const activeSidebar = computed(() => {
    if (!activeKey.value) return null
    return rootData.sidebars[activeKey.value]
  })

  // 当前选中的知识库信息
  const activeSidebarItem = computed(() => {
    if (!activeKey.value) return null
    return rootData.config.root_items[activeKey.value] as RootItem
  })

  // 是否所有section都已折叠
  const allCollapsed = computed(() => {
    if (!activeSidebar.value) return true
    return activeSidebar.value.every(
      (_: any, index: number) => sectionStates.value[index] === true
    )
  })

  // 方法
  const selectSidebar = (key: string) => {
    activeKey.value = key
  }

  const toggleSection = (index: number) => {
    sectionStates.value[index] = !sectionStates.value[index]
  }

  const toggleAllSections = () => {
    if (!activeSidebar.value) return
    const targetState = !allCollapsed.value
    activeSidebar.value.forEach((_: any, index: number) => {
      sectionStates.value[index] = targetState
    })
  }

  const getSectionState = (index: number) => {
    return sectionStates.value[index] ?? false
  }

  const setDefaultActiveKey = () => {
    if (sortedRootItems.value.length > 0) {
      activeKey.value = sortedRootItems.value[0][0]
    }
  }

  // 监听器
  watch(
    activeSidebar,
    () => {
      sectionStates.value = {}
    },
    { immediate: true }
  )

  watch(sortOption, (newVal) => {
    localStorage.setItem('knowledge-navigator-sort-option', newVal)
    setDefaultActiveKey()
  })

  watch(tnotesDir, (newVal) => {
    if (newVal) {
      localStorage.setItem('tnotes-dir', newVal)
    } else {
      localStorage.removeItem('tnotes-dir')
    }
  })

  return {
    activeKey,
    sortOption,
    tnotesDir,
    searchQuery,
    sectionStates,
    sortedRootItems,
    activeSidebar,
    activeSidebarItem,
    allCollapsed,
    selectSidebar,
    toggleSection,
    toggleAllSections,
    getSectionState,
    setDefaultActiveKey,
  }
}
