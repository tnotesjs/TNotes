import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useContainerHeight(defaultHeight = 1000, minHeight = 500) {
  const containerHeight = ref(defaultHeight)
  let isResizing = false
  let startY = 0
  let startHeight = 0
  let resizeTimeout: number | null = null

  const startResize = (e: MouseEvent) => {
    if (
      (e.target as HTMLElement).classList.contains('height-input') ||
      (e.target as HTMLElement).classList.contains('dir-input') ||
      (e.target as HTMLElement).classList.contains('search-input')
    ) {
      return
    }

    isResizing = true
    startY = e.clientY
    startHeight = containerHeight.value

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ns-resize'
  }

  const resize = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaY = e.clientY - startY
    const newHeight = startHeight + deltaY
    containerHeight.value = Math.max(newHeight, minHeight)

    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
      localStorage.setItem(
        'knowledge-navigator-height',
        Math.round(containerHeight.value).toString()
      )
    }, 300)
  }

  const stopResize = () => {
    if (!isResizing) return

    isResizing = false
    document.body.style.userSelect = ''
    document.body.style.cursor = ''

    if (resizeTimeout) clearTimeout(resizeTimeout)
    localStorage.setItem(
      'knowledge-navigator-height',
      Math.round(containerHeight.value).toString()
    )
  }

  const onHeightChange = () => {
    containerHeight.value = Math.max(containerHeight.value, minHeight)
    localStorage.setItem(
      'knowledge-navigator-height',
      Math.round(containerHeight.value).toString()
    )
  }

  onMounted(() => {
    const savedHeight = localStorage.getItem('knowledge-navigator-height')
    if (savedHeight) {
      containerHeight.value = Math.max(parseInt(savedHeight), minHeight)
    }

    document.addEventListener('mousemove', resize)
    document.addEventListener('mouseup', stopResize)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', resize)
    document.removeEventListener('mouseup', stopResize)
  })

  return {
    containerHeight,
    startResize,
    onHeightChange,
  }
}
