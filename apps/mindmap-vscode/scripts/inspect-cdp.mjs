const port = Number(process.argv[2] ?? 9444)
const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())

async function inspectTarget(target) {
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  let nextId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data))
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    }
  })
  const send = (method, params = {}) => {
    const id = ++nextId
    socket.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
  }
  await send('Runtime.enable')
  const result = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      href: location.href,
      title: document.title,
      readyState: document.readyState,
      text: (document.body?.innerText || '').slice(0, 2200),
      html: (document.body?.innerHTML || '').slice(0, 2200),
      frames: Array.from(document.querySelectorAll('iframe, webview')).map((node) => ({ tag: node.tagName, src: node.getAttribute('src') })),
      nested: Array.from(document.querySelectorAll('iframe')).map((node) => {
        try {
          const doc = node.contentDocument
          return {
            id: node.id,
            src: node.getAttribute('src'),
            readyState: doc?.readyState,
            text: (doc?.body?.innerText || '').slice(0, 2200),
            html: (doc?.body?.innerHTML || '').slice(0, 2200),
            scripts: Array.from(doc?.querySelectorAll('script[src]') || []).map((script) => script.src),
            resources: Array.from(node.contentWindow?.performance.getEntriesByType('resource') || []).map((entry) => ({ name: entry.name, duration: entry.duration, transferSize: entry.transferSize, decodedBodySize: entry.decodedBodySize })),
            appShell: !!doc?.querySelector('.vscode-app-shell'),
            bootMessage: doc?.querySelector('.boot-message')?.textContent || null,
            canvases: doc?.querySelectorAll('canvas').length || 0,
            viewTabs: Array.from(doc?.querySelectorAll('.view-tab') || []).map((tab) => ({ label: tab.getAttribute('aria-label'), disabled: tab.disabled, active: tab.classList.contains('active') })),
            errors: Array.from(doc?.querySelectorAll('.source-diagnostics') || []).map((error) => error.textContent),
            fileName: doc?.querySelector('.file-name')?.textContent || null,
          }
        } catch (error) {
          return { id: node.id, accessError: String(error) }
        }
      }),
      appShell: !!document.querySelector('.vscode-app-shell'),
      bootMessage: document.querySelector('.boot-message')?.textContent || null,
      canvases: document.querySelectorAll('canvas').length,
      viewTabs: Array.from(document.querySelectorAll('.view-tab')).map((node) => ({ label: node.getAttribute('aria-label'), disabled: node.disabled, active: node.classList.contains('active') })),
      errors: Array.from(document.querySelectorAll('.source-diagnostics')).map((node) => node.textContent),
      fileName: document.querySelector('.file-name')?.textContent || null,
    })`,
    returnByValue: true,
  })
  socket.close()
  return {
    targetId: target.id,
    targetType: target.type,
    targetUrl: target.url,
    ...(result.result?.value ? JSON.parse(result.result.value) : {}),
  }
}

const inspected = []
for (const target of targets.filter((item) => item.type === 'page' || item.type === 'iframe')) {
  try {
    inspected.push(await inspectTarget(target))
  } catch (error) {
    inspected.push({ targetId: target.id, targetType: target.type, inspectError: error instanceof Error ? error.message : String(error) })
  }
}
console.log(JSON.stringify({ inspected }, null, 2))
