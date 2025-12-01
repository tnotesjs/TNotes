<template>
  <div
    class="knowledge-navigator-container"
    :class="{ 'is-fullscreen': isFullscreen }"
    :style="!isFullscreen ? { height: containerHeight + 'px' } : {}"
  >
    <!-- 导航头部 -->
    <div class="navigator-header">
      <ViewSwitcher v-model="viewMode" />
      <SearchBar
        v-if="viewMode === 'folder'"
        v-model="searchQuery"
        placeholder="搜索「当前知识库」..."
      />
      <SearchBar
        v-else-if="viewMode === 'search'"
        v-model="searchQuery"
        placeholder="搜索「所有知识库」..."
      />
      <!-- 思维导图视图占位，保持高度一致 -->
      <div v-else class="search-placeholder"></div>

      <!-- 全屏切换按钮 -->
      <button
        class="fullscreen-btn"
        :title="isFullscreen ? '退出全屏' : '全屏显示'"
        @click="toggleFullscreen"
      >
        <img
          :src="isFullscreen ? icon__fullscreen_exit : icon__fullscreen"
          alt="Fullscreen"
        />
      </button>

      <!-- 设置按钮 -->
      <button class="settings-btn" title="设置" @click="showSettings = true">
        <img :src="icon__setting" alt="Settings" />
      </button>
    </div>

    <!-- 左侧知识库列表 -->
    <SidebarList
      v-if="viewMode !== 'search'"
      :sorted-items="sortedRootItems"
      :active-key="activeKey"
      :is-compact="isCompact"
      :total-count="totalNotesCount"
      @select="selectSidebar"
    />

    <!-- 右侧内容区 -->
    <div class="content-area">
      <!-- 文件夹视图 -->
      <div
        v-if="viewMode === 'folder' && activeSidebar && activeSidebarItem"
        class="sidebar-content"
      >
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

      <!-- 全局搜索视图 -->
      <GlobalSearchView
        v-else-if="viewMode === 'search'"
        :search-query="searchQuery"
        :root-data="rootData"
      />

      <!-- 思维导图视图 -->
      <MindMapView
        v-else-if="viewMode === 'mindmap'"
        :active-sidebar="activeSidebar"
        :active-sidebar-item="activeSidebarItem"
      />

      <div v-else class="empty-content">请选择一个知识库查看内容</div>
    </div>

    <ResizeHandle
      :active-sidebar-item="activeSidebarItem"
      :is-compact="isCompact"
      :view-mode="viewMode"
    />

    <!-- 设置对话框 -->
    <SettingsDialog
      v-model="showSettings"
      v-model:container-height="containerHeight"
      v-model:tnotes-dir="tnotesDir"
      v-model:sort-option="sortOption"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useNavigator } from './composables/useNavigator'
import { useResponsive } from './composables/useResponsive'
import GlobalSearchView from './GlobalSearchView.vue'
import MindMapView from './MindMapView.vue'
import RepoInfo from './RepoInfo.vue'
import ResizeHandle from './ResizeHandle.vue'
import { data as rootData } from './root.data'
import SearchBar from './SearchBar.vue'
import SettingsDialog from './SettingsDialog.vue'
import SidebarList from './SidebarList.vue'
import SidebarSection from './SidebarSection.vue'
import ViewSwitcher from './ViewSwitcher.vue'
import icon__fullscreen from '/icon__fullscreen.svg'
import icon__fullscreen_exit from '/icon__fullscreen_exit.svg'
import icon__setting from '/icon__setting.svg'

const showSettings = ref(false)
const containerHeight = ref(800)
const isFullscreen = ref(false)

