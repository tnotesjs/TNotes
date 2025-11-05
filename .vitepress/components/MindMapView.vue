<template>
  <div class="mindmap-view">
    <div v-if="!activeSidebar" class="empty-mindmap">
      请选择一个知识库查看思维导图
    </div>
    <template v-else>
      <div ref="containerRef" class="mindmap-container">
        <svg ref="svgRef" style="width: 100%; height: 100%"></svg>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { scaleOrdinal, schemePastel2, schemeSet3, schemeTableau10 } from 'd3'
import { Transformer } from 'markmap-lib'
import { Toolbar } from 'markmap-toolbar'
import 'markmap-toolbar/dist/style.css'
import { Markmap, type IMarkmapOptions } from 'markmap-view'
import { withBase } from 'vitepress'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { RootItem } from './composables/useNavigator'

const MARKMAP_THEME_KEY = 'knowledge-navigator-markmap-theme'
const MARKMAP_EXPAND_LEVEL_KEY = 'knowledge-navigator-markmap-expand-level'

interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

const props = defineProps<{
  activeSidebar: SidebarItem[] | null
  activeSidebarItem: RootItem | null
}>()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const markmapTheme = ref<'default' | 'colorful' | 'dark'>('default')
const expandLevel = ref(5)
const isFullscreen = ref(false)

let markmapInstance: Markmap | null = null
let toolbarEl: HTMLElement | null = null
let toolbarLevelInput: HTMLInputElement | null = null
const transformer = new Transformer()

// 获取主题颜色函数（从 localStorage 读取，与 markmap 工具栏同步）
const getThemeColorFn = () => {
  const theme = localStorage.getItem(MARKMAP_THEME_KEY) || 'default'
  switch (theme) {
    case 'colorful':
      return scaleOrdinal(schemeTableau10)
    case 'dark':
      return scaleOrdinal(schemeSet3)
    default:
      return scaleOrdinal(schemePastel2)
  }
}

// 将 sidebar 数据转换为 markdown（使用无序列表格式）
function sidebarToMarkdown(
  items: SidebarItem[],
  level = 1,
  isRoot = true
): string {
  // 如果是第一层，添加根节点
  if (level === 1 && isRoot && props.activeSidebarItem) {
    const rootName = props.activeSidebarItem.title.replace(/^TNotes\./, '')
    const rootMarkdown = `# ${rootName}\n\n`
    // 第一层子节点，isRoot 设为 false 避免无限递归
    const childrenMarkdown = sidebarToMarkdown(items, 1, false)
    return rootMarkdown + childrenMarkdown
  }

  // 递归处理子节点（使用无序列表）
  return items
    .map((item) => {
      // 使用缩进来表示层级关系
      const indent = '  '.repeat(level - 1)

      // 如果有链接，使用 markdown 链接格式；如果没有链接且是第一层，使用反引号包裹
      let text
      if (item.link) {
        text = `[${item.text}](${item.link})`
      } else if (level === 1) {
        text = `\`${item.text}\``
      } else {
        text = item.text
      }

      let markdown = `${indent}- ${text}\n`

      if (item.items && item.items.length > 0) {
        markdown += sidebarToMarkdown(item.items, level + 1, false)
      }

      return markdown
    })
    .join('')
} // 初始化工具栏
function initToolbar() {
  if (!markmapInstance || !containerRef.value) return

  // 移除现有的工具栏
  if (toolbarEl) {
    toolbarEl.remove()
    toolbarEl = null
    toolbarLevelInput = null
  }

  // 创建 markmap 工具栏
  const { el } = Toolbar.create(markmapInstance)
  toolbarEl = el
  toolbarEl.style.position = 'absolute'
  toolbarEl.style.top = '1rem'
  toolbarEl.style.right = '0.5rem'
  toolbarEl.style.scale = '0.8'
  toolbarEl.style.zIndex = '10'

  // 移除品牌标识
  const brand = toolbarEl.querySelector('.mm-toolbar-brand')
  if (brand) toolbarEl.removeChild(brand)

  // 添加层级控制和更新按钮
  addLevelControl(toolbarEl)

  // 添加全屏按钮
  addFullscreenButton(toolbarEl)

  containerRef.value.appendChild(toolbarEl)

  // 监听工具栏中主题按钮的点击（markmap 会自动更新 localStorage）
  observeThemeChange()
}

