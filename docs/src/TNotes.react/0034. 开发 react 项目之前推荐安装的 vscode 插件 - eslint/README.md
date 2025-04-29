# [0034. 开发 react 项目之前推荐安装的 vscode 插件 - eslint](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0034.%20%E5%BC%80%E5%8F%91%20react%20%E9%A1%B9%E7%9B%AE%E4%B9%8B%E5%89%8D%E6%8E%A8%E8%8D%90%E5%AE%89%E8%A3%85%E7%9A%84%20vscode%20%E6%8F%92%E4%BB%B6%20-%20eslint)

<!-- region:toc -->

- [1. 📒 eslint 概述](#1--eslint-概述)
- [2. 📒 安装 ESLint 插件](#2--安装-eslint-插件)
- [3. 📒 配置 ESLint 基本流程](#3--配置-eslint-基本流程)
- [4. 💻 demos.1 - 约束只能使用单引号，不能使用双引号](#4--demos1---约束只能使用单引号不能使用双引号)
- [5. 📒 注意事项](#5--注意事项)

<!-- endregion:toc -->
- vscode 中的 eslint 插件有什么用
- 如何引入并使用 eslint

## 1. 📒 eslint 概述

- `ESLint` 是一个用于识别和报告 JavaScript 代码中模式问题的工具，它可以帮助开发人员遵循一致的编码风格和避免错误。
- 在 VS Code 中安装 `ESLint` 插件可以让你在编写代码时即时获得 linting 反馈，从而提高代码质量和开发效率。
- **🤔 ESLint 有啥用？**
  - 统一代码规范……
  - 你可以自行配置 eslint 的检测规则，比如语句的结尾是否必须加分号，字符串应该是用单引号还是双引号，等一系列规范细节问题。当你的项目有人协同开发的时候，这个工具能够帮助团队成员保持一致的编码风格和代码质量。
  - 除了配置具体的检测规则，你也可以配置 eslint 的检测范围，比如哪些模块是需要检测的，哪些模块直接忽略。也可以通过一些特殊的注释来忽略某一行代码的检测，反正很灵活就对了。
  - 当代码出现规范问题的时候，eslint 也提供了自动修复机制，有一些错误是可以直接用 eslint 实现一键修复的。
  - 对于 eslint 有这么一个初步的认识基本就可以了，当你遇到代码规范问题的时候，能够想起它就行。
- **🤔 如果一个项目从始至终都是个人在写，有必要用到 eslint 吗？**
  - 可以选择不用……
  - 我就是直接关闭的
- **🤔 学习阶段要用 eslint 吗？**
  - 都行
  - 使用 eslint 也是有不少好处：帮你养成良好的代码规范。
    - 你可以按照笔记中提到的流程，把 eslint 安装好，然后全都使用默认的检测规则来编写代码，写一段时间后，就会发现 eslint 的作用，也能帮你了解到哪些写法可能是会存在隐患的，为什么 eslint 会提示你。
  - 个人选择是基本不用……

## 2. 📒 安装 ESLint 插件

1. 打开 VS Code。
2. 转到左侧活动栏中的“扩展”图标（或者使用快捷键 `Ctrl+Shift+X`）。
3. 在搜索框中输入 "ESLint" 并完成安装。
   1. ![](assets/2024-11-06-19-31-29.png)

## 3. 📒 配置 ESLint 基本流程

安装完插件后，你需要确保项目中已经配置了 ESLint。如果还没有配置，可以通过以下步骤来设置：

1. **安装 ESLint CLI 工具**：打开终端，运行 `npm install eslint --save-dev` 命令以安装 ESLint 到你的项目中。
2. **初始化 ESLint**：在项目根目录下运行 `npx eslint --init`，根据提示选择合适的配置选项来生成 `.eslintrc` 文件。这个文件定义了 ESLint 的规则和配置。
3. **配置 VS Code**：确保你的工作区或用户设置中启用了 ESLint 插件。你可以在 VS Code 的设置中搜索 `eslint`，并检查是否启用了如 `ESLint: Enable` 等相关选项。

```bash
$ npx eslint --init
# You can also run this command directly using 'npm init @eslint/config@latest'.
# Need to install the following packages:
# @eslint/create-config@1.4.0
# Ok to proceed? (y)


# > demo@1.0.0 npx
# > create-config

# @eslint/create-config: v1.4.0

# √ How would you like to use ESLint? · problems
# √ What type of modules does your project use? · esm
# √ Which framework does your project use? · react
# √ Does your project use TypeScript? · javascript
# √ Where does your code run? · browser
# The config that you've selected requires the following dependencies:

# eslint, globals, @eslint/js, eslint-plugin-react
# √ Would you like to install them now? · No / Yes
# √ Which package manager do you want to use? · pnpm
# ☕️Installing...
# Packages: +102
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Progress: resolved 188, reused 186, downloaded 2, added 102, done

# devDependencies:
# + @eslint/js ^9.14.0
# + eslint-plugin-react 7.37.2
# + globals 15.12.0

# Done in 5s
```

- **实时 linting**：一旦配置好，ESLint 插件会在你编辑文件时自动运行，标记出任何不符合配置规则的问题。
- **修复问题**：很多情况下，ESLint 插件提供了快速修复选项，允许你一键修正某些类型的错误或警告。
- **自定义规则**：你可以在 `.eslintrc` 文件中调整 ESLint 规则，以适应团队的具体需求或编码标准。

## 4. 💻 demos.1 - 约束只能使用单引号，不能使用双引号

::: code-group

```js [eslint.config.mjs 默认初始内容]
/**
 * eslint.config.mjs
 * 这是通过上述流程生成的默认的 eslint 的配置文件内容
 */
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
```

```js [eslint.config.mjs]
/**
 * eslint.config.mjs
 */
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  rules: {
      // 假如我们现在要加上约束：不能使用双引号，只能使用单引号。可以对默认的文件内容做以下修改：// [!code focus]
      // 添加 quotes 规则，确保只使用单引号 // [!code focus]
      'quotes': ['error', 'single'], // [!code focus]
    },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
```

:::

- 准备好测试文件 `src/index.jsx` 会发现里边不规范的写法立刻就报错了。（如果没有错误提示，可以尝试重启一下 vscode）

```js
// src/index.jsx
const foo = '123'
const bar = "123"

const myComp = () => {
    return <>eslint test</>
}
```

- 报错截图：
- ![](assets/2024-11-06-19-46-26.png)

## 5. 📒 注意事项

- **性能影响**：虽然 ESLint 对于提高代码质量非常有用，但大量的 lint 规则可能会对编辑器的响应速度产生一定影响。如果遇到性能问题，可以尝试减少规则数量或禁用一些不常用的规则。
- **与其他插件的兼容性**：确保 ESLint 插件与其他你正在使用的 VS Code 插件（如 Prettier）之间没有冲突。通常，可以通过适当的配置解决这些问题。

通过以上步骤，你就可以在 VS Code 中有效地使用 ESLint 插件来提高代码的质量和可维护性。
