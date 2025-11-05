<template>
  <div class="view-switcher">
    <button
      class="view-btn"
      :class="{ active: modelValue === 'folder' }"
      title="文件夹视图"
      @click="$emit('update:modelValue', 'folder')"
    >
      <img :src="icon__folder" alt="Folder View" />
    </button>
    <button
      class="view-btn"
      :class="{ active: modelValue === 'search' }"
      title="全局搜索视图"
      @click="$emit('update:modelValue', 'search')"
    >
      <img :src="icon__search" alt="Search View" />
    </button>
    <button
      class="view-btn"
      :class="{ active: modelValue === 'mindmap' }"
      title="思维导图视图"
      @click="$emit('update:modelValue', 'mindmap')"
    >
      <img :src="icon__mindmap" alt="Mind Map View" />
    </button>
  </div>
</template>

<script setup lang="ts">
import icon__folder from './icon__folder.svg'
import icon__mindmap from './icon__mindmap.svg'
import icon__search from './icon__search.svg'

defineProps<{
  modelValue: 'folder' | 'search' | 'mindmap'
}>()

defineEmits<{
  'update:modelValue': [value: 'folder' | 'search' | 'mindmap']
}>()
</script>

<style scoped>
.view-switcher {
  display: flex;
  gap: 8px;
  padding: 10px 15px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s;
  padding: 6px;
}

.view-btn:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-alt);
}

.view-btn.active {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-brand-soft);
}

.view-btn img {
  width: 20px;
  height: 20px;
  display: block;
}

@media (max-width: 768px) {
  .view-switcher {
    padding: 8px 10px;
  }

  .view-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