// 添加层级控制
function addLevelControl(toolbar: HTMLElement) {
  const container = document.createElement('div')
  container.style.display = 'flex'
  container.style.alignItems = 'center'
  container.style.gap = '8px'
  container.style.marginRight = '5px'

  // 创建输入框
  const levelInput = document.createElement('input')
  levelInput.type = 'number'
  levelInput.id = 'markmap-expand-level'
  levelInput.name = 'markmap-expand-level'
  levelInput.min = '1'
  levelInput.max = '100'
  levelInput.value = expandLevel.value.toString()
  levelInput.style.width = '2.4rem'
  levelInput.style.height = '1.6rem'
  levelInput.style.padding = '2px 6px'
  levelInput.style.fontSize = '12px'
  levelInput.style.lineHeight = '1.2'
  levelInput.style.textAlign = 'center'
  levelInput.style.boxSizing = 'border-box'
  levelInput.style.borderBottom = '.5px solid var(--vp-c-brand-1)'
  levelInput.style.color = 'var(--vp-c-brand-1)'
  levelInput.title = '展开层级'
  levelInput.setAttribute('aria-label', 'markmap-expand-level')

  toolbarLevelInput = levelInput

  // 限制输入范围
  levelInput.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement
    let value = parseInt(input.value)
    if (input.value === '' || isNaN(value)) return
    if (value < 1) {
      input.value = '1'
    } else if (value > 100) {
      input.value = '100'
    }
  })

  levelInput.addEventListener('change', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value)
    if (!isNaN(value) && value >= 1 && value <= 100) {
      expandLevel.value = value
    } else {
      levelInput.value = expandLevel.value.toString()
    }
  })

  // 按 Enter 触发更新
  levelInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = parseInt((e.target as HTMLInputElement).value)
      if (!isNaN(val) && val >= 1 && val <= 100) {
        expandLevel.value = val
      } else {
        levelInput.value = expandLevel.value.toString()
      }
      onUpdateClick()
    }
  })

  // 创建确认按钮
  const updateBtn = document.createElement('button')
  updateBtn.type = 'button'
  updateBtn.className = 'mm-toolbar-item'
  updateBtn.title = '确定层级并更新'
  updateBtn.innerHTML = `<img src="${withBase(
    '/icon__confirm.svg'
  )}" alt="确定" style="width:16px;height:16px;display:block" />`
  updateBtn.addEventListener('click', onUpdateClick)

  container.appendChild(levelInput)
  container.appendChild(updateBtn)
  toolbar.insertBefore(container, toolbar.firstChild)
}

// 添加全屏按钮
function addFullscreenButton(toolbar: HTMLElement) {
  const fullscreenBtn = document.createElement('div')
  fullscreenBtn.className = 'mm-toolbar-item'
  fullscreenBtn.title = isFullscreen.value ? '退出全屏' : '全屏'
  fullscreenBtn.innerHTML = isFullscreen.value
    ? `<img src="${withBase(
        '/icon__fullscreen_exit.svg'
      )}" alt="退出全屏" style="width:18px;height:18px;display:block" />`
    : `<img src="${withBase(
        '/icon__fullscreen.svg'
      )}" alt="全屏" style="width:18px;height:18px;display:block" />`
  fullscreenBtn.addEventListener('click', toggleFullscreen)
  toolbar.appendChild(fullscreenBtn)
}

