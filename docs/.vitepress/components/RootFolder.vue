<template>
  <div
    class="root-folder-container"
    :style="{ height: containerHeight + 'px' }"
  >
    <!-- 左侧知识库列表 -->
    <div class="sidebar-list" :class="{ compact: isCompact }">
      <div class="sidebar-header">
        <!-- 统计数据 -->
        <div class="statistics">
          <div class="stat-item" title="已完成笔记数量">
            <span class="stat-number">{{
              rootData.config.statistic.completed_notes_count
            }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-items-container">
        <div
          v-for="([key, item], index) in sortedRootItems"
          :key="key"
          class="sidebar-item"
          :class="{ active: activeKey === key }"
          @click="selectSidebar(key)"
        >
          <div class="folder-icon">
            <img v-if="item.icon?.src" :src="item.icon.src" :alt="item.title" />
            <div v-else class="default-folder-icon">📁</div>
          </div>
          <div v-if="!isCompact" class="folder-name">
            {{ item.title || key }}（{{ item.completed_notes_count }}）
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content-area">
      <div v-if="activeSidebar && activeSidebarItem" class="sidebar-content">
        <!-- 知识库基本信息 -->
        <div class="repo-info">
          <div class="repo-header">
            <h2 title="知识库的在线访问链接">
              <a :href="activeSidebarItem.link" target="_blank"
                >TNotes.{{ activeSidebarItem.title }}</a
              >
            </h2>
            <p class="repo-details">{{ activeSidebarItem.details }}</p>
          </div>

          <div class="repo-actions">
            <a
              v-if="tnotesDir !== ''"
              title="打开知识库文件夹"
              target="_blank"
              :href="
                'vscode://file/' +
                tnotesDir +
                '/' +
                'TNotes.' +
                activeSidebarItem.title
              "
            >
              <img :src="icon__vscode" alt="VS Code" class="repo-action-icon" />
            </a>

            <a
              title="打开知识库仓库"
              target="_blank"
              :href="
                'https://github.com/tnotesjs/TNotes.' + activeSidebarItem.title
              "
              ><img :src="icon__github" alt="GitHub" class="repo-action-icon"
            /></a>
            <img
              :title="allCollapsed ? '全部展开' : '全部折叠'"
              :src="icon__fold"
              alt="Fold"
              class="repo-action-icon"
              @click="toggleAllSections"
            />
          </div>
        </div>

        <div
          v-for="(section, index) in activeSidebar"
          :key="index"
          class="sidebar-section"
        >
          <div class="section-header" @click="toggleSection(index)">
            <span class="collapse-icon">
              {{ getSectionState(index) ? '▶' : '▼' }}
            </span>
            <span class="section-title">{{ section.text }}</span>
          </div>

          <!-- TODO：递归渲染优化 -->
          <div v-show="!getSectionState(index)" class="section-items">
            <div
              v-for="(item, itemIndex) in section.items"
              :key="itemIndex"
              class="section-item"
            >
              <!-- 第一级项目 -->
              <div class="level-1">
                <a :href="item.link" target="_blank" class="item-link">{{
                  item.text
                }}</a>
                <a
                  v-if="item.link && tnotesDir"
                  title="打开笔记文件夹"
                  :href="
                    'vscode://file/' +
                    tnotesDir +
                    '/' +
                    item.link
                      .replace('https://tnotesjs.github.io/', '')
                      .replace('/README', '')
                  "
                  target="_blank"
                >
                  <img
                    :src="icon__vscode"
                    alt="VS Code"
                    class="repo-action-icon"
                  />
                </a>
              </div>

              <!-- 第二级项目 -->
              <div
                v-if="item.items && item.items.length"
                class="level-2-container"
              >
                <div
                  v-for="(subItem, subIndex) in item.items"
                  :key="subIndex"
                  class="level-2"
                >
                  <div class="level-2-content">
                    <a :href="subItem.link" target="_blank" class="item-link">{{
                      subItem.text
                    }}</a>
                    <a
                      v-if="subItem.link && tnotesDir"
                      title="打开笔记文件夹"
                      :href="
                        'vscode://file/' +
                        tnotesDir +
                        '/' +
                        subItem.link
                          .replace('https://tnotesjs.github.io/', '')
                          .replace('/README', '')
                      "
                      target="_blank"
                    >
                      <img
                        :src="icon__vscode"
                        alt="VS Code"
                        class="repo-action-icon"
                      />
                    </a>
                  </div>

                  <!-- 第三级项目 -->
                  <div
                    v-if="subItem.items && subItem.items.length"
                    class="level-3-container"
                  >
                    <div
                      v-for="(subSubItem, subSubIndex) in subItem.items"
                      :key="subSubIndex"
                      class="level-3"
                    >
                      <div class="level-3-content">
                        <a
                          :href="subSubItem.link"
                          class="item-link"
                          target="_blank"
                          >{{ subSubItem.text }}</a
                        >
                        <a
                          v-if="subSubItem.link && tnotesDir"
                          title="打开笔记文件夹"
                          :href="
                            'vscode://file/' +
                            tnotesDir +
                            '/' +
                            subSubItem.link
                              .replace('https://tnotesjs.github.io/', '')
                              .replace('/README', '')
                          "
                          target="_blank"
                        >
                          <img
                            :src="icon__vscode"
                            alt="VS Code"
                            class="repo-action-icon"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-content">请选择一个知识库查看内容</div>
    </div>

    <!-- 可拖拽调整高度的分割线 -->
    <div class="resize-handle" @mousedown="startResize">
      <div class="left-area">
        <input
          v-if="!isCompact"
          type="text"
          v-model="tnotesDir"
          class="dir-input"
          placeholder="知识库所在目录路径"
        />
        <select v-model="sortOption" class="sort-select">
          <option value="count-desc">按笔记完成数量降序</option>
          <option value="count-asc">按笔记完成数量升序</option>
          <option value="name-asc">按名称升序</option>
          <option value="name-desc">按名称降序</option>
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
          type="number"
          v-model.number="containerHeight"
          class="height-input"
          @change="onHeightChange"
          min="500"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import icon__fold from './icon__fold.svg'
import icon__github from './icon__github.svg'
import icon__vscode from './icon__vscode.svg'
import { data as rootData } from './root.data.js'

// 当前选中的知识库key
const activeKey = ref(null)

// 排序选项 - 默认按照笔记完成数量降序
const sortOption = ref('count-desc')

// 知识库所在目录
const tnotesDir = ref('')

// 各个section的展开状态
const sectionStates = ref({})

// 容器高度相关
const DEFAULT_HEIGHT = 1000
const MIN_HEIGHT = 500
const containerHeight = ref(DEFAULT_HEIGHT)
let isResizing = false
let startY = 0
let startHeight = 0
let resizeTimeout = null

// 响应式状态
const isCompact = ref(false)
let resizeObserver = null

// 计算属性：获取排序后的root_items，过滤掉不可见的项目
const sortedRootItems = computed(() => {
  // 先过滤掉 is_visible_in_root_folder 为 false 的项目
  const visibleItems = Object.entries(rootData.config.root_items).filter(
    ([key, item]) => item.is_visible_in_root_folder !== false
  )

  // 根据排序选项进行排序
  switch (sortOption.value) {
    case 'name-asc':
      return visibleItems.sort((a, b) => {
        const nameA = a[1].title || a[0]
        const nameB = b[1].title || b[0]
        return nameA.localeCompare(nameB)
      })
    case 'name-desc':
      return visibleItems.sort((a, b) => {
        const nameA = a[1].title || a[0]
        const nameB = b[1].title || b[0]
        return nameB.localeCompare(nameA)
      })
    case 'count-asc':
      return visibleItems.sort(
        (a, b) =>
          (a[1].completed_notes_count || 0) - (b[1].completed_notes_count || 0)
      )
    case 'count-desc':
      return visibleItems.sort(
        (a, b) =>
          (b[1].completed_notes_count || 0) - (a[1].completed_notes_count || 0)
      )
    case 'updated-asc':
      return visibleItems.sort(
        (a, b) => (a[1].updated_at || 0) - (b[1].updated_at || 0)
      )
    case 'updated-desc':
      return visibleItems.sort(
        (a, b) => (b[1].updated_at || 0) - (a[1].updated_at || 0)
      )
    case 'created-asc':
      return visibleItems.sort(
        (a, b) => (a[1].created_at || 0) - (b[1].created_at || 0)
      )
    case 'created-desc':
      return visibleItems.sort(
        (a, b) => (b[1].created_at || 0) - (a[1].created_at || 0)
      )
    default:
      // 默认按名称升序
      return visibleItems.sort((a, b) => {
        const nameA = a[1].title || a[0]
        const nameB = b[1].title || b[0]
        return nameA.localeCompare(nameB)
      })
  }
})

// 计算属性：获取当前选中的sidebar数据
const activeSidebar = computed(() => {
  if (!activeKey.value) return null
  return rootData.sidebars[activeKey.value]
})

// 计算属性：获取当前选中的sidebar项目信息
const activeSidebarItem = computed(() => {
  if (!activeKey.value) return null
  return rootData.config.root_items[activeKey.value]
})

// 计算属性：判断是否所有section都已折叠
const allCollapsed = computed(() => {
  if (!activeSidebar.value) return true

  // 检查是否所有section都处于折叠状态
  return activeSidebar.value.every(
    (_, index) => getSectionState(index) === true
  )
})

// 选择知识库
const selectSidebar = (key) => {
  activeKey.value = key
}

// 切换section展开/收起状态
const toggleSection = (index) => {
  sectionStates.value[index] = !getSectionState(index)
}

// 切换所有section的展开/收起状态
const toggleAllSections = () => {
  if (!activeSidebar.value) return

  // 如果所有section都已折叠，则全部展开；否则全部折叠
  const targetState = !allCollapsed.value

  // 设置所有section为相同状态
  activeSidebar.value.forEach((_, index) => {
    sectionStates.value[index] = targetState
  })
}

// 获取section状态（展开为false，收起为true）
const getSectionState = (index) => {
  return sectionStates.value[index] ?? false
}

// 格式化时间戳为 yyyy-mm-dd hh:mm:ss
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 默认选中第一个知识库（排序后的第一个）
const setDefaultActiveKey = () => {
  if (sortedRootItems.value.length > 0) {
    const firstKey = sortedRootItems.value[0][0]
    activeKey.value = firstKey
  }
}

// 检查容器宽度并设置响应式状态
const checkContainerWidth = () => {
  const container = document.querySelector('.root-folder-container')
  if (container) {
    isCompact.value = container.offsetWidth < 960
  }
}

// 从localStorage加载保存的高度
onMounted(() => {
  const savedHeight = localStorage.getItem('root-folder-container-height')
  if (savedHeight) {
    containerHeight.value = Math.max(parseInt(savedHeight), MIN_HEIGHT)
  }

  // 从localStorage加载保存的排序选项
  const savedSortOption = localStorage.getItem('root-folder-sort-option')
  if (savedSortOption) {
    sortOption.value = savedSortOption
  }

  // 从localStorage加载知识库目录路径
  const savedTnotesDir = localStorage.getItem('tnotes-dir')
  if (savedTnotesDir) {
    tnotesDir.value = savedTnotesDir
  }

  // 设置默认选中项
  setDefaultActiveKey()

  // 添加鼠标事件监听器
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)

  // 初始化响应式状态
  checkContainerWidth()

  // 创建 ResizeObserver 监听容器尺寸变化
  const container = document.querySelector('.root-folder-container')
  if (container) {
    resizeObserver = new ResizeObserver(checkContainerWidth)
    resizeObserver.observe(container)
  }
})

