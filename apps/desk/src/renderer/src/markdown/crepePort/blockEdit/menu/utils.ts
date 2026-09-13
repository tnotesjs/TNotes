export type SlashMenuItem = {
  label: string
  icon: string
  /**
   * Desk 扩展：额外搜索词（多对一，如 `:::tip` / `提示`）。
   *
   * 过滤会同时匹配 `label`、`keywords` 与 `shortcut`，所以**不需要**再把别名拼进
   * `label` 里凑 `includes`（迁移前是那么做的，配套还得用 DOM 观察器把别名从渲染文本里
   * 抠掉；那两处 hack 已随本改动删除）。
   */
  keywords?: string[]
  /** Desk 扩展：行尾展示的快捷词（如 `/mmd`），同样参与过滤。 */
  shortcut?: string
}
