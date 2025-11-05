<template>
  <div class="sidebar-item" :class="{ active: isActive }" @click="onClick">
    <div class="folder-icon">
      <img v-if="item.icon?.src" :src="item.icon.src" :alt="item.title" />
      <div v-else class="default-folder-icon">📁</div>
    </div>
    <div v-if="!isCompact" class="folder-name">
      {{ item.title || repoKey }}（{{ item.completed_notes_count }}）
    </div>
  </div>
</template>

<script setup lang="ts">
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
</style>
