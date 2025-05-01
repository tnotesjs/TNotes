# [0024. 在 GitHub 上编写内联公式需要和中文字符区分开](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0024.%20%E5%9C%A8%20GitHub%20%E4%B8%8A%E7%BC%96%E5%86%99%E5%86%85%E8%81%94%E5%85%AC%E5%BC%8F%E9%9C%80%E8%A6%81%E5%92%8C%E4%B8%AD%E6%96%87%E5%AD%97%E7%AC%A6%E5%8C%BA%E5%88%86%E5%BC%80)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 🔗 Writing on GitHub](#2--writing-on-github)
- [3. 📒 公式在 GitHub 上无法正常渲染的情况](#3--公式在-github-上无法正常渲染的情况)

<!-- endregion:toc -->

## 1. 📝 概述

- 该笔记记录了在 GitHub 上渲染数学公式的一个注意事项。

## 2. 🔗 Writing on GitHub

- https://docs.github.com/zh/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions
  - GitHub doc - 编写数学表达式 - 使用 Markdown 在 GitHub 上显示数学表达式。

## 3. 📒 公式在 GitHub 上无法正常渲染的情况

- 如果你在使用 Latex 格式来书写内联公式，那么可以使用 `$` 来包裹公式。但是需要注意的是，在 GitHub 上如果要正常渲染，需要确保 `$` 和中文字符区分开，即 —— **加空格**。

::: code-group

```md [不加空格的写法]
时间复杂度：$O(n)$
```

```md [加空格的写法]
时间复杂度： $O(n)$
```

:::

- 不加空格的写法
  - 时间复杂度：$O(n)$
    - 时间复杂度：`$O(n)$`
  - 在 GitHub 上看到的结果：![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-20-22-19-50.png)
- 加空格的写法
  - 时间复杂度： $O(n)$
    - 时间复杂度：` $O(n)$`
  - 在 GitHub 上看到的结果：![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-20-22-19-54.png)
- 注意：
  - 是否在公式和中文字符之间加空格，在本地（比如用 vsocde 或者 vitepress 来编写 markdown）对公式的正常渲染没啥影响，但是在 GitHub 上，如果公式和中文字符之间没有空格，那么公式将无法正常渲染。
  - 可以点击本节笔记标题，进入到 Github 上预览这个 README.md 笔记文档内容，会发现不加空格的写法会导致公式无法被正常解析。
