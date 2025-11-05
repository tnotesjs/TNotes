<template>
  <div class="global-search-view">
    <div class="search-header">
      <input
        v-model="localSearchQuery"
        type="text"
        class="search-input"
        placeholder="搜索所有知识库..."
        @input="onSearch"
      />
      <button v-if="localSearchQuery" class="clear-btn" @click="clearSearch">
        ✕
      </button>
    </div>

    <div v-if="!localSearchQuery" class="empty-state">
      <p>输入关键词搜索所有知识库的内容</p>
    </div>

    <div v-else-if="searchResults.length === 0" class="empty-state">
      <p>未找到匹配的结果</p>
    </div>

    <div v-else class="search-results">
      <div class="results-summary">
        找到 {{ totalCount }} 个结果（{{ searchResults.length }} 个知识库）
      </div>

      <div
        v-for="result in searchResults"
        :key="result.repoKey"
        class="result-group"
      >
        <div class="repo-header">
          <h3 class="repo-title">{{ result.repoTitle }}</h3>
          <span class="result-count">{{ result.items.length }} 个结果</span>
        </div>

        <div class="result-items">
          <a
            v-for="(item, index) in result.items"
            :key="index"
            :href="item.link"
            class="result-item"
          >
            <span class="item-text">{{ item.text }}</span>
            <span v-if="item.path" class="item-path">{{ item.path }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface SearchResultItem {
  text: string
  link: string
  path?: string
}

interface SearchResultGroup {
  repoKey: string
  repoTitle: string
  items: SearchResultItem[]
}

const props = defineProps<{
  searchQuery: string
  rootData: any
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
}>()

const localSearchQuery = ref(props.searchQuery)

// 递归搜索侧边栏项
const searchInItems = (
  items: any[],
  query: string,
  parentPath: string = ''
): SearchResultItem[] => {
  const results: SearchResultItem[] = []
  const searchLower = query.toLowerCase()

  for (const item of items) {
    const currentPath = parentPath
      ? `${parentPath} > ${item.text}`
      : item.text

    // 检查当前项是否匹配
    if (item.text?.toLowerCase().includes(searchLower)) {
      results.push({
        text: item.text,
        link: item.link || '',
        path: parentPath || undefined,
      })
    }

    // 递归搜索子项
    if (item.items && item.items.length > 0) {
      const childResults = searchInItems(item.items, query, currentPath)
      results.push(...childResults)
    }
  }

  return results
}

// 搜索结果
const searchResults = computed<SearchResultGroup[]>(() => {
  if (!localSearchQuery.value) return []

  const results: SearchResultGroup[] = []

  // 遍历所有知识库
  for (const [repoKey, repoItem] of Object.entries(
    props.rootData.config.root_items
  ) as [string, any][]) {
    if (repoItem.is_visible_in_root_folder === false) continue

    const sidebar = props.rootData.sidebars[repoKey]
    if (!sidebar) continue

    const items = searchInItems(sidebar, localSearchQuery.value)

    if (items.length > 0) {
      results.push({
        repoKey,
        repoTitle: repoItem.title || repoKey,
        items,
      })
    }
  }

  // 按结果数量降序排序
  return results.sort((a, b) => b.items.length - a.items.length)
})

// 总结果数
const totalCount = computed(() => {
  return searchResults.value.reduce((sum, group) => sum + group.items.length, 0)
})

const onSearch = () => {
  emit('update:searchQuery', localSearchQuery.value)
}

const clearSearch = () => {
  localSearchQuery.value = ''
  emit('update:searchQuery', '')
}

watch(
  () => props.searchQuery,
  (newVal) => {
    localSearchQuery.value = newVal
  }
)
</script>

<style scoped>
.global-search-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vp-c-bg);
  overflow: hidden;
}

.search-header {
  position: relative;
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  font-size: 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
}

.clear-btn {
  position: absolute;
  right: 1.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 16px;
}

.clear-btn:hover {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--vp-c-text-2);
  font-size: 16px;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.results-summary {
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.result-group {
  margin-bottom: 2rem;
}

.repo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.repo-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.result-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  padding: 4px 10px;
  border-radius: 12px;
}

.result-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 6px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
  border: 1px solid transparent;
}

.result-item:hover {
  background-color: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
  transform: translateX(4px);
}

.item-text {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-path {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .search-header {
    padding: 0.75rem;
  }

  .search-input {
    font-size: 14px;
    padding: 8px 36px 8px 12px;
  }

  .search-results {
    padding: 0.75rem;
  }

  .repo-title {
    font-size: 16px;
  }

  .result-item {
    padding: 0.6rem 0.8rem;
  }

  .item-text {
    font-size: 14px;
  }
}
</style>
