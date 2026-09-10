// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'

import { classifyChangePath } from './changeCategory'

describe('classifyChangePath', () => {
  it('classifies note files under notes/ as noteFile', () => {
    expect(classifyChangePath('notes/0070. CommonJS.md')).toBe('noteFile')
    expect(classifyChangePath('notes/0112.前端学习路线.md')).toBe('noteFile')
    expect(classifyChangePath('notes/0001.md')).toBe('noteFile')
    expect(classifyChangePath('notes/.trash/0005. Broken.md')).toBe('noteFile')
  })

  it('classifies knowledge-base root config files as configFile', () => {
    expect(classifyChangePath('TOC.md')).toBe('configFile')
    expect(classifyChangePath('tnotes.json')).toBe('configFile')
  })

  it('classifies leftover old paths as otherFile', () => {
    expect(classifyChangePath('sidebar.json')).toBe('otherFile')
    expect(classifyChangePath('.tnotes.json')).toBe('otherFile')
    expect(classifyChangePath('notes/0070. CommonJS/.tnotes.json')).toBe('otherFile')
    expect(classifyChangePath('notes/0070. CommonJS/README.md')).toBe('otherFile')
  })

  it('classifies everything else as otherFile', () => {
    expect(classifyChangePath('package.json')).toBe('otherFile')
    expect(classifyChangePath('pnpm-lock.yaml')).toBe('otherFile')
    expect(classifyChangePath('pnpm-workspace.yaml')).toBe('otherFile')
    expect(classifyChangePath('notes/0070. CommonJS/assets/1.md')).toBe('otherFile')
    expect(classifyChangePath('README.md')).toBe('otherFile')
  })

  it('normalizes Windows separators before classifying', () => {
    expect(classifyChangePath('notes\\0070. CommonJS.md')).toBe('noteFile')
  })
})
