/**
 * Monaco 懒加载入口（全仓库唯一 import monaco-editor 的地方）。
 *
 * 两个环境事实决定这里的配置：
 *
 * 1. **生产环境渲染端是 `file://` 加载**（`window.loadFile`），Chromium 不允许
 *    从 file:// 起 Worker；CSP 又是 `script-src 'self'`，blob: 也被挡。
 *    所以这里不注册 worker（`getWorker` 直接抛明确错误），并把需要 worker 的能力
 *    全部关掉：JSON/YAML/TS 的诊断、diff 计算、基于词的建议、链接识别。
 *    只读查看与 Markdown 编辑都不依赖这些；真需要语言服务时，得先把渲染端改成
 *    自定义协议加载 —— 那是单独一件事，不在这里偷偷加 `unsafe-eval` 或放宽 CSP。
 * 2. **主题跟随 Desk 自己的色板**：从 `documentElement` 读 CSS 变量现算一套
 *    → 明暗切换不需要两套硬编码配色，也不会和编辑器区域脱节。
 */
import type * as MonacoApi from 'monaco-editor'

export type Monaco = typeof MonacoApi

const LIGHT_THEME = 'tnotes-light'
const DARK_THEME = 'tnotes-dark'

let loading: Promise<Monaco> | null = null
let configured = false

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

/**
 * 用 Desk 的 CSS 变量现算一套 Monaco 主题。
 *
 * Monaco 的主题是命令式 API（`defineTheme`），同一个名字重复定义就是覆盖，
 * 所以明暗切换直接重定义再 `setTheme`。
 */
function defineTheme(monaco: Monaco): void {
  const background = cssVar('--editor-bg', '#ffffff')
  const foreground = cssVar('--text', '#1f2328')
  const muted = cssVar('--muted', '#8a8a8a')
  const border = cssVar('--border', '#e5e7eb')
  const accent = cssVar('--accent-strong', '#3b82f6')
  const selection = cssVar('--selection', 'rgb(59 130 246 / 0.25)')

  const base: MonacoApi.editor.IStandaloneThemeData['base'] =
    document?.documentElement.dataset.theme === 'dark' ? 'vs-dark' : 'vs'
  monaco.editor.defineTheme(base === 'vs-dark' ? DARK_THEME : LIGHT_THEME, {
    base,
    inherit: true,
    rules: [
      { token: 'comment', foreground: muted.replace('#', '') },
      { token: 'keyword', foreground: accent.replace('#', '') }
    ],
    colors: {
      'editor.background': background,
      'editor.foreground': foreground,
      'editorLineNumber.foreground': muted,
      'editorLineNumber.activeForeground': foreground,
      'editor.lineHighlightBackground': border,
      'editor.selectionBackground': selection,
      'editorCursor.foreground': accent,
      'editorWidget.background': background,
      'editorWidget.border': border,
      'editorIndentGuide.background1': border,
      'scrollbarSlider.background': border
    }
  })
}

/** 当前应当使用的 Monaco 主题名（已定义；未加载时会先加载） */
export function monacoThemeName(): string {
  return document?.documentElement.dataset.theme === 'dark' ? DARK_THEME : LIGHT_THEME
}

/** 懒加载 Monaco（只加载一次），并把环境与主题配置好 */
export function loadMonaco(): Promise<Monaco> {
  loading ??= (async () => {
    const monaco = await import('monaco-editor')
    if (!configured) {
      configured = true
      // 见文件头：不注册 worker，明确抛错而不是静默挂起
      ;(self as unknown as { MonacoEnvironment?: unknown }).MonacoEnvironment = {
        getWorker: () => {
          throw new Error(
            'Desk 不注册 Monaco worker（file:// + CSP 限制）；需要语言服务请先改造渲染端加载方式'
          )
        }
      }
      // 语言特性（json/css/html/typescript）已被 alias 成空模块（见 electron.vite.config.ts）：
      // 做成空模块的目的就是不起 worker，所以这里没有需要"关掉"的默认值了。
    }
    defineTheme(monaco)
    return monaco
  })()
  return loading
}

/** 明暗主题变化时重算主题并广播（已挂载的编辑器各自 setTheme） */
export function refreshMonacoTheme(monaco: Monaco): void {
  defineTheme(monaco)
  monaco.editor.setTheme(monacoThemeName())
}

/** 只读文本查看器的默认配置（复用给其它只读场景） */
export function readOnlyEditorOptions(): MonacoApi.editor.IStandaloneEditorConstructionOptions {
  return {
    ...baseEditorOptions(),
    readOnly: true,
    domReadOnly: true,
    renderValidationDecorations: 'off',
    quickSuggestions: false,
    occurrencesHighlight: 'off',
    selectionHighlight: false
  }
}

/** 编辑器通用外观：跟随应用字体与行高，关掉不需要的重型功能 */
export function baseEditorOptions(): MonacoApi.editor.IStandaloneEditorConstructionOptions {
  return {
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    renderLineHighlight: 'none',
    fixedOverflowWidgets: true,
    smoothScrolling: true,
    fontFamily: cssVar('--font-mono', 'ui-monospace, SFMono-Regular, Menlo, monospace'),
    fontSize: 13,
    lineHeight: 20,
    padding: { top: 8, bottom: 8 },
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
    wordWrap: 'off',
    // 只读查看不需要这些
    folding: true,
    glyphMargin: false,
    lineNumbersMinChars: 3,
    tabSize: 2
  } as MonacoApi.editor.IStandaloneEditorConstructionOptions
}