// 监听主题变化（markmap 工具栏会自动更新 localStorage）
function observeThemeChange() {
  // 定期检查 localStorage 中的主题变化
  const checkTheme = () => {
    const currentTheme = localStorage.getItem(MARKMAP_THEME_KEY) as
      | 'default'
      | 'colorful'
      | 'dark'
      | null
    if (currentTheme && currentTheme !== markmapTheme.value) {
      markmapTheme.value = currentTheme
    }
  }

  // 定期检查主题变化（同页面内 storage 事件不触发，需要轮询）
  const intervalId = setInterval(checkTheme, 300)

  // 保存清理函数的引用
  ;(containerRef.value as any).__themeCleanup = () => {
    clearInterval(intervalId)
  }
}

// 点击更新按钮触发重新渲染
function onUpdateClick() {
  localStorage.setItem(MARKMAP_EXPAND_LEVEL_KEY, expandLevel.value.toString())
  renderMindmap()
}

// 切换全屏
function toggleFullscreen() {
  if (!containerRef.value) return

  if (!isFullscreen.value) {
    // 进入全屏
    if (containerRef.value.requestFullscreen) {
      containerRef.value.requestFullscreen().catch((err) => {
        console.error('全屏请求失败:', err)
      })
    } else if ((containerRef.value as any).webkitRequestFullscreen) {
      ;(containerRef.value as any).webkitRequestFullscreen()
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      ;(document as any).webkitExitFullscreen()
    }
  }
}

// 监听全屏状态变化
function handleFullscreenChange() {
  isFullscreen.value = !!(
    document.fullscreenElement || (document as any).webkitFullscreenElement
  )

  // 更新全屏按钮
  if (toolbarEl) {
    const fullscreenBtn = Array.from(toolbarEl.children).find((child) =>
      child.querySelector('img[alt="全屏"], img[alt="退出全屏"]')
    ) as HTMLElement
    if (fullscreenBtn) {
      fullscreenBtn.title = isFullscreen.value ? '退出全屏' : '全屏'
      fullscreenBtn.innerHTML = isFullscreen.value
        ? `<img src="${withBase(
            '/icon__fullscreen_exit.svg'
          )}" alt="退出全屏" style="width:18px;height:18px;display:block" />`
        : `<img src="${withBase(
            '/icon__fullscreen.svg'
          )}" alt="全屏" style="width:18px;height:18px;display:block" />`
    }
  }

  // 全屏模式下调整高度
  if (svgRef.value) {
    if (isFullscreen.value) {
      svgRef.value.style.height = 'calc(100vh - 100px)'
    } else {
      svgRef.value.style.height = '100%'
    }

    // 居中
    setTimeout(() => {
      if (markmapInstance) {
        try {
          markmapInstance.fit()
        } catch (e) {
          console.warn('居中失败', e)
        }
      }
    }, 300)
  }
}

// 渲染思维导图
function renderMindmap() {
  if (!props.activeSidebar || !svgRef.value) {
    return
  }

  nextTick().then(() => {
    // 销毁旧实例
    if (markmapInstance) {
      try {
        markmapInstance.destroy()
      } catch (e) {
        console.warn('Destroy markmap failed:', e)
      }
      markmapInstance = null
    }

    if (!svgRef.value) return

    const markdown = sidebarToMarkdown(props.activeSidebar!)

    console.log('=== 生成的 Markdown ===')
    console.log(markdown)
    console.log('====================')

    if (!markdown.trim()) {
      svgRef.value.innerHTML = '<text x="20" y="30" fill="#999">空内容</text>'
      return
    }

    try {
      const { root } = transformer.transform(markdown)

      const colorFn = getThemeColorFn()
      const options: Partial<IMarkmapOptions> = {
        initialExpandLevel: expandLevel.value,
        duration: 100,
        nodeMinHeight: 24,
        spacingVertical: 10,
        spacingHorizontal: 20,
        maxWidth: 400,
        maxInitialScale: 2,
        color: (node) => colorFn(`${node.state?.path || ''}`),
      }

      markmapInstance = Markmap.create(svgRef.value, options, root)

      setTimeout(() => {
        try {
          markmapInstance?.fit()
        } catch (e) {
          console.warn('Fit failed:', e)
        }
      }, 0)

      initToolbar()
    } catch (error) {
      console.error('Markmap render error:', error)
      if (svgRef.value) {
        svgRef.value.innerHTML = `<text x="20" y="30" fill="red">思维导图渲染错误</text>`
      }
    }
  })
}

