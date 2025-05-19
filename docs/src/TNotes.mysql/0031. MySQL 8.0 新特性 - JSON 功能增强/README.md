# [0031. MySQL 8.0 新特性 - JSON 功能增强](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0031.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20JSON%20%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 新增运算符：`->>`（等价于 `JSON_UNQUOTE(JSON_EXTRACT())`）](#2--新增运算符-等价于-json_unquotejson_extract)
- [3. 📒 新增聚合函数](#3--新增聚合函数)
- [4. 📒 JSON 实用函数](#4--json-实用函数)
- [5. 📒 支持索引 JSON 字段中的属性（虚拟列 + 索引）](#5--支持索引-json-字段中的属性虚拟列--索引)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 8.0 对 **JSON 类型和相关操作** 做了多项增强，使开发者可以更方便地处理 JSON 数据类型、提升查询效率，并支持更复杂的 JSON 操作。
  - **新增运算符 `->>`**：
    - 相当于 `JSON_UNQUOTE(JSON_EXTRACT(...))`
  - **新增聚合函数**：
    - `JSON_ARRAYAGG()`：将列或表达式作为其参数，并将结果聚合为单个 JSON 数组。
    - `JSON_OBJECTAGG(key, value)`：取两个列或表达式，将其解释为键值对（`{ key: ..., val: ... }`）的形式，并将结果作为单个 JSON 对象返回。
  - **JSON 实用函数**：
    - `JSON_PRETTY()`：美化输出格式
      - 每个 JSON 对象成员或数组值都打印在一个单独的行上，子对象或数组相对于其父对象是 2 个空格。
    - `JSON_MERGE_PATCH()`：可以合并符合 RFC 7396 标准的 JSON。在两个 JSON 对象上使用时，可以将它们合并为单个 JSON 对象。
- MySQL 8.0 JSON 增强功能一览表

| 功能 | 描述 | 用途 |
| --- | --- | --- |
| `->>` | 提取 JSON 并自动去引号 | 简化 JSON 字段访问 |
| `JSON_ARRAYAGG()` | 聚合多行数据为 JSON 数组 | 构造列表型 JSON 输出 |
| `JSON_OBJECTAGG(k, v)` | 聚合键值对为 JSON 对象 | 构造字典型 JSON 输出 |
| `JSON_PRETTY()` | 美化 JSON 输出格式 | 方便调试和日志显示 |
| `JSON_MERGE_PATCH()` | RFC 标准合并 JSON 对象 | 安全合并多个 JSON 数据 |
| 支持虚拟列索引 | 创建基于 JSON 属性的索引（非 8.0 新特性） | 加速 JSON 查询性能（可结合 `->>` 一起使用） |

- MySQL 8.0 在 JSON 功能上的增强大大提升了 JSON 数据的处理能力，不仅提供了更多实用函数和聚合方法，还优化了查询性能，使数据库更适合现代前端应用（比如 Web、App）中常见的 JSON 数据交互需求。

## 2. 📒 新增运算符：`->>`（等价于 `JSON_UNQUOTE(JSON_EXTRACT())`）

- 功能说明：
  - `->>` 是一个快捷操作符，用于从 JSON 字段中提取值并自动去除引号。
  - 相当于先使用 `JSON_EXTRACT()` 提取字段，再用 `JSON_UNQUOTE()` 去掉双引号。
- 示例：

```sql
SELECT data->>'$.name' AS name
FROM users;

-- 等价于：
SELECT JSON_UNQUOTE(JSON_EXTRACT(data, '$.name')) AS name
FROM users;
```

- 使用 `->>` 更简洁，推荐用于直接提取字符串值。

## 3. 📒 新增聚合函数

- `JSON_ARRAYAGG(expr)`
  - 将多行的某一列或表达式结果合并为一个 JSON 数组。
- `JSON_OBJECTAGG(key_expr, value_expr)`
  - 将两列分别作为键和值，生成一个 JSON 对象。
- 这两个聚合函数非常适合用于将关系型数据转换为 JSON 格式返回给前端应用。
- 示例：

```sql
SELECT JSON_ARRAYAGG(name) FROM users;

-- 输出示例：
-- ["Alice", "Bob", "Charlie"]

SELECT JSON_OBJECTAGG(id, name) FROM users;

-- 输出示例：
-- { "1": "Alice", "2": "Bob", "3": "Charlie" }
```

## 4. 📒 JSON 实用函数

- `JSON_PRETTY(json_val)`
  - 以美观格式打印 JSON 内容，便于调试查看。
  - 特别适合在客户端或日志中展示结构清晰的 JSON 数据。
- `JSON_MERGE_PATCH(json1, json2)`
  - 根据 [RFC 7396](https://tools.ietf.org/html/rfc7396) 合并两个 JSON 对象，冲突时后者覆盖前者。
  - 注意：与旧版的 `JSON_MERGE` 不同，`JSON_MERGE_PATCH` 是标准兼容的合并方式。
- 示例：

```sql
SELECT JSON_PRETTY(data) FROM users WHERE id = 1;

-- 输出：
-- {
--   "name": "Alice",
--   "age": 25,
--   "hobbies": ["reading", "coding"]
-- }

SELECT JSON_MERGE_PATCH('{"a": 1, "b": 2}', '{"b": 3, "c": 4}');

-- 输出：
-- { "a": 1, "b": 3, "c": 4 }
```

## 5. 📒 支持索引 JSON 字段中的属性（虚拟列 + 索引）

- 虽然这不是 MySQL 8.0 的新增特性，但结合 JSON 函数可以创建 **虚拟列并建立索引**，从而加速 JSON 查询。
- 示例：

```sql
ALTER TABLE users
ADD COLUMN name VARCHAR(100)
GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(data, '$.name'))) STORED;

CREATE INDEX idx_name ON users(name);

-- 这样就可以快速通过 `data->>'$.name'` 查询用户信息。
```
