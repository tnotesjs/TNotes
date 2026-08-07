import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'

const MOBILE_BREAKPOINT = 768
const MIN_HEIGHT_DESKTOP = 500
const MIN_HEIGHT_MOBILE = 400

function resolveMinHeight() {
  if (typeof window === 'undefined') return MIN_HEIGHT_DESKTOP
  return window.innerWidth < MOBILE_BREAKPOINT
    ? MIN_HEIGHT_MOBILE
    : MIN_HEIGHT_DESKTOP
}

/**
 * 按视口剩余高度撑满容器（非全屏、非全局搜索等场景）。
 * 高度 = max(minHeight, window.innerHeight - 元素文档顶部偏移 - bottomGap)
 *
 * 剩余空间足够时撑满视口；不足时使用最小高度保底，允许页面滚动
 * （例如移动端横屏），确保知识库列表仍可访问。
 */
export function useViewportFillHeight(
  elRef: Ref<HTMLElement | null>,
  enabled: Ref<boolean> | ComputedRef<boolean>,
  bottomGap = 0,
) {
  const height = ref<number | null>(null)
  let rafId = 0

  const update = () => {
    if (typeof window === 'undefined') return

    if (!enabled.value) {
      height.value = null
      return
    }

    const el = elRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const absoluteTop = rect.top + window.scrollY
    const available = window.innerHeight - absoluteTop - bottomGap
    const minHeight = resolveMinHeight()
    height.value = Math.max(minHeight, Math.round(available))
  }

  const scheduleUpdate = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      rafId = 0
      update()
    })
  }

  onMounted(() => {
    scheduleUpdate()
    window.addEventListener('resize', scheduleUpdate)
    window.visualViewport?.addEventListener('resize', scheduleUpdate)
  })

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId)
    window.removeEventListener('resize', scheduleUpdate)
    window.visualViewport?.removeEventListener('resize', scheduleUpdate)
  })

  watch(enabled, () => scheduleUpdate(), { flush: 'post' })
  watch(elRef, () => scheduleUpdate(), { flush: 'post' })

  return {
    height,
    updateHeight: scheduleUpdate,
  }
}
