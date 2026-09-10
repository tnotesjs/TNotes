import { parentPort } from 'node:worker_threads'

import { encodeImage, type EncodeImageOptions } from './imageEncode'

interface EncodeRequest {
  type: 'encode'
  requestId: number
  fileName: string
  data: Uint8Array
  options: EncodeImageOptions
}

parentPort?.on('message', async (message: EncodeRequest) => {
  if (!parentPort || message.type !== 'encode') return
  try {
    const value = await encodeImage(message.data, message.fileName, message.options)
    parentPort.postMessage({ requestId: message.requestId, ok: true, value })
  } catch (error) {
    parentPort.postMessage({
      requestId: message.requestId,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }
})
