const port = Number(process.argv[2] ?? 9555)
const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())
const target = targets.find((item) => item.type === 'iframe')
if (!target) throw new Error('找不到 VSCode WebView iframe target')

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let nextId = 0
const pending = new Map()
const events = []
const contexts = []
socket.addEventListener('message', (event) => {
  const message = JSON.parse(String(event.data))
  if (message.method === 'Runtime.executionContextCreated') {
    contexts.push({ id: message.params.context.id, name: message.params.context.name, origin: message.params.context.origin, auxData: message.params.context.auxData })
  }
  if (message.method === 'Runtime.exceptionThrown' || message.method === 'Runtime.consoleAPICalled' || message.method === 'Log.entryAdded') {
    events.push({ method: message.method, params: message.params })
  }
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  }
})

function send(method, params = {}) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

await send('Runtime.enable')
await send('Log.enable')
  await send('Runtime.evaluate', {
    expression: "document.getElementById('active-frame')?.contentWindow?.location.reload()",
  })
await new Promise((resolve) => setTimeout(resolve, 2500))

console.log(JSON.stringify({ contexts, events }, null, 2))
socket.close()
