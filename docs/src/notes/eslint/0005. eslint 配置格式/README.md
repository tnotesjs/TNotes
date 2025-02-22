# [0005. eslint 配置格式](https://github.com/Tdahuyou/eslint/tree/main/0005.%20eslint%20%E9%85%8D%E7%BD%AE%E6%A0%BC%E5%BC%8F)

<!-- region:toc -->
- [1. 📒 eslint 的配置文件都有哪些格式？](#1--eslint-的配置文件都有哪些格式)
- [2. 💻 `.eslintrc.js` (JavaScript)](#2--eslintrcjs-javascript)
- [3. 💻 `.eslintrc.json` (JSON)](#3--eslintrcjson-json)
- [4. 💻 `.eslintrc.yaml` 或 `.eslintrc.yml` (YAML)](#4--eslintrcyaml-或-eslintrcyml-yaml)
- [5. 💻 `.eslintrc.cjs` (CommonJS)](#5--eslintrccjs-commonjs)
- [6. 💻 包管理器配置文件（如 `package.json`）](#6--包管理器配置文件如-packagejson)
<!-- endregion:toc -->

## 1. 📒 eslint 的配置文件都有哪些格式？

- ESLint 支持多种配置文件格式，每种格式都有其特点和适用场景。以下是 ESLint 支持的主要配置文件格式：
  - `.eslintrc.js` (JavaScript)
  - `.eslintrc.json` (JSON)
  - `.eslintrc.yaml` 或 `.eslintrc.yml` (YAML)
  - `.eslintrc.cjs` (CommonJS)
  - 包管理器配置文件（如 `package.json`）
- 选择哪种格式主要取决于你的个人偏好以及项目的具体需求。通常情况下，如果不需要复杂的逻辑，推荐使用 `.eslintrc.json` 或者 `.eslintrc.yaml`，因为它们清晰且易于维护。如果你需要动态生成配置，则可以选择 `.eslintrc.js` 或 `.eslintrc.cjs`。

## 2. 💻 `.eslintrc.js` (JavaScript)

 - 这是一个 JavaScript 文件，允许使用完整的 JavaScript 语法来定义配置。
 - 适合需要动态生成配置或者需要更复杂的逻辑的情况。
 - 示例：

```javascript
module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        quotes: ['error', 'single'],
    },
};
```

## 3. 💻 `.eslintrc.json` (JSON)

- 这是最常用的配置文件格式之一，因为它简单直观且易于阅读。
- 适合静态配置，不包含任何逻辑。
- 示例：

```json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "quotes": ["error", "single"]
    }
}
```

## 4. 💻 `.eslintrc.yaml` 或 `.eslintrc.yml` (YAML)

- YAML 格式比 JSON 更简洁，并且支持注释。
- 适用于喜欢简洁配置文件的用户。
- 示例：

```yaml
env:
  browser: true
  es2021: true
extends: eslint:recommended
parserOptions:
  ecmaVersion: 12
  sourceType: module
rules:
  quotes: [error, single]
```

## 5. 💻 `.eslintrc.cjs` (CommonJS)

- 这是另一个 JavaScript 配置文件，但使用 CommonJS 模块系统（Node.js 的默认模块系统）。
- 与 `.eslintrc.js` 类似，但它使用 `require` 而不是 `import`。
- 示例：

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    quotes: ['error', 'single'],
  },
};
```

## 6. 💻 包管理器配置文件（如 `package.json`）

- 可以在项目的 `package.json` 文件中直接添加 `"eslintConfig"` 字段来指定 ESLint 配置。
- 这样可以减少项目中的配置文件数量。
- 示例：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "eslintConfig": {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "rules": {
      "quotes": ["error", "single"]
    }
  }
}
```
