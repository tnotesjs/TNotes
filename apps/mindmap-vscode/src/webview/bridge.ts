import { PROTOCOL_VERSION, type WebviewToExtensionMessage } from '../protocol'

export interface BridgeApi<State = unknown> {
  postMessage(message: WebviewToExtensionMessage): void
  getState(): State | undefined
  setState(state: State): void
}

export function createBridge<State>(): BridgeApi<State> {
  return acquireVsCodeApi<State>()
}

export function protocolMessage<T extends Omit<WebviewToExtensionMessage, 'protocol'>>(
  message: T
): T & { protocol: typeof PROTOCOL_VERSION } {
  return { ...message, protocol: PROTOCOL_VERSION }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  const chunkSize = 0x8000
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return btoa(binary)
}
