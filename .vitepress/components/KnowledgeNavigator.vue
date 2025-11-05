<template>
  <div
    class="knowledge-navigator-container"
    :style="{ height: containerHeight + 'px' }"
  >
    <SidebarList
      :sorted-items="sortedRootItems"
      :active-key="activeKey"
      :is-compact="isCompact"
      :total-count="rootData.config.statistic.completed_notes_count"
      v-model:search-query="searchQuery"
      @select="selectSidebar"
    />

    <div class="content-area">
      <div v-if="activeSidebar && activeSidebarItem" class="sidebar-content">
        <RepoInfo
          :item="activeSidebarItem"
          :tnotes-dir="tnotesDir"
          :all-collapsed="allCollapsed"
          @toggle-all="toggleAllSections"
        />

        <SidebarSection
          v-for="(section, index) in activeSidebar"
          :key="index"
          :section="section"
          :collapsed="getSectionState(index)"
          :tnotes-dir="tnotesDir"
          @toggle="toggleSection(index)"
        />
      </div>

      <div v-else class="empty-content">请选择一个知识库查看内容</div>
    </div>

    <ResizeHandle
      v-model:container-height="containerHeight"
      v-model:sort-option="sortOption"
      v-model:tnotes-dir="tnotesDir"
      :active-sidebar-item="activeSidebarItem"
      :is-compact="isCompact"
      @mousedown="startResize"
      @height-change="onHeightChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useContainerHeight } from './composables/useContainerHeight'
import { useResponsive } from './composables/useResponsive'
import { useNavigator } from './composables/useNavigator'
import RepoInfo from './RepoInfo.vue'
import ResizeHandle from './ResizeHandle.vue'
import { data as rootData } from './root.data'
import SidebarList from './SidebarList.vue'
import SidebarSection from './SidebarSection.vue'

const {
  activeKey,
  sortOption,
  tnotesDir,
  searchQuery,
  sortedRootItems,
  activeSidebar,
  activeSidebarItem,
  allCollapsed,
  selectSidebar,
  toggleSection,
  toggleAllSections,
  getSectionState,
  setDefaultActiveKey,
} = useNavigator(rootData)

const { containerHeight, startResize, onHeightChange } = useContainerHeight()
const { isCompact } = useResponsive()

onMounted(() => {
  const savedSortOption = localStorage.getItem(
    'knowledge-navigator-sort-option'
  )
  if (savedSortOption) sortOption.value = savedSortOption as any

  const savedTnotesDir = localStorage.getItem('tnotes-dir')
  if (savedTnotesDir) tnotesDir.value = savedTnotesDir

  setDefaultActiveKey()
})
</script>

<style scoped>
.knowledge-navigator-container {
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--vp-c-bg);
  position: relative;
  resize: both;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding-left: 1rem;
  overflow-y: auto;
  background-color: var(--vp-c-bg);
}

.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  color: var(--vp-c-text-2);
  font-size: 16px;
}
</style>
