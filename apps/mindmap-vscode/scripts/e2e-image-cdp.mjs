const port = Number(process.argv[2] ?? 9555)
const fileName = process.argv[3] ?? 'e2e.tn-mindmap.md'
const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) =>
  response.json()
)
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function connect(target) {
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  let nextId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data))
    if (!message.id || !pending.has(message.id)) return
    const handler = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) handler.reject(new Error(message.error.message))
    else handler.resolve(message.result)
  })
  const send = (method, params = {}) => {
    const id = ++nextId
    socket.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
  }
  await send('Runtime.enable')
  return { socket, send }
}

for (const target of targets.filter((item) => item.type === 'iframe')) {
  const { socket, send } = await connect(target)
  const probe = await send('Runtime.evaluate', {
    expression: `document.getElementById('active-frame')?.contentDocument?.querySelector('.file-name')?.textContent || ''`,
    returnByValue: true
  })
  if (probe.result?.value !== fileName) {
    socket.close()
    continue
  }

  await send('Runtime.evaluate', {
    expression: `document.getElementById('active-frame')?.contentDocument?.querySelector('[aria-label="源码视图"]')?.click()`
  })
  await delay(100)
  const paste = await send('Runtime.evaluate', {
    expression: `(() => {
      const frame = document.getElementById('active-frame')
      const doc = frame?.contentDocument
      const win = frame?.contentWindow
      const textarea = doc?.querySelector('.md-textarea')
      if (!textarea || !win) return { ok: false }
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
      const bytes = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAE/wJ/lK7fWQAAAABJRU5ErkJggg=='), (character) => character.charCodeAt(0))
      const transfer = new win.DataTransfer()
      transfer.items.add(new win.File([bytes], 'e2e.png', { type: 'image/png' }))
      textarea.dispatchEvent(new win.ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: transfer }))
      return { ok: true }
    })()`,
    returnByValue: true
  })
  await delay(1800)
  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      const doc = document.getElementById('active-frame')?.contentDocument
      const value = doc?.querySelector('.md-textarea')?.value || ''
      return { valueTail: value.slice(-180), containsAsset: /!\\[截图\\]\\(assets\\/image-[^)]+\\)/.test(value) }
    })()`,
    returnByValue: true
  })
  socket.close()
  console.log(JSON.stringify({ paste: paste.result?.value, state: state.result?.value }, null, 2))
  process.exit(0)
}

throw new Error(`No active TNotes Mindmap webview found for ${fileName}`)
