// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { mountMermaidPreview } from './componentPreview'

const cleanups: Array<() => void> = []

afterEach(() => {
  cleanups
    .splice(0)
    .reverse()
    .forEach((cleanup) => cleanup())
  document.body.innerHTML = ''
})

const NOTE_0020 = [
  {
    name: 'flowchart LR',
    source: `flowchart LR
  Desk --> UI
  Site --> UI
  UI --> Tokens`
  },
  {
    name: 'sequenceDiagram',
    source: `sequenceDiagram
  participant Desk
  participant Site
  Desk->>Site: note
  Site-->>Desk: style`,
    center: true
  },
  {
    name: 'graph TD',
    source: `graph TD
  A[Start] --> B{ok}
  B -->|Yes| C[pass]
  B -->|No| D[diff]
  D --> A`
  }
] as const

describe('mountMermaidPreview', () => {
  it.each(NOTE_0020)(
    'keeps the host laid out for note-0020 $name',
    async ({ source, center }) => {
      const host = document.createElement('div')
      document.body.append(host)
      const mounted = mountMermaidPreview(host, {
        source,
        center: Boolean(center)
      })
      cleanups.push(() => {
        mounted.unmount()
        host.remove()
      })

      await new Promise((resolve) => queueMicrotask(resolve))
      const diagram = host.querySelector('.tn-mermaid__diagram')
      expect(diagram).not.toBeNull()
      expect(diagram!.classList.contains('is-obscured')).toBe(false)

      await vi.waitFor(
        () => {
          expect(host.querySelector('.tn-mermaid__loading')).toBeNull()
        },
        { timeout: 15_000 }
      )

      const errorText = host.querySelector('.tn-mermaid__error')?.textContent ?? ''
      expect(errorText).not.toMatch(/svg element not in render tree/i)
    },
    15_000
  )
})
