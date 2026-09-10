/**
 * Capability flags for WordList. Defaults are full (web / core).
 * Hosts that need a quieter preview (e.g. Desk) pass WORD_LIST_FEATURES_STATIC.
 */
export interface WordListFeatures {
  /** Hover / pinned definition cards. */
  enableCards: boolean
  /** Fetch & preload dictionary markdown for cards / failed-word styling. */
  enableWordData: boolean
  /** Context-menu "Pin". */
  enableContextMenuPin: boolean
  /** Context-menu "Auto Show Card". */
  enableContextMenuAutoShowCard: boolean
}

export const WORD_LIST_FEATURES_FULL: Readonly<WordListFeatures> = Object.freeze({
  enableCards: true,
  enableWordData: true,
  enableContextMenuPin: true,
  enableContextMenuAutoShowCard: true
})

/** Preview-safe preset: list + check + pronounce; no cards / network / pin / auto-card. */
export const WORD_LIST_FEATURES_STATIC: Readonly<WordListFeatures> = Object.freeze({
  enableCards: false,
  enableWordData: false,
  enableContextMenuPin: false,
  enableContextMenuAutoShowCard: false
})

export function resolveWordListFeatures(
  partial?: Partial<WordListFeatures> | null
): WordListFeatures {
  return {
    ...WORD_LIST_FEATURES_FULL,
    ...(partial ?? {})
  }
}
