import type { ClosingResource } from './closeTabs'

type Entry = ClosingResource

const registry = new Map<string, Entry>()

export function registerKbSettingsCloseHandler(tabId: string, entry: Entry): void {
  registry.set(tabId, entry)
}

export function unregisterKbSettingsCloseHandler(tabId: string): void {
  registry.delete(tabId)
}

export function kbSettingsCloseResource(tabId: string): ClosingResource | null {
  return registry.get(tabId) ?? null
}
