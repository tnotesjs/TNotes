# [0004. egg-init 简介](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0004.%20egg-init%20%E7%AE%80%E4%BB%8B)

<!-- region:toc -->

- [1. 🔗 `egg-init` 的 Github 仓库链接](#1--egg-init-的-github-仓库链接)
- [2. 📒 `egg-init` 概述](#2--egg-init-概述)
- [3. 📒 boilerplate 样板项目](#3--boilerplate-样板项目)
- [4. 📒 `npm init egg` vs. `egg-init`](#4--npm-init-egg-vs-egg-init)

<!-- endregion:toc -->

## 1. 🔗 `egg-init` 的 Github 仓库链接

- https://github.com/eggjs/egg-init

## 2. 📒 `egg-init` 概述

- `egg-init` 是一个脚手架工具，用于快速生成 Egg.js 项目的初始结构。
- 它帮助开发者快速搭建项目目录、配置文件和基础代码，从而减少手动创建文件的工作量。
- **主要用途**
  - 创建新的 Egg.js 项目，新项目启动时，快速生成项目骨架。
  - 提供多种模板（如 `simple` 和 `full`），以满足不同项目的需求。
  - 自动初始化项目的基本依赖和目录结构，以便更好地遵循 Egg.js 的默认约定和最佳实践。
- **安装及实用示例**

```bash
# 需要通过 npm 全局安装：
npm install egg-init -g

# 运行以下命令创建一个新的 Egg.js 项目：
egg-init my-app --type=simple
# my-app 是项目名称。
# --type=simple 表示使用简单模板。
# 执行后，egg-init 会生成一个包含基本文件和目录的项目。
```

- **🤔 type 的值除了 simple 还能写什么呢？**
- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-09-57-27.png)

## 3. 📒 boilerplate 样板项目

::: code-group

```bash{6}
$ egg-init --help
# init egg project from boilerplate.
# Usage: egg-init [dir] --type=simple

# 选项：
#   --type          boilerplate type                                      [字符串]
#   --dir           target directory                                      [字符串]
#   --force, -f     force to override directory                             [布尔]
#   --template      local path to boilerplate                             [字符串]
#   --package       boilerplate package name                              [字符串]
#   --registry, -r  npm registry, support china/npm/custom, default to auto detect
#                                                                         [字符串]
#   --silent        don't ask, just use default value                       [布尔]
#   --version       显示版本号                                              [布尔]
#   -h, --help      显示帮助信息                                            [布尔]
```

```bash [npm search egg-boilerplate]
# egg-init 的模板类型依赖于具体的 boilerplate 配置，而不是硬编码在命令行工具中。
# 可以在 npm 上搜索以 egg-boilerplate- 开头的包，这些包可以作为 Egg.js 的样板。
$ npm search egg-boilerplate
```

```bash [查看输出]
detect-port
Node.js implementation of port detector
Version 2.1.0 published 2024-12-10 by fengmk2
Maintainers: fengmk2 xudafeng ziczhu
Keywords: detect port
https://npm.im/detect-port

egg-boilerplate-simple
boilerplate for egg quickstart
Version 3.7.0 published 2024-01-07 by fengmk2
Maintainers: akitasummer gxkl gemwuu eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl dead-horse popomore
https://npm.im/egg-boilerplate-simple

egg-boilerplate-ts
boilerplate for tegg
Version 2.0.1 published 2025-02-21 by fengmk2
Maintainers: atian25 wanghx fengmk2 popomore
https://npm.im/egg-boilerplate-ts

egg-logger
egg logger
Version 3.6.1 published 2024-12-22 by fengmk2
Maintainers: gxkl eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl gemwuu akitasummer popomore
https://npm.im/egg-logger

egg-boilerplate-plugin
boilerplate for egg plugin
Version 3.0.0 published 2025-02-04 by fengmk2
Maintainers: gxkl eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl gemwuu akitasummer
https://npm.im/egg-boilerplate-plugin

egg-view
Base view plugin for egg
Version 2.1.4 published 2023-02-03 by fengmk2
Maintainers: dead-horse atian25 fengmk2 popomore
Keywords: egg eggPlugin egg-plugin egg-view view
https://npm.im/egg-view

egg-utils
Utils for all egg projects
Version 2.5.0 published 2023-04-26 by fengmk2
Maintainers: akitasummer gxkl gemwuu eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl popomore
Keywords: egg utils
https://npm.im/egg-utils

egg-boilerplate-base
base class for egg boilerplate
Version 0.0.0 published 2018-07-12 by atian25
Maintainers: atian25
https://npm.im/egg-boilerplate-base

egg-session
session plugin for egg
Version 3.3.0 published 2021-03-23 by popomore
Maintainers: atian25 dead_horse fengmk2 popomore eggjs-admin
Keywords: egg egg-plugin eggPlugin session cookie
https://npm.im/egg-session

egg-errors
egg-errors provide two kinds of errors that is Error and Exception.
Version 2.3.2 published 2022-12-18 by fengmk2
Maintainers: akitasummer gxkl gemwuu eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl popomore mansonchor
https://npm.im/egg-errors

egg
A web framework's framework for Node.js
Version 3.30.1 published 2025-01-19 by fengmk2
Maintainers: gxkl eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl gemwuu akitasummer shaoshuai0102 popomore
Keywords: web app http application framework middleware koa egg
https://npm.im/egg

egg-development
development tool for egg
Version 3.0.2 published 2024-12-22 by fengmk2
Maintainers: jtyjty99999 atian25 dead_horse fengmk2 popomore eggjs-admin
Keywords: egg plugin egg-plugin eggPlugin
https://npm.im/egg-development

egg-core
A core Pluggable framework based on koa
Version 5.5.1 published 2025-01-22 by fengmk2
Maintainers: gxkl eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl gemwuu akitasummer gxcsoccer popomore
Keywords: egg loader
https://npm.im/egg-core

egg-bin
egg developer tool
Version 6.13.0 published 2024-12-11 by fengmk2
Maintainers: gxkl eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl gemwuu akitasummer popomore
https://npm.im/egg-bin

egg-path-matching
match or ignore url path
Version 2.1.0 published 2024-09-18 by fengmk2
Maintainers: dead_horse fengmk2
Keywords: url match ignore
https://npm.im/egg-path-matching

egg-schedule
schedule plugin for egg, support corn job.
Version 4.0.1 published 2024-03-06 by fengmk2
Maintainers: akitasummer gxkl gemwuu eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl popomore
Keywords: egg egg-plugin eggPlugin schedule cron
https://npm.im/egg-schedule

egg-onerror
error handler for egg
Version 2.4.0 published 2024-10-13 by fengmk2
Maintainers: atian25 dead_horse wanghx fengmk2 popomore eggjs-admin
Keywords: egg egg-plugin onerror
https://npm.im/egg-onerror

egg-ts-helper
egg typescript helper
Version 3.1.1 published 2025-03-05 by fengmk2
Maintainers: wanghx fengmk2
Keywords: egg typescript
https://npm.im/egg-ts-helper

egg-cookies
cookies module for egg
Version 2.10.1 published 2024-07-06 by fengmk2
Maintainers: atian25 dead_horse wanghx fengmk2 popomore
https://npm.im/egg-cookies

egg-static
static server plugin for egg
Version 2.3.1 published 2023-02-13 by fengmk2
Maintainers: akitasummer gxkl gemwuu eggjs-admin fengmk2 atian25 dead_horse wanghx hyj1991 killagu coolme200 mansonchor.zzw hubcarl popomore
Keywords: egg egg-plugin eggPlugin static
https://npm.im/egg-static
```

:::

- 根据你的需求选择合适的模板类型：

| 模板名称 | 适用场景                   | 特点                              |
| -------- | -------------------------- | --------------------------------- |
| `simple` | 快速启动小型项目或学习用途 | 简单、轻量，包含最基本的目录结构  |
| `ts`     | 使用 TypeScript 开发的项目 | 支持 TypeScript，适合现代开发流程 |
| `plugin` | 开发 Egg.js 插件           | 包含插件开发所需的目录和配置      |
| ……       | ……                         | ……                                |

- 在你执行 `npm init egg --type=simple` 命令的时候，会提醒你选择模板类型。
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-09-08-58-15.png)

## 4. 📒 `npm init egg` vs. `egg-init`

- **🤔 官方推荐的 `npm init egg` 和本节提到的 `egg-init` 之间有什么关联吗？**

| 特性                          | `npm init egg`               | `egg-init`                      |
| ----------------------------- | ---------------------------- | ------------------------------- |
| **是否需要全局安装 `egg-init`** | 不需要                       | 需要全局安装 `egg-init`         |
| **依赖管理**                  | 自动安装 `create-egg` 并运行 | 依赖全局安装的 `egg-init`       |
| **兼容性**                    | 更现代化，推荐使用           | 传统方式，仍然有效              |
| **命令示例**                  | `npm init egg --type=simple` | `egg-init my-app --type=simple` |

- `npm init` 是 npm 提供的一个命令，用于快速初始化项目。
- 除了默认的 `npm init`（生成 `package.json` 文件）之外，npm 还支持通过以下方式调用第三方工具：

```bash
npm init <initializer> [args...]
```

- 这里的 `<initializer>` 是一个 npm 包的名称，通常以 `create-` 为前缀。例如：
  - `npm init react-app` 实际上会调用 `create-react-app`。
  - `npm init vue` 实际上会调用 `create-vue`。
- 对于 Egg.js 来说，`npm init egg` 实际上会调用 `create-egg` 工具，而 `create-egg` 内部使用了 `egg-init` 来完成项目的初始化。
- 因此，`npm init egg` 只是 `egg-init` 的一种更高层次的封装，目的是让开发者无需全局安装 `egg-init`，而是通过 npm 自动处理依赖和初始化过程。

---

- **🤔 如何证明 create-egg 中集成了 egg-init 呢？**

:::code-group

```bash [npm view create-egg]
# 将 create-egg 包的元数据打印出来看看
$ npm view create-egg
```

```bash{2,13-14} [输出结果]
create-egg@3.0.0 | MIT | deps: 1 | versions: 9
Alias for egg-init, so you could use `npm init egg showcase`.
https://github.com/eggjs/create-egg

bin: create-egg

dist
.tarball: https://registry.npmjs.org/create-egg/-/create-egg-3.0.0.tgz
.shasum: 2695936f3f20914a5791ed49a2a2d217b65dd898
.integrity: sha512-k3jNtw1vfMUrbO4YNAXnhbhykk3KxGkLH5J4sgM3CUsgh6haaiy0DqgRyaI9X0VOtXMTJFXGr+k1rvRVveW3hg==
.unpackedSize: 4.0 kB

dependencies:
egg-init: 3

maintainers:
- akitasummer <644171127@qq.com>
- gxkl <gxkl203@gmail.com>
- gemwuu <gemwuu@gmail.com>
- eggjs-admin <fengmk2+eggjs@gmail.com>
- fengmk2 <fengmk2@gmail.com>
- atian25 <atian25@qq.com>
- dead_horse <dead_horse@qq.com>
- wanghx <whxaxes@gmail.com>
- hyj1991 <yeekwanvong@gmail.com>
- killagu <killa07071201@gmail.com>
- coolme200 <2001-wms@163.com>
- mansonchor.zzw <mansonchor1987@gmail.com>
- hubcarl <hubcarl@126.com>

dist-tags:
latest: 3.0.0
```

:::

- 从 `npm view create-egg` 输出中，可以清楚地看到 `create-egg` 对 `egg-init` 的依赖关系。
- `Alias for egg-init, ...` 开头信息明确提到 `create-egg` 是 `egg-init` 的别名（alias）。
- 这里的 `dependencies` 字段列出了 `create-egg` 包的直接依赖项。
- `egg-init: 3` 表示 `create-egg` 依赖于 `egg-init`，并且要求其版本为 `3.x.x`（语义化版本控制）。

---

- **🤔 为什么官方推荐 `npm init egg`？**
  - 1️⃣ **简化流程**
    - 无需全局安装 egg-init 即可完成 Egg.js 项目的初始化。
    - 使用 `npm init egg` 时，npm 会自动安装所需的依赖（如 `create-egg`），避免了手动安装 `egg-init` 的麻烦。
  - 2️⃣ **确保工具链的灵活性和一致性**
    - 避免因全局安装 egg-init 而导致版本锁定问题，确保每次初始化项目时使用的是最新或指定版本的工具链。
    - 当你运行 `npm init egg` 时，npm 会在后台查找名为 `create-egg` 的包，如果本地尚未安装 `create-egg`，npm 会自动从 npm 注册表中下载并安装它。
    - 安装是临时的，`create-egg` 会被安装到一个临时目录中（通常是 npm 的缓存目录），而不是全局或项目中，不会污染全局环境或项目依赖。
      - 这就意味着每次跑 `npm init egg` 来初始化 Egg.js 工程的时候，走的都是官方指定的最新版去初始化工程。
    - 安装完成后，npm 会立即运行 `create-egg`，并将命令行参数（如 `--type=simple`）传递给它。

---

- **📝 小结**
  - `npm init egg` 是 Egg.js 官方推荐的现代化项目初始化方式，它是对 `egg-init` 的封装。
  - `egg-init` 是底层工具，可以直接使用，但需要全局安装。
  - 如果你是新手或希望简化流程，建议使用 `npm init egg`。
  - 如果你已经熟悉 `egg-init` 或需要更高的灵活性，可以直接使用 `egg-init`。
  - 无论选择哪种方式，最终的效果是一样的：生成一个基于指定模板的 Egg.js 项目结构。
