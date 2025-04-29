# [0023. Writing on GitHub](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0023.%20Writing%20on%20GitHub)

<!-- region:toc -->

- [1. 🔗 Writing on GitHub](#1--writing-on-github)
- [2. 📒 github 对传统的 markdown 做了一些扩展](#2--github-对传统的-markdown-做了一些扩展)
  - [2.1. 💻 demo - Using emojis](#21--demo---using-emojis)
  - [2.2. 💻 demo - Alerts](#22--demo---alerts)

<!-- endregion:toc -->

## 1. 🔗 Writing on GitHub

> - https://docs.github.com/en/get-started/writing-on-github
>   - Writing on GitHub
>   - You can structure the information shared on GitHub with various formatting options.
>   - GitHub 官方文档详细介绍了如何使用 Markdown 以及其他一些特性来编写内容。
> - https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
>   - Create sophisticated formatting for your prose and code on GitHub with simple syntax.

- GitHub 对 Markdown 进行了扩展，有些写法是 GitHub 上特定支持的，在本地编写 markdown 时也许看不到效果。
- 如果在 github 上查看其他人写的文档时，发现一些特殊的效果不知道如何使用 markdown 来编写，那么可以到 `Writing on GitHub` 这篇官方提供的文档中找找看相应的语法介绍。比如下面这些 `emoji`、`Alerts`。
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-16-15-19-48.png)
- 这篇笔记所记录的内容，其实就是 Github 对 markdown 的特殊语法支持，比如 `emoji`、`Alerts`。
- 具体还有哪些其他特性，直接上官方文档 `Writing on GitHub` 查阅即可。

## 2. 📒 github 对传统的 markdown 做了一些扩展

- 以本节的俩 demo 为例，如果在本地展示的话，效果如下：
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-16-15-20-36.png)
  - 这使用的是 VSCode 中的 `markdown preview enhanced` 插件来预览 markdown 的效果截图。
- 如果上传到 github 上，展示效果如下：
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-10-16-15-19-48.png)

### 2.1. 💻 demo - Using emojis

::: code-group

```md [源码]
@octocat :+1: This PR looks great - it's ready to merge! :shipit:
```

:::

实际渲染效果：

@octocat :+1: This PR looks great - it's ready to merge! :shipit:

### 2.2. 💻 demo - Alerts

::: code-group

```md [源码]
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

:::

实际渲染效果：

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
