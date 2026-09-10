export type ThemePreference = 'light' | 'dark' | 'system'

/** Explicit data-theme wins; safe during static/SSR rendering. */
export function isDarkTheme(root?: HTMLElement): boolean {
  root ??= typeof document === 'undefined' ? undefined : document.documentElement
  if (!root) return false
  if (root.dataset.theme === 'light') return false
  return root.dataset.theme === 'dark' || root.classList.contains('dark')
}

export function applyTheme(preference: ThemePreference, root = document.documentElement): void {
  const dark =
    preference === 'dark' ||
    (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  root.dataset.theme = dark ? 'dark' : 'light'
  root.classList.toggle('dark', dark)
}
