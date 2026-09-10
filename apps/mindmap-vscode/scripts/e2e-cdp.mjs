const port = Number(process.argv[2] ?? 9555)
const fileName = process.argv[3] ?? 'e2e.tn-mindmap.md'
const marker = process.argv[4] ?? 'CDP 自动编辑与保存通过'
const saveDelay = Number(process.argv[5] ?? 700)
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

  const edit = await send('Runtime.evaluate', {
    expression: `(() => {
      const frame = document.getElementById('active-frame')
      const doc = frame?.contentDocument
      const win = frame?.contentWindow
      if (!doc || !win) return { ok: false, reason: 'missing active editor' }
      const textarea = doc.querySelector('.md-textarea')
      if (!textarea) return { ok: false, reason: 'missing source textarea' }
      const before = textarea.value
      textarea.value = before.replace(/\\s*$/, '') + '\\n- ${marker.replaceAll("'", "\\'")}\\n'
      textarea.dispatchEvent(new win.Event('input', { bubbles: true }))
      return { ok: true, beforeLength: before.length, afterLength: textarea.value.length }
    })()`,
    returnByValue: true
  })

  await delay(saveDelay)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const frame = document.getElementById('active-frame')
      frame?.contentWindow?.dispatchEvent(new frame.contentWindow.KeyboardEvent('keydown', {
        key: 's', code: 'KeyS', metaKey: true, bubbles: true, cancelable: true,
      }))
    })()`
  })
  await delay(1200)

  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      const doc = document.getElementById('active-frame')?.contentDocument
      return {
        fileName: doc?.querySelector('.file-name')?.textContent || null,
        sourceActive: doc?.querySelector('[aria-label="源码视图"]')?.classList.contains('active') || false,
        diagnostics: Array.from(doc?.querySelectorAll('.source-diagnostics') || []).map((node) => node.textContent),
        markerVisible: doc?.querySelector('.md-textarea')?.value.includes(${JSON.stringify(marker)}) || false,
      }
    })()`,
    returnByValue: true
  })

  socket.close()
  console.log(JSON.stringify({ edit: edit.result?.value, state: state.result?.value }, null, 2))
  process.exit(0)
}

throw new Error(`No active TNotes Mindmap webview found for ${fileName}`)
