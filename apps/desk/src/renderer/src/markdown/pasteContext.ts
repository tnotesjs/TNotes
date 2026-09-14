/**
 * 剪贴板里的「容器上下文」清理。
 *
 * ProseMirror 复制时会把自己所在的外层结构记进 `data-pm-slice`（context 数组）。
 * 复制一段**提示块内部**的文字时，记录长这样：
 *
 *   <p data-pm-slice="1 1 [&quot;deskCallout&quot;,{&quot;calloutType&quot;:&quot;danger&quot;,...}]">正文</p>
 *
 * 粘贴时它按这份记录把内容重新包成一个同名容器（属性和标题都照抄），于是
 * 「复制提示块里的一行字 → 粘到正文」会凭空长出一个提示块。
 *
 * 这里把容器从 context 里摘掉：内容照粘，容器不复活。
 *
 * **整块复制不受影响**：内容里真的包含容器节点时（NodeSelection、或选中范围覆盖整个
 * 容器），context 是空的，DOM 里是容器本身，粘贴仍然是容器。
 */

/** 需要从 context 里摘掉的容器节点（ProseMirror schema 里的节点名）。 */
const CONTAINER_CONTEXT_TYPES = new Set(['deskCallout'])

const SLICE_ATTRIBUTE = /data-pm-slice="([^"]*)"/
const SLICE_VALUE = /^(\d+) (\d+)(?: -(\d+))? (.*)$/s

function decodeAttribute(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

function encodeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/**
 * 从剪贴板 HTML 的 `data-pm-slice` 里摘掉容器上下文；其余原样返回。
 *
 * 只动 context 数组，不动 openStart/openEnd —— 那两个数字描述的正是折叠后的内容深度，
 * 摘掉一层上下文就不该再把它加回去。
 */
export function stripContainerPasteContext(html: string): string {
  const attribute = SLICE_ATTRIBUTE.exec(html)
  if (!attribute) return html
  const value = SLICE_VALUE.exec(decodeAttribute(attribute[1] ?? ''))
  if (!value) return html

  let context: unknown
  try {
    context = JSON.parse(value[4] ?? '')
  } catch {
    return html
  }
  if (!Array.isArray(context) || context.length === 0) return html

  const kept: unknown[] = []
  let dropped = false
  for (let index = 0; index + 1 < context.length; index += 2) {
    const name = context[index]
    if (typeof name === 'string' && CONTAINER_CONTEXT_TYPES.has(name)) {
      dropped = true
      continue
    }
    kept.push(name, context[index + 1])
  }
  if (!dropped) return html

  const wrappers = value[3] ? ` -${value[3]}` : ''
  const next = `${value[1]} ${value[2]}${wrappers} ${JSON.stringify(kept)}`
  return html.replace(attribute[0], () => `data-pm-slice="${encodeAttribute(next)}"`)
}
