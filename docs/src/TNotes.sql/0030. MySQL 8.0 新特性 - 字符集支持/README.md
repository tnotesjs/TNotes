# [0030. MySQL 8.0 新特性 - 字符集支持](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0030.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E5%AD%97%E7%AC%A6%E9%9B%86%E6%94%AF%E6%8C%81)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 MySQL 8.0 之前的默认字符集：`latin1`](#2--mysql-80-之前的默认字符集latin1)
- [3. 📒 MySQL 8.0 的默认字符集：`utf8mb4`](#3--mysql-80-的默认字符集utf8mb4)
- [4. 📒 `utf8mb4` vs. `utf8`（旧版）](#4--utf8mb4-vs-utf8旧版)
- [5. 💻 查看和修改字符集设置](#5--查看和修改字符集设置)

<!-- endregion:toc -->

## 1. 📝 概述

- `latin1 -> utf8mb4`
  - MySQL 8.0 对字符集的支持进行了重大改进，其中最重要的变化之一是将 **默认字符集从 `latin1` 改为 `utf8mb4`**。
  - **新增排序规则**：
    - 如 `utf8mb4_ja_0900_as_cs`（区分大小写、支持日文）
    - ……
  - **意义**：更好地支持 Unicode 字符，包括表情符号（Emoji）
- MySQL 8.0 将默认字符集从仅支持西欧字符的 `latin1` 升级为全面支持 Unicode 的 `utf8mb4`，解决了长期以来对中文、Emoji、多语言支持不足的问题，是迈向全球化和现代化数据库的重要一步。

## 2. 📒 MySQL 8.0 之前的默认字符集：`latin1`

- **`latin1`**
  - **`latin1` 是单字节字符集（也叫 ISO-8859-1）**
  - 只能表示 **256 个字符**
  - 主要支持 **西欧语言**（如英语、法语、德语等）
  - 不支持中文、日文、表情符号（Emoji）等字符
- **存在的问题**

| 问题                    | 描述                                     |
| ----------------------- | ---------------------------------------- |
| **不支持中文/亚洲语言** | 使用 `latin1` 时插入中文会报错或显示乱码 |
| **无法存储 Emoji 表情** | 如 😂、❤️、👍 等表情无法正常保存         |
| **兼容性差**            | 在国际化应用中容易出现编码错误           |

- 示例说明：

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
) DEFAULT CHARSET=latin1;
```

- 如果你尝试插入中文：

```sql
INSERT INTO users
VALUES (1, '张三');
```

- 很可能会报错或者出现乱码，比如变成 `??` 或者被截断。

## 3. 📒 MySQL 8.0 的默认字符集：`utf8mb4`

- **`utf8mb4`**
  - **`utf8mb4` 是真正的 UTF-8 编码实现**
  - 支持 **最多 4 字节的 Unicode 字符**
  - 完全支持：
    - 中文、日文、韩文等亚洲语言
    - 表情符号（Emoji）
    - 特殊符号、数学公式、音标等
- **优势总结**

| 特性 | 描述 |
| --- | --- |
| **支持更多字符** | 覆盖几乎所有的 Unicode 字符 |
| **兼容性更好** | 适用于全球多语言环境 |
| **支持 Emoji** | 可以安全地存储 🐱、🎉、😂 等表情 |
| **排序规则丰富** | 新增了如 `utf8mb4_ja_0900_as_cs`（区分大小写+日文支持）等规则 |

- **示例说明**

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 你可以放心插入中文、表情等字符：
INSERT INTO users
VALUES (1, '你好，世界！👋');
```

## 4. 📒 `utf8mb4` vs. `utf8`（旧版）

- 很多人误以为 MySQL 的 `utf8` 就是标准 UTF-8，其实它们并不等价。
- MySQL 的 `utf8` 实际上是阉割版的 UTF-8，不能完全代表标准 UTF-8。

| 特性 | `utf8`（MySQL 内部实现） | `utf8mb4`（MySQL 8.0 默认） |
| --- | --- | --- |
| **最大字节数** | 3 字节 | 4 字节 |
| **支持字符范围** | 基本拉丁字符 + 多语言基本字符 | 完整的 Unicode 字符集 |
| **是否支持 Emoji** | ❌ 不支持 | ✅ 支持 |
| **是否推荐使用** | ❌ 不推荐 | ✅ 推荐作为默认字符集 |

## 5. 💻 查看和修改字符集设置

- 查看当前数据库默认字符集

```sql
SHOW VARIABLES LIKE 'character_set_database';
SHOW VARIABLES LIKE 'collation_database';
```

- 修改数据库默认字符集（MySQL 8.0）
  - 编辑 `my.cnf` 或 `my.ini` 配置文件，重启 MySQL 后生效。

```ini
[client]
default-character-set = utf8mb4

[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```
