# [0014. TABLE 基本操作概述](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0014.%20TABLE%20%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 创建数据表](#2--创建数据表)
- [3. 💻 查看数据表结构](#3--查看数据表结构)
- [4. 💻 修改数据表](#4--修改数据表)
- [5. 💻 删除数据表](#5--删除数据表)

<!-- endregion:toc -->

## 1. 📝 概述

- 数据表是数据库中最基本的存储单位，用于存储具有特定结构的数据。
- 对数据表的基本操作包括：**创建、查看结构、修改和删除** 等。
  - 掌握这些操作是使用 MySQL 进行数据管理的基础。
- 本节介绍了 MySQL 中数据表的基本操作，包括：
  - 使用 `CREATE TABLE` 创建数据表
  - 使用 `DESC` 和 `SHOW CREATE TABLE` 查看表结构
  - 使用 `ALTER TABLE` 修改表结构
  - 使用 `DROP TABLE` 删除数据表
- 数据表属于数据库，在创建数据表之前，应该使用语句 `USE <数据库名>;` 指定操作是在哪个数据库中进行，如果没有选择数据库，可能会抛出 `No database selected` 的错误。

## 2. 💻 创建数据表

- 在 MySQL 中，可以使用 `CREATE TABLE` 语句来创建一个新的数据表。

::: code-group

```sql [基本语法]
CREATE TABLE 表名 (
    字段名1 数据类型 约束条件,
    字段名2 数据类型 约束条件,
    ...
);
```

```sql [示例]
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    age INT,
    gender ENUM('男', '女') DEFAULT '男'
);

-- INT: 整型
-- VARCHAR(n): 可变长度字符串
-- AUTO_INCREMENT: 自动递增
-- PRIMARY KEY: 主键约束
-- NOT NULL: 非空约束
-- DEFAULT: 默认值设置
```

:::

## 3. 💻 查看数据表结构

- 创建完成后，可以通过以下命令查看表结构。

::: code-group

```sql [查看数据表结构的多种写法]
-- 写法1
DESCRIBE 表名;

-- 写法2（1 的简写形式）
DESC 表名;

-- 写法3
SHOW CREATE TABLE 表名;
```

```sql [示例]
DESC students;

-- 输出示例：

-- | Field  | Type            | Null | Key | Default | Extra          |
-- | ------ | --------------- | ---- | --- | ------- | -------------- |
-- | id     | int             | NO   | PRI | NULL    | auto_increment |
-- | name   | varchar(50)     | NO   |     | NULL    |                |
-- | age    | int             | YES  |     | NULL    |                |
-- | gender | enum('男','女') | YES  |     | '男'    |                |
```

:::

## 4. 💻 修改数据表

- MySQL 提供了 `ALTER TABLE` 语句来修改数据表的结构，常见操作包括：
  - 添加字段
  - 删除字段
  - 修改字段名称或类型
  - 修改字段属性（不改名）

::: code-group

```sql [添加字段]
-- ALTER TABLE 表名 ADD 字段名 数据类型 约束条件;

ALTER TABLE students ADD email VARCHAR(100);
```

```sql [删除字段]
-- ALTER TABLE 表名 DROP 字段名;

ALTER TABLE students DROP email;
```

```sql [修改字段名称或类型]
-- ALTER TABLE 表名 CHANGE 原字段名 新字段名 数据类型;

ALTER TABLE students CHANGE name full_name VARCHAR(100);
```

```sql [修改字段属性（不改名）]
-- ALTER TABLE 表名 MODIFY 字段名 新数据类型;

ALTER TABLE students MODIFY full_name VARCHAR(100) NOT NULL;
```

:::

## 5. 💻 删除数据表

- 当一个数据表不再需要时，可以使用 `DROP TABLE` 语句将其删除：
  - `DROP TABLE` 语句会永久删除该表及其所有数据，请谨慎操作。

::: code-group

```sql [基本语法]
DROP TABLE 表名;
```

```sql [示例]
DROP TABLE students;
```

:::
