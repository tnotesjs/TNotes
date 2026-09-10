import { describe, expect, it } from 'vitest'

import { adoptLiveSvg } from './adoptLiveSvg'

describe('adoptLiveSvg', () => {
  it('renames the root svg id and scoped theme selectors', () => {
    const svg = `<svg id="tn-mermaid-1" xmlns="http://www.w3.org/2000/svg"><style>#tn-mermaid-1{fill:#ccc;}#tn-mermaid-1 .node{stroke:#fff;}#tn-mermaid-1_flowchart-v2-pointEnd{fill:red;}</style><path id="tn-mermaid-1_flowchart-v2-pointEnd"/></svg>`
    const out = adoptLiveSvg(svg, 'tn-mermaid-1')
    expect(out).toContain('id="tn-mermaid-1-live"')
    expect(out).toContain('#tn-mermaid-1-live{fill:#ccc;}')
    expect(out).toContain('#tn-mermaid-1-live .node{stroke:#fff;}')
    expect(out).toContain('id="tn-mermaid-1_flowchart-v2-pointEnd"')
    expect(out).toContain('#tn-mermaid-1_flowchart-v2-pointEnd{fill:red;}')
    expect(out).not.toMatch(/id="tn-mermaid-1"/)
  })
})
