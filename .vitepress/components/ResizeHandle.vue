<template>
  <div class="resize-handle">
    <div v-if="viewMode === 'folder'" class="left-area">
      <select
        v-model="localSortOption"
        class="sort-select"
        @change="$emit('update:sortOption', localSortOption)"
      >
        <option value="name-asc">按名称升序</option>
        <option value="name-desc">按名称降序</option>
        <option value="count-asc">按笔记完成数量升序</option>
        <option value="count-desc">按笔记完成数量降序</option>
        <option value="updated-asc">按更新时间升序</option>
        <option value="updated-desc">按更新时间降序</option>
        <option value="created-asc">按创建时间升序</option>
        <option value="created-desc">按创建时间降序</option>
      </select>
    </div>
    <div class="right-area">
      <div
        v-if="
          viewMode === 'folder' &&
          activeSidebarItem &&
          activeSidebarItem.created_at
        "
        class="date-info"
      >
        <span class="resize-meta-item" v-if="!isCompact">
          创建: {{ formatTimestamp(activeSidebarItem.created_at) }}
        </span>
        <span class="resize-meta-item" v-if="!isCompact">
          更新: {{ formatTimestamp(activeSidebarItem.updated_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RootItem, SortOption } from './composables/useNavigator'
import { formatTimestamp } from './utils/helpers'

const props = defineProps<{
  sortOption: SortOption
  activeSidebarItem: RootItem | null
  isCompact: boolean
  viewMode: 'folder' | 'search' | 'mindmap'
}>()

const emit = defineEmits<{
  'update:sortOption': [value: SortOption]
}>()

const localSortOption = ref(props.sortOption)

watch(
  () => props.sortOption,
  (newVal) => {
    localSortOption.value = newVal
  }
)
</script>

<style scoped>
.resize-handle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  background-color: var(--vp-c-divider);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.left-area {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dir-input {
  font-size: 12px;
  padding: 2px 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  width: 150px;
}

.dir-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.sort-select {
  font-size: 12px;
  padding: 2px 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.sort-select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.right-area {
  display: flex;
  align-items: center;
}

.date-info {
  display: flex;
  gap: 15px;
  font-size: 12px;
  margin-right: 15px;
  color: var(--vp-c-text-2);
}

.resize-meta-item {
  display: flex;
  align-items: center;
  line-height: 1.5;
}

.height-input {
  width: 60px;
  height: 20px;
  font-size: 12px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.height-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}
</style>