onMounted(() => {
  // 从 localStorage 读取主题（支持 markmap 的三种主题）
  const savedTheme = localStorage.getItem(MARKMAP_THEME_KEY) as
    | 'default'
    | 'colorful'
    | 'dark'
    | null
  if (savedTheme && ['default', 'colorful', 'dark'].includes(savedTheme)) {
    markmapTheme.value = savedTheme
  }

  // 从 localStorage 读取展开层级
  const savedLevel = localStorage.getItem(MARKMAP_EXPAND_LEVEL_KEY)
  if (savedLevel) {
    const level = parseInt(savedLevel)
    if (!isNaN(level) && level >= 1 && level <= 100) {
      expandLevel.value = level
    }
  }

  // 添加全屏事件监听
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

  if (props.activeSidebar) {
    renderMindmap()
  }
})

onBeforeUnmount(() => {
  if (markmapInstance) {
    try {
      markmapInstance.destroy()
    } catch (e) {
      console.warn('Cleanup failed:', e)
    }
    markmapInstance = null
  }

  if (toolbarEl) {
    toolbarEl.remove()
    toolbarEl = null
    toolbarLevelInput = null
  }

  // 清理主题监听
  if (containerRef.value && (containerRef.value as any).__themeCleanup) {
    ;(containerRef.value as any).__themeCleanup()
  }

  // 移除全屏事件监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
})

// 监听思维导图主题变化
watch(markmapTheme, (newTheme, oldTheme) => {
  console.log('=== 思维导图主题已切换 ===')
  console.log('从:', oldTheme, '→ 到:', newTheme)
  console.log('是否暗色主题:', newTheme === 'dark')
  console.log('========================')
})

// 监听层级变化，同步输入框显示
watch(expandLevel, (v) => {
  if (toolbarLevelInput) {
    const asStr = (v || 0).toString()
    if (toolbarLevelInput.value !== asStr) {
      toolbarLevelInput.value = asStr
    }
  }
})

watch(
  () => props.activeSidebar,
  (newVal) => {
    if (newVal) {
      renderMindmap()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.mindmap-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--vp-c-bg);
  overflow: hidden;
}

.mindmap-container {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.mindmap-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* 暗色主题样式（响应 markmap 自动添加到根节点的 .markmap-dark 类） */
.markmap-dark .mindmap-container {
  background-color: #1d1d1d;
  color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.markmap-dark .mindmap-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* 暗色主题工具栏样式 */
.markmap-dark .mindmap-container :deep(.mm-toolbar) {
  background: rgba(30, 30, 30, 0.9);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.markmap-dark .mindmap-container :deep(.mm-toolbar-item):hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 鼠标悬停显示工具栏 */
.mindmap-container :deep(.mm-toolbar) {
  opacity: 0;
  pointer-events: none;
}

.mindmap-container:hover :deep(.mm-toolbar) {
  opacity: 1;
  pointer-events: auto;
}

.mindmap-container :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  min-width: 100%;
  transition: height 0.3s ease;
}

.empty-mindmap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--vp-c-text-2);
  font-size: 16px;
}

@media (max-width: 768px) {
  .mindmap-header {
    padding: 15px;
  }

  .mindmap-header h2 {
    font-size: 1.2rem;
  }

  .mindmap-container {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .mindmap-container {
    padding: 0.5rem;
  }
}

/* 全屏样式 */
.mindmap-container:fullscreen,
.mindmap-container:-webkit-full-screen,
.mindmap-container:-ms-fullscreen {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: none;
}

:global(.markmap-dark) .mindmap-container:fullscreen,
:global(.markmap-dark) .mindmap-container:-webkit-full-screen,
:global(.markmap-dark) .mindmap-container:-ms-fullscreen {
  background: #1d1d1d;
}
</style>
