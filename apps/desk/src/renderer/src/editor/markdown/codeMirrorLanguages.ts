import { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'

/**
 * Crepe / Milkdown match fence info with `LanguageDescription.alias` only.
 * `@codemirror/language-data` often stores short ids (`py`, `rs`, `md`) as
 * file extensions, so clone those onto alias without changing fence source.
 */
export function withFenceAliases(descs: readonly LanguageDescription[]): LanguageDescription[] {
  return descs.map((desc) => {
    const extra = desc.extensions.filter((ext) => !desc.alias.includes(ext.toLowerCase()))
    if (extra.length === 0) return desc
    return LanguageDescription.of({
      name: desc.name,
      alias: [...desc.alias.filter((alias) => alias !== desc.name.toLowerCase()), ...extra],
      extensions: [...desc.extensions],
      ...(desc.filename ? { filename: desc.filename } : {}),
      load: () => desc.load()
    })
  })
}

export const deskCodeMirrorLanguages = withFenceAliases(languages)

export function matchDeskLanguage(language: string): LanguageDescription | null {
  const name = language.trim()
  if (!name) return null
  return LanguageDescription.matchLanguageName(deskCodeMirrorLanguages, name, false)
}
