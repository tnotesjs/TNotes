# [0047. 在 MySQL 中批量创建或删除数据库、数据表](https://github.com/Tdahuyou/TNotes.sql/tree/main/notes/0047.%20%E5%9C%A8%20MySQL%20%E4%B8%AD%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E6%88%96%E5%88%A0%E9%99%A4%E6%95%B0%E6%8D%AE%E5%BA%93%E3%80%81%E6%95%B0%E6%8D%AE%E8%A1%A8)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 批量创建或删除数据库、数据表](#2--批量创建或删除数据库数据表)
  - [2.1. 不支持的写法（会报错）](#21-不支持的写法会报错)
  - [2.2. 支持的批量写法](#22-支持的批量写法)
  - [2.3. 替代方案：脚本或存储过程实现批量操作](#23-替代方案脚本或存储过程实现批量操作)

<!-- endregion:toc -->

## 1. 📝 概述

- **在 MySQL 中，创建表（`CREATE TABLE`）和删除表（`DROP TABLE`）等 DDL 操作都不支持通过一条语句批量操作多个对象**。这些操作都是针对单个表或数据库的。
- 虽然你不能用一条 DDL 语句直接操作多个对象（MySQL 原生语法不支持像“创建/删除多个数据库/数据表”这样的动态批量操作），但可以通过 **脚本、存储过程或 SQL 批量语句（如 `DROP TABLE IF EXISTS a, b, c`）** 实现类似效果。

## 2. 💻 批量创建或删除数据库、数据表

### 2.1. 不支持的写法（会报错）

```sql
-- 创建多个表（不支持）
CREATE TABLE table1, table2, table3 (...);

-- 删除多个表（不支持）
DROP TABLE table1, table2, table3;
```

### 2.2. 支持的批量写法

```sql
-- 批量删除表（支持）
DROP TABLE IF EXISTS table1, table2, table3;
-- 这是合法语法，可以一次删除多个表。
-- 注意：这仍然是一个语句中明确列出多个表名的方式，并不是“动态”批量操作。

-- 批量重命名表（支持）
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

### 2.3. 替代方案：脚本或存储过程实现批量操作

- 方法一：使用 Shell 脚本批量建表/删表
- 方法二：使用存储过程动态创建/删除表
- ……

::: code-group

```bash [1]
# 适用于运维自动化场景：
tables=("table1" "table2" "table3")

for tbl in "${tables[@]}"; do
    mysql -e "DROP TABLE IF EXISTS $tbl;"
    mysql -e "CREATE TABLE $tbl (id INT);"
done
```

```sql [2]
DELIMITER $$

CREATE PROCEDURE create_multiple_tables()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 3 DO
        SET @tbl_name = CONCAT('table_', i);
        SET @stmt = CONCAT('CREATE TABLE IF NOT EXISTS ', @tbl_name, ' (id INT)');
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- 调用
CALL create_multiple_tables();
-- 清理
DROP PROCEDURE create_multiple_tables;
```

:::