// 组件卸载前清理事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)

  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// 监听排序选项变化，保存到localStorage，并更新默认选中项
watch(sortOption, (newVal) => {
  localStorage.setItem('root-folder-sort-option', newVal)
  // 排序变化后更新默认选中项
  setDefaultActiveKey()
})

// 监听tnotesDir变化，保存到localStorage
watch(tnotesDir, (newVal) => {
  if (newVal) {
    localStorage.setItem('tnotes-dir', newVal)
  } else {
    localStorage.removeItem('tnotes-dir')
  }
})

// 监听activeSidebar变化，重置section状态
watch(
  activeSidebar,
  () => {
    sectionStates.value = {}
  },
  { immediate: true }
)

// 处理高度输入框变化
const onHeightChange = () => {
  // 确保高度不小于最小值
  containerHeight.value = Math.max(containerHeight.value, MIN_HEIGHT)

  // 保存到localStorage
  localStorage.setItem(
    'root-folder-container-height',
    Math.round(containerHeight.value)
  )
}

// 开始调整大小
const startResize = (e) => {
  // 如果点击的是输入框，不开始调整大小
  if (
    e.target.classList.contains('height-input') ||
    e.target.classList.contains('dir-input')
  ) {
    return
  }

  isResizing = true
  startY = e.clientY
  startHeight = containerHeight.value

  // 防止文本选择
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'ns-resize'
}