const {
  activeKey,
  sortOption,
  tnotesDir,
  searchQuery,
  viewMode,
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

const { isCompact } = useResponsive()

// 获取当前月份的总笔记数
const totalNotesCount = computed(() => {
  const { completed_notes_count } = rootData.config.statistic

  if (!completed_notes_count) return 0

  // 错误数据处理（如果是字符串）
  if (typeof completed_notes_count === 'string') {
    console.warn('completed_notes_count 数据格式错误，请重新运行 pnpm tn:build')
    return 0
  }

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

// 切换全屏状态
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  localStorage.setItem(
    'knowledge-navigator-fullscreen',
    isFullscreen.value.toString()
  )
}

// 保存容器高度到 localStorage
watch(containerHeight, (newVal) => {
  localStorage.setItem('knowledge-navigator-height', newVal.toString())
})

onMounted(() => {
  // 从 localStorage 读取容器高度
  const savedHeight = localStorage.getItem('knowledge-navigator-height')
  if (savedHeight) {
    const height = parseInt(savedHeight)
    if (!isNaN(height) && height >= 500) {
      containerHeight.value = height
    }
  }

  const savedSortOption = localStorage.getItem(
    'knowledge-navigator-sort-option'
  )
  if (savedSortOption) sortOption.value = savedSortOption as any

  const savedTnotesDir = localStorage.getItem('tnotes-dir')
  if (savedTnotesDir) tnotesDir.value = savedTnotesDir

  const savedViewMode = localStorage.getItem('knowledge-navigator-view-mode')
  if (
    savedViewMode === 'folder' ||
    savedViewMode === 'search' ||
    savedViewMode === 'mindmap'
  ) {
    viewMode.value = savedViewMode as any
  }

  const savedFullscreen = localStorage.getItem('knowledge-navigator-fullscreen')
  if (savedFullscreen === 'true') {
    isFullscreen.value = true
  }

  setDefaultActiveKey()
})
</script>

<style scoped>
.knowledge-navigator-container {
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--vp-c-bg);
  position: relative;
  overflow: hidden;
}

/* 全屏模式 */
.knowledge-navigator-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  margin: 0;
}

.navigator-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  flex-wrap: wrap;
  min-height: 63px;
  box-sizing: border-box;
}

.navigator-header :deep(.search-bar) {
  flex: 1;
  min-width: 200px;
  padding: 0;
  border-bottom: none;
}

.search-placeholder {
  flex: 1;
  min-width: 200px;
  /* 输入框高度：padding (8px + 8px) + border (1px + 1px) + line-height ≈ 34px */
  height: 34px;
}

.fullscreen-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
  opacity: 0.6;
  flex-shrink: 0;
}

.fullscreen-btn:hover {
  background-color: var(--vp-c-bg-soft);
  opacity: 1;
}

.fullscreen-btn img {
  width: 20px;
  height: 20px;
  display: block;
}

.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
  opacity: 0.6;
  flex-shrink: 0;
}

.settings-btn:hover {
  background-color: var(--vp-c-bg-soft);
  opacity: 1;
}

.settings-btn img {
  width: 20px;
  height: 20px;
  display: block;
}

.knowledge-navigator-container > .sidebar-list {
  display: none;
}

.knowledge-navigator-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
}

/* 全局搜索时单列布局 */
.knowledge-navigator-container:has(.content-area .global-search-view) {
  grid-template-columns: 1fr;
}

.navigator-header {
  grid-column: 1 / -1;
  grid-row: 1;
}

.knowledge-navigator-container > .sidebar-list {
  display: flex;
  grid-column: 1;
  grid-row: 2;
}

.content-area {
  grid-column: 2;
  grid-row: 2;
  padding-left: 1rem;
  overflow: hidden;
  background-color: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
}

/* 全局搜索时内容区占满宽度 */
.knowledge-navigator-container:has(.content-area .global-search-view)
  .content-area {
  grid-column: 1;
  padding-left: 0;
  padding: 0 1rem;
}

.content-area .sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.content-area :deep(.mindmap-view) {
  flex: 1;
  overflow: hidden;
}

.knowledge-navigator-container > .resize-handle {
  grid-column: 1 / -1;
  grid-row: 3;
}

.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  color: var(--vp-c-text-2);
  font-size: 16px;
}

@media (max-width: 768px) {
  .navigator-header {
    padding: 8px 10px;
    gap: 8px;
  }

  .navigator-header :deep(.search-bar) {
    min-width: 150px;
  }

  .search-placeholder {
    min-width: 150px;
    /* 移动端输入框高度：padding (6px + 6px) + border (1px + 1px) + line-height ≈ 30px */
    height: 30px;
  }

  .navigator-header :deep(.search-input) {
    font-size: 13px;
    padding: 6px 28px 6px 10px;
  }
}
</style>
