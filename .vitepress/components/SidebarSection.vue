<template>
  <div class="sidebar-section">
    <div class="section-header" @click="$emit('toggle')">
      <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
      <span class="section-title">{{ section.text }}</span>
    </div>

    <div v-show="!collapsed" class="section-items">
      <SidebarItemContent
        v-for="(item, index) in section.items"
        :key="index"
        :item="item"
        :tnotes-dir="tnotesDir"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarItemContent from './SidebarItemContent.vue'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
}

interface SidebarSection {
  text: string
  collapsed?: boolean
  items: SidebarItem[]
}

defineProps<{
  section: SidebarSection
  collapsed: boolean
  tnotesDir: string
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.sidebar-section {
  margin-bottom: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: var(--vp-c-bg-soft);
  cursor: pointer;
  font-weight: 500;
}

.collapse-icon {
  margin-right: 8px;
  font-size: 12px;
}

.section-items {
  padding: 10px 0;
  background-color: var(--vp-c-bg);
}
</style>
