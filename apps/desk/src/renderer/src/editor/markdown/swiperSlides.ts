/**
 * Parse / serialize image slides inside `::: swiper` bodies.
 * Tab labels mirror core: image alt, or `img` when alt is empty.
 * Tab chrome / hydrate live in `@tnotesjs/ui/swiper`.
 */

export {
  applySwiperTabsPadding,
  createSwiperTabNav,
  hydrateTnSwipers,
  wrapSlideIndex
} from '@tnotesjs/ui/swiper'

export interface SwiperSlideEntry {
  alt: string
  src: string
}

const IMAGE_LINE =
  /^ {0,3}!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)\s*$/

export function parseSwiperSlides(body: string): SwiperSlideEntry[] {
  const slides: SwiperSlideEntry[] = []
  for (const line of body.replace(/\r\n?/g, '\n').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const match = trimmed.match(IMAGE_LINE)
    if (!match) continue
    slides.push({
      alt: match[1] ?? '',
      src: match[2] ?? ''
    })
  }
  return slides
}

export function swiperSlideTabTitle(entry: SwiperSlideEntry): string {
  const alt = entry.alt.trim()
  return alt || 'img'
}

export function withSwiperSlideTitle(entry: SwiperSlideEntry, title: string): SwiperSlideEntry {
  return { ...entry, alt: title.trim() }
}

export function serializeSwiperSlides(entries: SwiperSlideEntry[]): string {
  return entries.map((entry) => `![${entry.alt}](${entry.src})`).join('\n\n')
}
