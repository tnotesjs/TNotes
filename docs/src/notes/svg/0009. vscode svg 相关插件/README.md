# [0009. vscode svg 相关插件](https://github.com/Tdahuyou/svg/tree/main/0009.%20vscode%20svg%20%E7%9B%B8%E5%85%B3%E6%8F%92%E4%BB%B6)

<!-- region:toc -->
- [1. 📒 SVG 插件简介](#1--svg-插件简介)
- [2. 📒 SVG Preview 插件简介](#2--svg-preview-插件简介)
- [3. 📒 SVG Snippets 插件简介](#3--svg-snippets-插件简介)
<!-- endregion:toc -->
- 记录在 vscode 上推荐安装的一些 svg 相关插件，这些插件的作用是让你在 vscode 中编写 svg 程序有更好的书写体验，安装和使用也非常简单，如果你发现某个插件不好使，完全可以直接删了，或者禁用它。
- 有关插件的详细描述说明，可自行查阅插件对应的官方文档，文中仅仅是对插件功能的简单描述。

## 1. 📒 SVG 插件简介

- https://marketplace.visualstudio.com/items?itemName=jock.svg
- ![](assets/2024-12-09-15-18-11.png)
- 开发环境如果是 vscode 的话，在学习 svg 之前，可以事先下载一些辅助学习的插件。这些插件在一定程度上能够帮助你快速编写 svg 程序，能少敲几下键盘。
- SVG 支持标签补全，属性补全等。当你在一个 `.svg` 文件中输入 `<` 时，会提示以下内容，此时直接按下 tab 即可快速生成一个根元素 `<svg>`。
  - `💻 demos.1`
  - ![](assets/2024-12-09-15-18-30.png)
  - ![](assets/2024-12-09-15-18-49.png)

## 2. 📒 SVG Preview 插件简介

- https://marketplace.visualstudio.com/items?itemName=SimonSiefke.svg-preview
- ![](assets/2024-12-09-15-19-00.png)
- SVG Preview 预览 svg 效果，当你打开一个 `.svg` 文件后，它会自动在侧边展示这个 svg 预览效果图。当你打开一个 `.svg` 文件后，会自动弹出一个 Preview 预览窗口。
  - ![](assets/2024-12-09-15-19-09.png)
- 这个预览窗口展示的效果是实时更新的，当你修改代码后，视图会立刻刷新。比如，你现在将矩形的颜色改为绿色，让你将 `red` 改为 `green` 之后，什么都不需要做，侧边的预览视图就会立刻更新到当前最新的状态。
  - ![](assets/2024-12-09-15-19-20.png)

## 3. 📒 SVG Snippets 插件简介

- https://marketplace.visualstudio.com/items?itemName=sidthesloth.svg-snippets
- ![](assets/2024-12-09-15-19-36.png)
- SVG Snippets 支持标签名补全标签。比如你在一个 svg 文件中输入 `svg-`，此时会弹出一个列表来给你选择。
  - `💻 demos.2`
  - ![](assets/2024-12-09-15-19-45.png)
  - 这个列表中包含了所有的 svg 元素。加入你想要快速生成一个绘制矩形的模板，你只需要输入 `svg-rect`。
  - ![](assets/2024-12-09-15-19-57.png)
  - 选择第一个，按下回车或 tab 键，即可快速生成绘制矩形的模板。
  - ![](assets/2024-12-09-15-20-06.png)
  - 在书写代码的时候，输入完一个值，按下 tab，光标会自动跳到下一个值输入的位置。
  - ![](assets/2024-12-09-15-20-32.png)

