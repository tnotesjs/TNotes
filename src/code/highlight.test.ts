import { describe, expect, it } from 'vitest'
import { highlightCode, highlightCodeSync, parseCodeMeta, prepareCodeHighlighter } from './highlight'

describe('shared code rendering', () => {
  it('parses titles, line offsets, highlight ranges and per-block overrides', () => {
    expect(parseCodeMeta('ts:line-numbers=12 {1,3-5} [demo.ts]')).toEqual({
      language: 'ts', title: 'demo.ts', startLine: 12, lineNumbers: true,
      highlightedLines: [1, 3, 4, 5]
    })
    expect(parseCodeMeta('js {1-2} [setup.js]')).toEqual({
      language: 'js', title: 'setup.js', startLine: 1, lineNumbers: true,
      highlightedLines: [1, 2]
    })
    expect(parseCodeMeta('txt {3}')).toEqual({
      language: 'txt', title: '', startLine: 1, lineNumbers: true,
      highlightedLines: [3]
    })
    expect(parseCodeMeta('text:no-line-numbers').lineNumbers).toBe(false)
    expect(parseCodeMeta('text {0,-1,8-3,1-9999999}').highlightedLines).toEqual([])
  })
  it('shares one lazy engine and matches build-time/browser output byte for byte', async () => {
    const [a, b] = await Promise.all([prepareCodeHighlighter(['js']), prepareCodeHighlighter(['typescript'])])
    expect(a).toBe(b)
    const source = 'const answer = 42\nconsole.log(answer)\n'
    const runtime = await highlightCode(source, 'js {2}')
    expect(runtime).toBe(highlightCodeSync(source, 'js {2}'))
    expect(runtime).toContain('--shiki-light:')
    expect(runtime).toContain('--shiki-dark:')
    expect(runtime).toContain('class="line highlighted"')
    expect(runtime).toContain('data-line="2"')
    expect(a.getLoadedLanguages()).not.toContain('cobol')
  })
  it('escapes unknown-language code instead of executing HTML', async () => {
    const html = await highlightCode('<script>alert(1)</script> {{ injected }}', 'unknown-label')
    expect(html).not.toContain('<script>')
    const host = document.createElement('div')
    host.innerHTML = html
    expect(host.querySelector('script')).toBeNull()
    expect(host.textContent).toBe('<script>alert(1)</script> {{ injected }}')
    expect(html).toContain('{{ injected }}')
  })
  it('applies fence line highlights and offsets without Shiki notation', async () => {
    const withNotation = await highlightCode(
      'const x = 1 // [!code ++]\nconst y = 2 // [!code focus]',
      'js:line-numbers=5 {2}',
    )
    // Magic comments stay as source text; Desk has no annotation write path.
    expect(withNotation).toContain('[!code ++]')
    expect(withNotation).not.toContain('diff add')
    expect(withNotation).not.toContain('focused')
    expect(withNotation).toContain('data-line="5"')
    expect(withNotation).toContain('data-line="6"')
    expect(withNotation).toContain('class="line highlighted"')
  })
})
