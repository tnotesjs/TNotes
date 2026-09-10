export const PROTOCOL_VERSION = 1 as const

export interface DocumentSnapshot {
  text: string
  version: number
  fileName: string
  assetUris: Record<string, string>
}

export type ExtensionToWebviewMessage =
  | {
      type: 'document'
      protocol: typeof PROTOCOL_VERSION
      snapshot: DocumentSnapshot
      reason: 'init' | 'change'
    }
  | { type: 'editApplied'; protocol: typeof PROTOCOL_VERSION; changeId: number; version: number }
  | {
      type: 'editRejected'
      protocol: typeof PROTOCOL_VERSION
      changeId: number
      snapshot: DocumentSnapshot
      message: string
    }
  | {
      type: 'assetWritten'
      protocol: typeof PROTOCOL_VERSION
      requestId: number
      relativePath: string
      webviewUri: string
    }
  | {
      type: 'assetWriteFailed'
      protocol: typeof PROTOCOL_VERSION
      requestId: number
      message: string
    }

export type WebviewToExtensionMessage =
  | { type: 'ready'; protocol: typeof PROTOCOL_VERSION }
  | {
      type: 'edit'
      protocol: typeof PROTOCOL_VERSION
      changeId: number
      baseVersion: number
      text: string
    }
  | {
      type: 'writeAsset'
      protocol: typeof PROTOCOL_VERSION
      requestId: number
      mime: string
      base64: string
    }
  | { type: 'save'; protocol: typeof PROTOCOL_VERSION }
  | { type: 'openExternal'; protocol: typeof PROTOCOL_VERSION; href: string }

export function isWebviewMessage(value: unknown): value is WebviewToExtensionMessage {
  if (!value || typeof value !== 'object') return false
  const message = value as { type?: unknown; protocol?: unknown }
  return message.protocol === PROTOCOL_VERSION && typeof message.type === 'string'
}
