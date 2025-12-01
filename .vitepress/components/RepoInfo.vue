<template>
  <div class="repo-info">
    <div class="repo-header">
      <h2 title="知识库的在线访问链接">
        <a :href="item.link" target="_blank">TNotes.{{ item.title }}</a>
      </h2>
      <p class="repo-details">{{ item.details }}</p>
    </div>

    <div class="repo-actions">
      <a
        v-if="tnotesDir"
        title="打开知识库文件夹"
        target="_blank"
        :href="vsCodeLink"
      >
        <img :src="icon__vscode" alt="VS Code" class="repo-action-icon" />
      </a>

      <a title="打开知识库仓库" target="_blank" :href="githubLink">
        <img :src="icon__github" alt="GitHub" class="repo-action-icon" />
      </a>

      <img
        :title="allCollapsed ? '全部展开' : '全部折叠'"
        :src="icon__fold"
        alt="Fold"
        class="repo-action-icon"
        @click="$emit('toggle-all')"
      />
    </div>
  </div>

  <!-- 笔记数量趋势图 -->
  <div v-if="hasChartData" class="notes-trend-chart">
    <v-chart :option="chartOption" autoresize :style="{ height: '180px' }" />
  </div>
</template>

<script setup lang="ts">
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { RootItem } from './composables/useNavigator'
import { buildGitHubLink, buildVSCodeLink } from './utils/helpers'
import icon__fold from '/icon__fold.svg'
import icon__github from '/icon__github.svg'
import icon__vscode from '/icon__vscode.svg'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
])

const props = defineProps<{
  item: RootItem
  tnotesDir: string
  allCollapsed: boolean
}>()

defineEmits<{
  'toggle-all': []
}>()

const vsCodeLink = computed(() =>
  buildVSCodeLink(props.tnotesDir, props.item.title)
)
const githubLink = computed(() => buildGitHubLink(props.item.title))

// 判断是否有图表数据
const hasChartData = computed(() => {
  const { completed_notes_count } = props.item
  if (!completed_notes_count) return false
  if (typeof completed_notes_count === 'number') return false
  return Object.keys(completed_notes_count).length > 0
})

// 生成图表配置
const chartOption = computed(() => {
  const { completed_notes_count } = props.item

  if (!completed_notes_count || typeof completed_notes_count === 'number') {
    return {}
  }

  // 按时间排序
  const sortedEntries = Object.entries(completed_notes_count).sort((a, b) => {
    return a[0].localeCompare(b[0])
  })

  const dates = sortedEntries.map(([date]) => date)
  const counts = sortedEntries.map(([, count]) => count)

  // 计算每月增量（相比上月的变化）
  const increments = counts.map((count, index) => {
    if (index === 0) return 0
    return count - counts[index - 1]
  })

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const index = params[0].dataIndex
        const date = params[0].axisValue
        const total = params[0].value
        const increment = increments[index]

        let result = `${date}<br/>${total}`
        if (increment !== 0) {
          const sign = increment > 0 ? '+' : ''
          const color = increment > 0 ? '#10b981' : '#ef4444'
          result += ` <span style="color: ${color};">(${sign}${increment})</span>`
        }
        return result
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.3,
        },
      },
    },
    series: [
      {
        name: '笔记数量',
        type: 'line',
        smooth: true,
        data: counts,
        itemStyle: {
          color: '#646cff',
        },
        lineStyle: {
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(100, 108, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(100, 108, 255, 0.05)',
              },
            ],
          },
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
})
</script>

<style scoped>
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
  margin-top: 1rem;
  margin-bottom: 10px;
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
  margin-top: 1rem;
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

/* 趋势图样式 */
.notes-trend-chart {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
</style>
