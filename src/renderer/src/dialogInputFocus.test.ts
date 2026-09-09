// @vitest-environment happy-dom

import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { focusDialogInput, placeCaretAtEnd } from './dialogInputFocus'

describe('dialogInputFocus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    document.body.replaceChildren()
  })

  it('places the caret at the end of existing text', () => {
    const input = document.createElement('input')
    input.value = '0001. 笔记标题'
    document.body.append(input)

    placeCaretAtEnd(input)

    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(input.value.length)
    expect(input.selectionEnd).toBe(input.value.length)
  })

  it('retries focus after the Electron context-menu restore tick', async () => {
    const input = document.createElement('input')
    input.value = '分组'
    document.body.append(input)
    const decoy = document.createElement('button')
    document.body.append(decoy)

    const pending = focusDialogInput(() => input)
    await nextTick()
    decoy.focus()
    expect(document.activeElement).toBe(decoy)

    await vi.runAllTimersAsync()
    await pending

    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe('分组'.length)
  })
})
