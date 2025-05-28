# [0015. 创建数据库 CREATE DATABASE](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0015.%20%E5%88%9B%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93%20CREATE%20DATABASE)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

- 创建数据库：`CREATE DATABASE <数据库名>;`
  - 示例：`CREATE DATABASE test_db;`
- 使用数据库：`USE <数据库名>;`
  - 示例：`USE test_db;`
  - 数据表属于数据库，在创建数据表之前，应该使用语句 `USE <数据库名>;` 指定操作是在哪个数据库中进行，如果没有选择数据库，就会抛出 `No database selected` 的错误。
