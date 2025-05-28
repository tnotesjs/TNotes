# [0032. MySQL 8.0 新特性 - 支持表达式作为默认值](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0032.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E6%94%AF%E6%8C%81%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%BD%9C%E4%B8%BA%E9%BB%98%E8%AE%A4%E5%80%BC)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 🤔 什么是“表达式作为默认值”？](#2--什么是表达式作为默认值)
- [3. 💻 一些常见的使用场景](#3--一些常见的使用场景)
  - [3.1. 自动生成创建时间](#31-自动生成创建时间)
  - [3.2. 动态文本默认值](#32-动态文本默认值)
  - [3.3. JSON 默认结构](#33-json-默认结构)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 8.0 在数据定义语言（DDL）方面引入了一个非常实用的新特性：**支持使用表达式作为字段的默认值（Default Value）**，尤其对 `BLOB`、`TEXT`、`GEOMETRY` 和 `JSON` 等以前不支持默认值的数据类型也开放了支持。
- MySQL 8.0 允许你使用 **表达式作为字段默认值**，不仅增强了字段定义的灵活性，也让 **数据库层** 能更智能地处理默认数据填充，特别是在 `TEXT`、`JSON` 等类型上提供了强大的新能力。
  - 这里特别强调“数据库层”，是因为在传统做法中，我们通常会通过程序逻辑来控制相关字段的默认值。
  - 相较于“数据库层”直接控制，这种通过程序逻辑来处理字段默认值的方式是属于更上层的做法，灵活性也会更高一些。
- 可以设置默认值的类型：

| 类型 | MySQL 8.0 前 | MySQL 8.0 |
| --- | --- | --- |
| `CHAR`, `VARCHAR` | ✅ 支持常量默认值 | ✅ 支持表达式默认值 |
| `TEXT`, `BLOB` | ❌ 不支持默认值 | ✅ 支持表达式默认值 |
| `JSON` | ❌ 不支持默认值 | ✅ 支持表达式默认值 |
| `GEOMETRY` | ❌ 不支持默认值 | ✅ 支持表达式默认值 |
| `DATETIME`, `DATE`, `TIMESTAMP` | ✅ 支持 CURRENT_TIMESTAMP 等 | ✅ 支持任意表达式 |

- 注意事项
  - 表达式必须返回与字段类型兼容的值。
  - 表达式不能引用表中的其他列（目前仅支持常量或函数）。
  - 如果表达式抛出错误，默认值也无法插入，会报错。
  - 使用 `STORED` 或 `VIRTUAL` 列时，表达式行为不同，需注意区别。

## 2. 🤔 什么是“表达式作为默认值”？

- 在 MySQL 8.0 之前，我们只能为字段指定 **常量** 作为默认值：

```sql {3}
CREATE TABLE users (
    id INT PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'active'
);
```

- 而从 **MySQL 8.0 开始**，你可以使用一个 **表达式** 来动态生成默认值，例如函数调用、计算结果等：

```sql {3-5}
CREATE TABLE logs (
    id INT PRIMARY KEY,
    message TEXT DEFAULT (LEFT('default message', 15)),
    created_at DATETIME DEFAULT (NOW()),
    json_data JSON DEFAULT (JSON_OBJECT('status', 'pending'))
);
```

- 插入数据时，如果未显式提供这些字段的值，就会自动执行对应的表达式生成默认值。
- 对比旧版（8.0 之前）限制

```sql
-- 使用常量作为默认值 - OK
CREATE TABLE t1 (
  id INT PRIMARY KEY,
  log_text TEXT DEFAULT 'default text'  -- ✅ OK // [!code highlight]
);

-- 使用表达式作为默认值 - 报错
CREATE TABLE t2 (
  id INT PRIMARY KEY,
  log_text TEXT DEFAULT (UPPER('default text'))  -- ❌ ERROR // [!code error]
);
```

## 3. 💻 一些常见的使用场景

### 3.1. 自动生成创建时间

```sql {3}
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    created_at DATETIME DEFAULT (NOW())
);

-- 插入新订单时，如果没有指定 created_at，将自动使用当前时间。
```

### 3.2. 动态文本默认值

```sql {3,9}
CREATE TABLE articles (
  article_id INT PRIMARY KEY,
  content TEXT DEFAULT ('[empty]')
);

-- 或者更复杂一点：
CREATE TABLE documents (
  doc_id INT PRIMARY KEY,
  summary TEXT DEFAULT (CONCAT('Document ', doc_id, ' summary'))
);
```

### 3.3. JSON 默认结构

```sql {3}
CREATE TABLE settings (
  user_id INT PRIMARY KEY,
  preferences JSON DEFAULT (JSON_OBJECT('theme', 'light', 'notifications', TRUE))
);

-- 新用户注册时自动初始化其偏好设置。
```
