# [0010. SQL 标准](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0010.%20SQL%20%E6%A0%87%E5%87%86)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 SQL 标准的发展历程](#2--sql-标准的发展历程)
- [3. 📒 主要的 SQL 标准版本对比](#3--主要的-sql-标准版本对比)
- [4. 📒 SQL 标准的主要组成部分](#4--sql-标准的主要组成部分)
- [5. 📒 SQL 标准与数据库实现的关系](#5--sql-标准与数据库实现的关系)
- [6. 📒 常见的 SQL 方言（Dialect）](#6--常见的-sql-方言dialect)
- [7. 📒 SQL 标准的实际意义](#7--sql-标准的实际意义)
- [8. 📒 推荐的学习路径（针对开发者）](#8--推荐的学习路径针对开发者)
- [9. 🔗 SQL 标准文档](#9--sql-标准文档)

<!-- endregion:toc -->

## 1. 📝 概述

::: tip 备注

- SQL 有很多标准，但是这些标准之间有很多的共性，在使用不同的数据库的时候，SQL 的具体写法可能会存在些许差异。
- 只需要知道这一点，笔记内容简单搂一眼即可。

:::

- **SQL 标准是由 ISO/IEC 制定的一系列数据库语言规范，旨在为各种关系型数据库提供统一的语法基础，但由于历史和性能原因，各数据库厂商在实现上存在差异，因此开发者需结合具体数据库学习其方言。**
- SQL 有许多不同的类型，有 3 个主要的标准：
  - ANSI（美国国家标准机构）SQL；
  - 对 ANSI SQL 修改后在 1992 年采纳的标准，称为 SQL-92 或 SQL2；
  - 最近的 SQL-99 标准，从 SQL2 扩充而来，并增加了对象关系特征和许多其他新功能。
- 各大数据库厂商提供不同版本的 SQL，这些版本的 SQL 不但能包括原始的 ANSI 标准，而且在很大程度上支持 SQL-92 标准。

## 2. 📒 SQL 标准的发展历程

| 年份 | 名称 | 特点 |
| --- | --- | --- |
| **1986** | **SQL-86 / SQL-87** | 第一个官方标准（由 ANSI 和 ISO 发布） |
| **1992** | **SQL-92 / SQL2** | 增加了 JOIN、子查询、CASE 表达式等复杂功能 |
| **1999** | **SQL:1999 / SQL3** | 引入了窗口函数、递归查询、触发器、正则表达式等 |
| **2003** | **SQL:2003** | 支持 XML 数据类型、自动生成主键 |
| **2006** | **SQL:2006** | 集成 XML 查询语言（XQuery） |
| **2008** | **SQL:2008** | 添加 TRUNCATE TABLE 的 CASCADE 支持 |
| **2011** | **SQL:2011** | 时间序列数据支持增强 |
| **2016** | **SQL:2016** | JSON 支持、行级安全性 |
| **2019** | **SQL:2019** | 图数据库支持、模式匹配增强 |

- **目前最新版本是 SQL:2023（ISO/IEC 9075:2023）**

## 3. 📒 主要的 SQL 标准版本对比

| 标准版本 | 年份 | 主要新增内容 |
| --- | --- | --- |
| SQL-86 | 1986 | 最早的标准化版本，支持基本的 SELECT、INSERT、UPDATE、DELETE |
| SQL-92 | 1992 | 增强 JOIN、子查询、CASE 表达式、视图 |
| SQL:1999 | 1999 | 窗口函数（Window Functions）、递归查询（WITH RECURSIVE）、触发器 |
| SQL:2003 | 2003 | 自动增长列（IDENTITY）、MERGE 语句 |
| SQL:2006 | 2006 | XML 支持（XMLType） |
| SQL:2008 | 2008 | TRUNCATE 加入标准 |
| SQL:2011 | 2011 | 时间旅行查询（Temporal Tables） |
| SQL:2016 | 2016 | JSON 支持、MATCH_RECOGNIZE（模式识别） |
| SQL:2019 | 2019 | 图形查询、模式匹配 |
| SQL:2023 | 2023 | 进一步增强 JSON、图形处理、机器学习集成 |

## 4. 📒 SQL 标准的主要组成部分

- SQL 标准并不是单一文档，而是一个庞大的体系，包含多个部分。
- 以下是 SQL:2016 的核心组成部分（ISO/IEC 9075）：

| 标准编号 | 名称 | 内容简介 |
| --- | --- | --- |
| Part 1: Framework (SQL/FS) | 框架 | 总体结构、术语、概念 |
| Part 2: Foundation (SQL/Foundation) | 基础 | 核心 SQL 功能（DML、DDL、约束等） |
| Part 3: Call-Level Interface (SQL/CLI) | 调用层接口 | C/C++ 接口规范（如 ODBC） |
| Part 4: Persistent Stored Modules (SQL/PSM) | 持久化模块 | 存储过程和函数语法 |
| Part 9: Management of External Data (SQL/MED) | 外部数据管理 | 访问外部数据源（如 CSV、其他数据库） |
| Part 10: Object Language Bindings (SQL/OLB) | 对象绑定 | 支持 Java、C# 等语言绑定 |
| Part 11: Information and Definition Schemas (SQL/Schemata) | 元数据 | 描述数据库元信息（如表名、列名） |
| Part 14: XML-Related Specifications (SQL/XML) | XML 扩展 | 支持 XML 数据类型和查询 |
| Part 15: Multi-dimensional Arrays (SQL/MDA) | 多维数组 | 支持科学计算中的多维数组 |
| Part 16: Property Graph Queries (SQL/PGQ) | 图查询 | 支持图数据库查询语法 |
| Part 29: JSON Support (SQL/JSON) | JSON 支持 | 支持 JSON 类型和函数 |

## 5. 📒 SQL 标准与数据库实现的关系

- 虽然 SQL 是标准语言，但不同数据库厂商会根据自己的需求扩展或修改 SQL 语法。

| 数据库     | 是否完全兼容 SQL 标准  | 特色扩展                     |
| ---------- | ---------------------- | ---------------------------- |
| MySQL      | ✅ 基本兼容 SQL:1999   | JSON、分区、全文索引         |
| PostgreSQL | ✅ 高度兼容 SQL:2016+  | 窗口函数、JSON、地理空间数据 |
| Oracle     | ❌ 不完全兼容          | PL/SQL、自治事务             |
| SQL Server | ✅ 较高兼容性          | T-SQL（Transact-SQL）扩展    |
| SQLite     | ✅ 支持大部分 SQL:1999 | 轻量、嵌入式数据库           |
| MariaDB    | ✅ 基于 MySQL          | 更丰富的存储引擎             |

- **注意：**
  - 实际开发中，**不要假设所有数据库都支持相同的 SQL 语法**。
  - 使用跨数据库工具（如 Hibernate、JPA、Sequelize）时，尽量使用 ORM 提供的抽象方法，避免直接写原生 SQL。

## 6. 📒 常见的 SQL 方言（Dialect）

- 由于 SQL 标准不能覆盖所有场景，各大数据库发展出了自己的“方言”：

| 功能 | MySQL | PostgreSQL | SQL Server | Oracle | SQLite |
| --- | --- | --- | --- | --- | --- |
| 分页 | `LIMIT` | `LIMIT + OFFSET` 或 `ROW_NUMBER()` | `OFFSET FETCH` | `ROWNUM` | `LIMIT` |
| 字符串拼接 | `CONCAT()` | \` |  | \`或`CONCAT()` | `+` |
| 自增主键 | `AUTO_INCREMENT` | `SERIAL` / `IDENTITY` | `IDENTITY` | `SEQUENCE` | `AUTOINCREMENT` |
| 日期函数 | `NOW()` | `CURRENT_TIMESTAMP` | `GETDATE()` | `SYSDATE` | `datetime('now')` |
| 正则匹配 | `REGEXP` | `~`, `~*` | `LIKE`（有限） | `REGEXP_LIKE` | 通过扩展支持 |

## 7. 📒 SQL 标准的实际意义

- 优点：
  - 提供统一的语言基础
  - 便于学习和迁移技能
  - 减少平台锁定（Vendor Lock-in）
- 局限：
  - 标准更新慢于实际需求
  - 各数据库支持程度不一致
  - 很多功能依赖具体数据库特性（如 JSON、GIS、时间序列）

## 8. 📒 推荐的学习路径（针对开发者）

| 阶段 | 推荐学习内容                                                     |
| ---- | ---------------------------------------------------------------- |
| 初级 | SQL:1999 中的核心 DDL/DML 语法（CREATE、SELECT、JOIN、GROUP BY） |
| 中级 | SQL:2003/2006 中的高级特性（窗口函数、CTE、子查询优化）          |
| 高级 | SQL:2011/2016 中的时间序列、JSON、图查询                         |
| 实战 | 结合具体数据库（MySQL/PostgreSQL）掌握其方言和优化技巧           |

## 9. 🔗 SQL 标准文档

- SQL 标准文档由国际组织 **ISO/IEC JTC1/SC32/WG3** 维护。
- 你可以通过以下方式查阅：
  - [ISO/IEC 9075 官方网站](https://www.iso.org/standard/63619.html)
  - [ANSI/INCITS SQL Standards](https://www.incits.org/standards-committees/x3-s-database)
  - [PostgreSQL 文档（高度兼容标准）](https://www.postgresql.org/docs/)
  - [Oracle SQL Reference](https://docs.oracle.com/cd/B19306_01/server.102/b14200/toc.htm)