// 调整大小过程
const resize = (e) => {
  if (!isResizing) return

  const deltaY = e.clientY - startY
  const newHeight = startHeight + deltaY
  containerHeight.value = Math.max(newHeight, MIN_HEIGHT)

  // 防抖处理保存高度
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    localStorage.setItem(
      'root-folder-container-height',
      Math.round(containerHeight.value)
    )
  }, 300)
}

// 停止调整大小
const stopResize = () => {
  if (!isResizing) return

  isResizing = false

  // 恢复正常光标
  document.body.style.userSelect = ''
  document.body.style.cursor = ''

  // 立即保存最终高度
  clearTimeout(resizeTimeout)
  localStorage.setItem(
    'root-folder-container-height',
    Math.round(containerHeight.value)
  )
}
</script>

<style scoped>
.root-folder-container {
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--vp-c-bg);
  position: relative;
  resize: both;
  overflow: hidden;
}

.sidebar-list {
  width: 250px;
  background-color: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
}

.sidebar-list.compact {
  width: 60px;
}

.sidebar-header {
  position: sticky;
  top: 0;
  background-color: var(--vp-c-bg-soft);
  z-index: 10;
}

.statistics {
  padding: 20px 15px 15px 15px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--vp-c-brand);
}

.stat-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.sidebar-items-container {
  overflow-y: auto;
  flex: 1;
  padding: 20px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-list.compact .sidebar-item {
  justify-content: center;
  padding: 10px 0;
}

.sidebar-item:hover {
  /* background-color: var(--vp-c-brand-2); */
  background-color: #646cff22;
}

.sidebar-item.active {
  /* background-color: var(--vp-c-brand); */
  background-color: #646cff88;
  color: white;
}

.folder-icon {
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-list.compact .folder-icon {
  margin-right: 0;
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

.content-area {
  flex: 1;
  padding-left: 1rem;
  overflow-y: auto;
  background-color: var(--vp-c-bg);
}

.repo-info {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--vp-c-divider);
  position: sticky;
  top: 0;
  background-color: var(--vp-c-bg);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.repo-header {
  flex: 1;
}

.repo-header h2 {
  margin-top: 0;
  margin-bottom: 10px;

  /* reset vitepress h2 style */
  padding-top: 0px;
  border-top: none;
}

.repo-header h2 a {
  text-decoration: none;
}

.repo-header h2 a:hover {
  text-decoration: underline !important;
}

.repo-details {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.repo-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  margin-top: 4px;
}

.repo-action-icon {
  width: 1.2rem;
  height: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
}

.repo-action-icon:hover {
  opacity: 1;
}

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

.section-item {
  padding: 8px 15px 8px 35px;
}

.level-1,
.level-2-content,
.level-3-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 5px 0;
}

.level-1 {
  padding: 0;
  margin-bottom: 5px;
}

.level-2 {
  padding: 5px 0;
}

.level-3 {
  padding: 5px 0;
}

.level-2-container {
  padding-left: 20px;
  margin-top: 5px;
}

.level-3-container {
  padding-left: 20px;
  margin-top: 5px;
}

.item-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-size: 14px;
}

.item-link:hover {
  text-decoration: underline;
}

.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  color: var(--vp-c-text-2);
  font-size: 16px;
}

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
