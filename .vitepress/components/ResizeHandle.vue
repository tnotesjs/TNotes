<template>
  <div class="resize-handle" @mousedown="$emit('mousedown', $event)">
    <div class="left-area">
      <input
        v-if="!isCompact"
        v-model="localTnotesDir"
        type="text"
        class="dir-input"
        placeholder="知识库所在目录路径"
        @input="$emit('update:tnotesDir', localTnotesDir)"
      />
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
        class="date-info"
        v-if="activeSidebarItem && activeSidebarItem.created_at"
      >
        <span class="resize-meta-item" v-if="!isCompact">
          创建: {{ formatTimestamp(activeSidebarItem.created_at) }}
        </span>
        <span class="resize-meta-item" v-if="!isCompact">
          更新: {{ formatTimestamp(activeSidebarItem.updated_at) }}
        </span>
      </div>
      <input
        v-model.number="localHeight"
        type="number"
        class="height-input"
        @change="$emit('height-change')"
        min="500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RootItem, SortOption } from './composables/useNavigator'
import { formatTimestamp } from './utils/helpers'

const props = defineProps<{
  containerHeight: number
  sortOption: SortOption
  tnotesDir: string
  activeSidebarItem: RootItem | null
  isCompact: boolean
}>()

const emit = defineEmits<{
  mousedown: [e: MouseEvent]
  'height-change': []
  'update:sortOption': [value: SortOption]
  'update:tnotesDir': [value: string]
}>()

const localHeight = ref(props.containerHeight)
const localSortOption = ref(props.sortOption)
const localTnotesDir = ref(props.tnotesDir)

watch(
  () => props.containerHeight,
  (newVal) => {
    localHeight.value = newVal
  }
)

watch(
  () => props.sortOption,
  (newVal) => {
    localSortOption.value = newVal
  }
)

watch(
  () => props.tnotesDir,
  (newVal) => {
    localTnotesDir.value = newVal
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
  cursor: ns-resize;
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
