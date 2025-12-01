<template>
  <div class="sidebar-item" :class="{ active: isActive }" @click="onClick">
    <div class="folder-icon">
      <img v-if="item.icon?.src" :src="item.icon.src" :alt="item.title" />
      <div v-else class="default-folder-icon">📁</div>
    </div>
    <div v-if="!isCompact" class="folder-name">
      {{ item.title || repoKey }}（{{ currentMonthCount
      }}<span
        v-if="monthIncrement !== 0"
        :style="{ color: monthIncrement > 0 ? '#10b981' : '#ef4444' }"
        class="increments"
      >
        {{ monthIncrement > 0 ? '+' : '' }}{{ monthIncrement }}</span
      >）
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RootItem } from './composables/useNavigator'

const props = defineProps<{
  repoKey: string
  item: RootItem
  isActive: boolean
  isCompact: boolean
}>()

const emit = defineEmits<{
  select: [key: string]
}>()

const onClick = () => {
  emit('select', props.repoKey)
}

// 获取当前月份的笔记数
const currentMonthCount = computed(() => {
  const { completed_notes_count } = props.item

  if (!completed_notes_count) return 0

  // 兼容旧格式（number 类型）
  if (typeof completed_notes_count === 'number') {
    return completed_notes_count
  }

  // 新格式：从当前月份读取
  const now = new Date()
  const year = now.getFullYear().toString().slice(2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const currentKey = `${year}.${month}`

  return completed_notes_count[currentKey] || 0
})

// 计算当月增量
const monthIncrement = computed(() => {
  const { completed_notes_count } = props.item

  if (!completed_notes_count || typeof completed_notes_count === 'number') {
    return 0
  }

  const now = new Date()
  const year = now.getFullYear().toString().slice(2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const currentKey = `${year}.${month}`

  // 上个月
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevYear = prevDate.getFullYear().toString().slice(2)
  const prevMonth = (prevDate.getMonth() + 1).toString().padStart(2, '0')
  const prevKey = `${prevYear}.${prevMonth}`

  const currentCount = completed_notes_count[currentKey] || 0
  const prevCount = completed_notes_count[prevKey] || 0

  return currentCount - prevCount
})
</script>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #646cff22;
}

.sidebar-item.active {
  background-color: #646cff88;
  color: white;
}

.folder-icon {
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.folder-icon img {
  width: 20px;
  height: 20px;
}

.default-folder-icon {
  font-size: 18px;
}

.folder-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.increments {
  font-size: 12px;
  margin-left: 2px;
}
</style>
