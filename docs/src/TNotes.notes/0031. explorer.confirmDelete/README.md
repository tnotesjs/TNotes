# [0031. explorer.confirmDelete](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0031.%20explorer.confirmDelete)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 `explorer.confirmDelete` 配置简介](#2--explorerconfirmdelete-配置简介)

<!-- endregion:toc -->

## 1. 📝 概述

- 介绍 VS Code 的一个配置 `confirmDelete` 的作用及其使用场景。

## 2. 📒 `explorer.confirmDelete` 配置简介

- `explorer.confirmDelete` 配置字段的默认值为 `true`，意味着在删除资源的时候，会弹出确认提示框：
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-27-22-31-09.png)

::: code-group

```json [.vscode/settings.json]
{
  "explorer.confirmDelete": false
  // 如果将其改为 false，意味着删除资源的时候会直接删掉，不会再弹出确认提示。
}
```

:::

- 【不再询问】相当于将 `explorer.confirmDelete` 配置为 `false`。
  - 在 VSCode 中删除文件，默认会弹出确认提示框，若有在 VSCode 中频繁删除文件的需求，可能会勾选【不再询问】，若勾选了，那么接下来每次删除内容的时候，就不会再弹出提示框了。
- 【注意】小心误删
  - 勾选上【不再询问】之后，如果是 macOS 系统，你只需要按下键盘上的 Del 键即可删除文件或者目录。在有频繁需要删除的内容的情况下，这可能确实提供了便利。但频繁删除文件可能仅仅是你某一时段的需求，后续也许就不再需要了，到时候不小心按下 Del 键的话，就会导致内容被误删了。
  - 虽然大多数时候可以通过 cmd z 撤销删除，找回文件，但有些时候是没法恢复的。
    - 有些时候当你意识到误删了，可能已经不知道应该撤销到之前的第几步了。
    - 编辑器重开，会导致撤销操作失效。
  - 这里写这么多，主要是个人在使用时遇到的问题，不小心删了比较重要的内容，找回的过程很费精力，还不如一开始就不关闭这个确认提示框嘞。
- 【使用场景】
  - **需要删除的模块比较分散，数量比较多，想要在删除的时候不要每次都弹出一个确认框。**
  - ⚠️ 删完之后记得恢复确认提示。
- **🤔 如果还想恢复确认提示的话，应该怎么做？**
  - 配置界面：
    - 这东西是可以支持配置的，打开【设置】，搜索 delete，找到 Confirm Delete 选项，勾选上确认提示框即可。
    - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-27-22-31-12.png)
  - 配置文件：
    - 直接设置 `"explorer.confirmDelete": true`
