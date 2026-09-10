<template>
  <iframe
    class="tn-bilibili-video"
    :src="playerSrc"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    allowfullscreen="true"
    title="Bilibili video"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Bilibili BV id, e.g. BV1QR4y1y7GG */
    id: string
    /** Start playback when the iframe loads. Default off — embeds must not surprise readers. */
    autoplay?: boolean
    /** Start muted. Useful if autoplay is enabled (browser policies often require mute). */
    muted?: boolean
  }>(),
  {
    autoplay: false,
    muted: false
  }
)

const playerSrc = computed(() => {
  const id = props.id?.trim() ?? ''
  if (!id) return ''
  const params = new URLSearchParams({
    isOutside: 'true',
    bvid: id,
    // Official embed docs: boolean query values are 0 | 1.
    autoplay: props.autoplay ? '1' : '0',
    muted: props.muted ? '1' : '0'
  })
  return `https://player.bilibili.com/player.html?${params.toString()}`
})
</script>

<style scoped>
.tn-bilibili-video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 1rem 0;
  border: 0;
  background: var(--tn-c-divider, #e2e2e3);
}
</style>
