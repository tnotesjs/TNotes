# [0041. 常见的 npm 命令](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0041.%20%E5%B8%B8%E8%A7%81%E7%9A%84%20npm%20%E5%91%BD%E4%BB%A4)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 npm 命令 - 安装包](#2--npm-命令---安装包)
- [3. 💻 npm 命令 - 查看已安装的包](#3--npm-命令---查看已安装的包)
- [4. 💻 npm 命令 - 卸载包](#4--npm-命令---卸载包)
- [5. 💻 npm 命令 - 更新包](#5--npm-命令---更新包)
- [6. 💻 npm 命令 - 查看 npm 版本](#6--npm-命令---查看-npm-版本)
- [7. 💻 npm 命令 - 查看 Node.js 版本](#7--npm-命令---查看-nodejs-版本)
- [8. 💻 npm 命令 - 清理缓存](#8--npm-命令---清理缓存)
- [9. 💻 npm 命令 - 搜索包](#9--npm-命令---搜索包)
- [10. 💻 npm 命令 - 查看包信息](#10--npm-命令---查看包信息)
- [11. 💻 npm 命令 - 初始化项目](#11--npm-命令---初始化项目)
- [12. 💻 npm 命令 - 运行脚本](#12--npm-命令---运行脚本)
- [13. 💻 npm 命令 - 查看帮助文档](#13--npm-命令---查看帮助文档)
- [14. 💻 npm 命令 - 查看 npm 配置](#14--npm-命令---查看-npm-配置)

<!-- endregion:toc -->

## 1. 📒 概述

- npm 提供了丰富的命令来管理包、依赖和项目。
- 本文记录了一些常用的 npm 命令及其用途。

## 2. 💻 npm 命令 - 安装包

```bash
# 根据 package.json 文件中记录的依赖信息，安装项目所需的所有依赖。
npm install
```

```bash
# 安装全局包
npm install -g <package-name>

# 作用：全局安装指定的包，使其在系统中可用。
# 示例：
npm install -g create-react-app
```

```bash
# 安装本地包
npm install <package-name>

# 作用：将指定的包安装到当前项目的 node_modules 目录，并更新 package.json 文件中的依赖列表。
# 示例：
npm install express
```

```bash
# 安装特定版本的包
npm install <package-name>@<version>

# 作用：安装指定版本的包。
npm install react@18.2.0
```

```bash
# 安装开发依赖
npm install --save-dev <package-name>

# 作用：将指定的包作为开发依赖安装，并将其添加到 devDependencies 中。
# 示例：
npm install --save-dev eslint
```

```bash
# 简写
npm i

# 上述所有的 npm install 都可以直接简写为 npm i
```

## 3. 💻 npm 命令 - 查看已安装的包

```bash
# 查看全局安装的包
npm list -g --depth=0

# 作用：列出所有全局安装的包。
# 示例：
npm list -g --depth=0
# /Users/huyouda/.nvm/versions/node/v20.14.0/lib
# ├── @yuque/sdk@1.1.1
# ├── corepack@0.28.1
# ├── create-react-app@5.0.1
# ├── egg-init@3.1.0
# ├── less@4.2.0
# ├── live-server@1.2.2
# ├── my-module@
# ├── npm@10.9.2
# ├── nrm@2.0.1
# ├── pnpm@10.6.3
# ├── sass@1.77.6
# └── tnotes@0.0.1 -> ./../../../../../zm/notes/_
```

```bash
# 查看本地安装的包
npm list

# 作用：列出当前项目中安装的所有包及其依赖关系。
# 示例：
npm list
# TNotes.nodejs@ /Users/huyouda/zm/notes/TNotes.nodejs
# ├── dayjs@1.11.13
# ├── github-slugger@2.0.0
# ├── markdown-it-container@4.0.0
# ├── markdown-it-link-attributes@4.0.1
# ├── markdown-it-mathjax3@4.3.2
# ├── markdown-it-task-lists@2.1.1
# ├── mermaid@11.5.0
# ├── minimist@1.2.8
# ├── swiper@11.2.5
# ├── vitepress-plugin-mermaid@2.0.17
# └── vitepress@1.6.3
```

## 4. 💻 npm 命令 - 卸载包

```bash
# 卸载全局包
npm uninstall -g <package-name>

# 作用：卸载全局安装的指定包。
# 示例：
npm uninstall -g create-react-app
```

```bash
# 卸载本地包
npm uninstall <package-name>

# 作用：从当前项目中卸载指定的包，并移除其依赖关系。
# 示例：
npm uninstall express
```

- `npm uninstall` 会自动检测包是在 `dependencies` 还是 `devDependencies` 中，并从相应的位置移除，无需额外指定 `--save-dev` 或 `-D`。
- 如果要卸载的软件包是全局安装的，则需要添加 `--global` 或 `-g` 标志。

```bash
npm uninstall express --global
npm uninstall express -g
```

## 5. 💻 npm 命令 - 更新包

```bash
# 更新全局包
npm update -g

# 作用：更新所有全局安装的包到最新版本。
```

```bash
# 更新本地包
npm update

# 作用：更新当前项目中所有依赖包到最新版本。
```

```bash
# 更新单个包
npm update <package-name>

# 作用：仅更新指定的包到最新版本。
# 示例：
npm update express
# 这个升级会根据 package.json 中记录的语义化版本范围来升级。
# 比如最新版本是 "v2.0.0"
# 当前 package.json 中记录的语义版本是 "^1.2.3"
# 使用 npm update express 命令作版本升级的时候，主版本号 v1 不会升级，只会升级次版本号和补丁版本号，再怎么升都升不到 v2。

npm update express@latest
# 这会直接安装最新的包。
```

- 使用 `npm update` 命令更新软件包版本时，只更新次版本或补丁版本，并且在更新时，`package.json` 文件中的版本信息保持不变，但是 `package-lock.json` 文件会被新版本填充。
- 如果要更新主版本，则需要全局地安装 `npm-check-updates` 软件包。

```bash
# 全局安装 npm-check-updates
npm install -g npm-check-updates

# 检查可更新的依赖
ncu

# 使用 npm-check-updates 更新 package.json 中所有包的版本范围
ncu -u
# 这样即可升级 package.json 文件的 dependencies 和 devDependencies 中的所有版本，以便 npm 可以安装新的主版本。
# 注意：ncu -u 会更新依赖的主版本，这可能导致破坏性变更，升级需谨慎。
```

## 6. 💻 npm 命令 - 查看 npm 版本

```bash
# 查看当前 npm 版本
npm -v

# 作用：显示当前安装的 npm 版本号。
# 示例：
npm -v
# 11.2.0
```

## 7. 💻 npm 命令 - 查看 Node.js 版本

```bash
# 查看当前 Node.js 版本
node -v

# 作用：显示当前安装的 Node.js 版本号。
# 示例：
node -v
# v23.11.0
```

## 8. 💻 npm 命令 - 清理缓存

```bash
# 清除 npm 缓存
npm cache clean --force

# 作用：强制清除 npm 的缓存文件，解决因缓存问题导致的安装失败。
```

## 9. 💻 npm 命令 - 搜索包

```bash
# 搜索 npm 包
npm search <keyword>

# 作用：根据关键词搜索 npm 注册表中的包。
# 示例：
npm search react
# react
# React is a JavaScript library for building user interfaces.
# Version 19.1.0 published 2025-03-28 by react-bot
# Maintainers: fb react-bot
# Keywords: react
# https://npm.im/react

# react-is
# Brand checking of React Elements.
# Version 19.1.0 published 2025-03-28 by react-bot
# Maintainers: fb react-bot
# Keywords: react
# https://npm.im/react-is

# react-dom
# React package for working with the DOM.
# Version 19.1.0 published 2025-03-28 by react-bot
# Maintainers: fb react-bot
# Keywords: react
# https://npm.im/react-dom

# @types/react
# TypeScript definitions for react
# Version 19.1.0 published 2025-04-02 by types
# Maintainers: types
# https://npm.im/@types/react

# react-router
# Declarative routing for React
# Version 7.5.0 published 2025-04-04 by mjackson
# Maintainers: mjackson timdorr chancestrickland brophdawg11
# Keywords: react router route routing history link
# https://npm.im/react-router

# react-refresh
# React is a JavaScript library for building user interfaces.
# Version ...
# ...

# 带有 react 关键字的包还有很多。
```

## 10. 💻 npm 命令 - 查看包信息

```bash
# 查看包详细信息
npm info <package-name>

# 作用：显示指定包的详细信息，包括版本、描述、依赖等。
# 示例：
npm info express
# express@5.1.0 | MIT | deps: 27 | versions: 283
# Fast, unopinionated, minimalist web framework
# https://expressjs.com/

# keywords: express, framework, sinatra, web, http, rest, restful, router, app, api

# dist
# .tarball: https://registry.npmmirror.com/express/-/express-5.1.0.tgz
# .shasum: d31beaf715a0016f0d53f47d3b4d7acf28c75cc9
# .integrity: sha512-DT9ck5YIRU+8GYzzU5kT3eHGA5iL+1Zd0EutOmTE9Dtk+Tvuzd23VBU+ec7HPNSTxXYO55gPV/hq4pSBJDjFpA==
# .unpackedSize: 197.0 kB

# dependencies:
# accepts: ^2.0.0             cookie: ^0.7.1              finalhandler: ^2.1.0        on-finished: ^2.4.1         range-parser: ^1.2.1
# body-parser: ^2.2.0         debug: ^4.4.0               fresh: ^2.0.0               once: ^1.4.0                router: ^2.2.0
# content-disposition: ^1.0.0 encodeurl: ^2.0.0           http-errors: ^2.0.0         parseurl: ^1.3.3            send: ^1.1.0
# content-type: ^1.0.5        escape-html: ^1.0.3         merge-descriptors: ^2.0.0   proxy-addr: ^2.0.7          serve-static: ^2.2.0
# cookie-signature: ^1.2.1    etag: ^1.8.1                mime-types: ^3.0.0          qs: ^6.14.0
# (...and 3 more.)

# maintainers:
# - wesleytodd <wes@wesleytodd.com>
# - jonchurch <npm@jonchurch.com>
# - ctcpip <c@labsector.com>
# - sheplu <jean.burellier@gmail.com>

# dist-tags:
# latest: 5.1.0    latest-4: 4.21.2

# published 5 days ago by wesleytodd <wes@wesleytodd.com>
```

```bash
# 查看 npm 包的许可证
npm view <package-name> license

# 作用：显示指定包的许可证类型。
# 示例：
npm view express license
# MIT
```

```bash
# 查看 npm 包的作者信息
npm view <package-name> author

# 作用：显示指定包的作者信息。
# 示例：
npm view express author
# TJ Holowaychuk <tj@vision-media.ca>
```

```bash
# 查看 npm 包的版本
npm view <package-name> version

# 作用：显示指定包的版本信息。
# 示例：
npm view express version
# 5.1.0

npm view vue version
# 3.5.13

npm view react version
# 19.1.0
```

## 11. 💻 npm 命令 - 初始化项目

```bash
# 创建一个新的 npm 项目
npm init [-y]

# 作用：生成一个 package.json 文件，用于管理项目的元数据和依赖。
# 参数：
# -y：自动使用默认配置，无需交互式输入。
# 示例：
npm init -y
```

## 12. 💻 npm 命令 - 运行脚本

```bash
# 运行自定义脚本
npm run <script-name>

# 作用：执行 package.json 中定义的自定义脚本。
# 示例：
npm run tn:dev
```

## 13. 💻 npm 命令 - 查看帮助文档

```bash
# 查看 npm 帮助信息
npm help

# 作用：显示 npm 的帮助文档，包含常用命令和选项的说明。
# 示例：
npm help
# npm <command>

# Usage:

# npm install        install all the dependencies in your project
# npm install <foo>  add the <foo> dependency to your project
# npm test           run this project's tests
# npm run <foo>      run the script named <foo>
# npm <command> -h   quick help on <command>
# npm -l             display usage info for all commands
# npm help <term>    search for help on <term>
# npm help npm       more involved overview

# All commands:

#     access, adduser, audit, bugs, cache, ci, completion,
#     config, dedupe, deprecate, diff, dist-tag, docs, doctor,
#     edit, exec, explain, explore, find-dupes, fund, get, help,
#     help-search, init, install, install-ci-test, install-test,
#     link, ll, login, logout, ls, org, outdated, owner, pack,
#     ping, pkg, prefix, profile, prune, publish, query, rebuild,
#     repo, restart, root, run-script, sbom, search, set,
#     shrinkwrap, star, stars, start, stop, team, test, token,
#     undeprecate, uninstall, unpublish, unstar, update, version,
#     view, whoami

# Specify configs in the ini-formatted file:
#     /Users/huyouda/.npmrc
# or on the command line via: npm <command> --key=value

# More configuration info: npm help config
# Configuration fields: npm help 7 config

# npm@11.2.0 /Users/huyouda/.nvm/versions/node/v23.11.0/lib/node_modules/npm
```

## 14. 💻 npm 命令 - 查看 npm 配置

```bash
# 查看全局配置
npm config list

# 作用：显示当前的 npm 全局配置。
# 示例：
npm config list
# ; "user" config from /Users/huyouda/.npmrc

# //registry.npmjs.org/:_authToken = (protected)
# registry = "https://registry.npmmirror.com/"

# ; node bin location = /Users/huyouda/.nvm/versions/node/v23.11.0/bin/node
# ; node version = v23.11.0
# ; npm local prefix = /Users/huyouda/zm/notes/TNotes.nodejs
# ; npm version = 11.2.0
# ; cwd = /Users/huyouda/zm/notes/TNotes.nodejs
# ; HOME = /Users/huyouda
# ; Run `npm config ls -l` to show all defaults.
```

```bash
# 设置配置项
npm config set <key> <value>

# 作用：设置或修改 npm 的配置项。
# 示例：
npm config set registry https://registry.npmmirror.com/
```
