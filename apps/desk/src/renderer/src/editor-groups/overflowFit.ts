/**
 * How many leading toolbar items fit when leftover items go behind a "more" button.
 * The more button is reserved whenever anything would overflow.
 */
export function computeVisibleCount(
  availableWidth: number,
  itemWidths: number[],
  gap: number,
  moreWidth: number
): number {
  const count = itemWidths.length
  if (count === 0 || availableWidth <= 0) return 0

  let total = 0
  for (let index = 0; index < count; index += 1) {
    total += itemWidths[index] + (index > 0 ? gap : 0)
  }
  if (total <= availableWidth) return count

  let used = 0
  let visible = 0
  for (let index = 0; index < count; index += 1) {
    const next = used + (visible > 0 ? gap : 0) + itemWidths[index]
    const last = index === count - 1
    if (last && next <= availableWidth) return index + 1
    if (next + gap + moreWidth <= availableWidth) {
      used = next
      visible = index + 1
      continue
    }
    break
  }
  return visible
}
