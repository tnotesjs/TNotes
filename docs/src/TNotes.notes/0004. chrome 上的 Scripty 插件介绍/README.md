# [0004. chrome 上的 Scripty 插件介绍](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0004.%20chrome%20%E4%B8%8A%E7%9A%84%20Scripty%20%E6%8F%92%E4%BB%B6%E4%BB%8B%E7%BB%8D)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 Scripty 在线配置](#2--scripty-在线配置)
- [3. 📒 使用说明](#3--使用说明)
- [4. 📒 Scripty vs. Tampermonkey](#4--scripty-vs-tampermonkey)
- [5. References](#5-references)

<!-- endregion:toc -->

## 1. 📝 概述

- 介绍了一款 chrome 插件 - `Scripty`，支持针对指定站点自定义 js 脚本。

## 2. 💻 Scripty 在线配置

- https://scripty.abhisheksatre.com/#/
  - 所有脚本都可以配置在这里边。
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-11-29-23-31-01.png)

## 3. 📒 使用说明

- **使用的前提**：要求懂一些 JavaScript，能够根据自己的需求编写网站脚本。
- **开/关**：需要用的时候将开关打开，不需要用的时候直接关闭掉即可。
- **如何使用**：
  - 以 `TNotes.ntoes.0003. 在 GitHub 上预览自己的笔记时处理一些默认样式` 为例，简单说明一下 Scripty 的基本使用。
    - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2024-11-29-23-07-30.png)
  - Name：脚本名称，可以随意填写。
  - Javascript Code：脚本内容，这里填写脚本代码。
  - Run script if：这部分填写的是脚本的运行条件，比如图中的配置就是网址中包含 `https://github.com/Tdahuyou` 这个字符串的都满足条件。
  - Trigger：配置触发脚本的时机，比如图片中配置的就是在页面完成加载之前，自动执行脚本。

## 4. 📒 Scripty vs. Tampermonkey

- 类似工具
  - [Tampermonkey - 油猴插件](https://tampermonkey.net/)
- 对比：
  - 两个工具都有在使用，都挺不错的。
  - Scripty 的页面更加干净，配置起来更方便，功能也基本够用了。
  - Tampermonkey 的功能比 Scripty 强大不少，受众应该也比 Scripty 多。

## 5. References

::: details

- 🔍 插件作者 abhisheksatre
  - https://www.abhisheksatre.com/
    - 作者的 blog
  - https://github.com/abhisheksatre
    - 作者的 github
- 油猴插件
  - https://tampermonkey.net/

:::
