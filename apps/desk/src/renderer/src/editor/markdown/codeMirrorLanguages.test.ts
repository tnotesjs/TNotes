import { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { describe, expect, it } from 'vitest'

import { deskCodeMirrorLanguages, matchDeskLanguage, withFenceAliases } from './codeMirrorLanguages'

describe('deskCodeMirrorLanguages', () => {
  it('does not match py on the stock language-data list', () => {
    expect(LanguageDescription.matchLanguageName(languages, 'py', false)).toBeNull()
  })

  it('indexes py as an alias the way Crepe LanguageLoader does', () => {
    const map: Record<string, string> = {}
    for (const language of deskCodeMirrorLanguages) {
      for (const alias of language.alias) {
        map[alias] = language.name
      }
    }
    expect(map.py).toBe('Python')
    expect(map.python).toBe('Python')
  })

  it('matches common fence ids that language-data only lists as extensions', () => {
    expect(matchDeskLanguage('py')?.name).toBe('Python')
    expect(matchDeskLanguage('python')?.name).toBe('Python')
    expect(matchDeskLanguage('rs')?.name).toBe('Rust')
    expect(matchDeskLanguage('md')?.name).toBe('Markdown')
  })

  it('still matches ids that were already aliases', () => {
    expect(matchDeskLanguage('js')?.name).toBe('JavaScript')
    expect(matchDeskLanguage('ts')?.name).toBe('TypeScript')
    expect(matchDeskLanguage('yml')?.name).toBe('YAML')
    expect(matchDeskLanguage('sh')?.name).toBe('Shell')
  })

  it('leaves unknown fence ids unmatched', () => {
    expect(matchDeskLanguage('')).toBeNull()
    expect(matchDeskLanguage('not-a-language')).toBeNull()
  })

  it('keeps original names when cloning', () => {
    const cloned = withFenceAliases(languages)
    expect(cloned.map((item) => item.name)).toEqual(languages.map((item) => item.name))
  })
})
