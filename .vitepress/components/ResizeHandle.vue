<template>
  <div class="resize-handle">
    <div class="left-area"></div>
    <div class="right-area">
      <div
        v-if="
          (viewMode === 'folder' || viewMode === 'mindmap') &&
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
import type { RootItem } from './composables/useNavigator'
import { formatTimestamp } from './utils/helpers'

defineProps<{
  activeSidebarItem: RootItem | null
  isCompact: boolean
  viewMode: 'folder' | 'search' | 'mindmap'
}>()
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
</style>
