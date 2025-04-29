# [0083. querystring 模块概述](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0083.%20querystring%20%E6%A8%A1%E5%9D%97%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - `querystring` 基本使用 - `parse`、`stringify`](#2--demos1---querystring-基本使用---parsestringify)
- [3. 🔗 References](#3--references)

<!-- endregion:toc -->

## 1. 📒 概述

- **`querystring` 模块**：
  - `querystring` 模块用于实现 URL 查询字符串与参数对象之间的互相转换。
- **主要方法**：
  - `querystring.parse()`：将 URL 查询字符串转换为参数对象。
  - `querystring.stringify()`：将参数对象转换为 URL 查询字符串。

## 2. 💻 demos.1 - `querystring` 基本使用 - `parse`、`stringify`

::: code-group

<<< ./demos/1/1.cjs {js 13,17} [parse、stringify]

:::

## 3. 🔗 References

::: details

- https://nodejs.org/docs/v22.15.0/api/querystring.html

:::
