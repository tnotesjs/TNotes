# [0035. MySQL 8.0 新特性 - 窗口函数](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0035.%20MySQL%208.0%20%E6%96%B0%E7%89%B9%E6%80%A7%20-%20%E7%AA%97%E5%8F%A3%E5%87%BD%E6%95%B0)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 窗口函数的基本语法](#2--窗口函数的基本语法)
- [3. 💻 窗口函数与聚合函数的区别](#3--窗口函数与聚合函数的区别)
- [4. 💻 常见窗口函数分类](#4--常见窗口函数分类)

<!-- endregion:toc -->

## 1. 📝 概述

- MySQL 8.0 引入窗口函数后，极大增强了数据库的分析能力，使你可以在不破坏原始数据行的情况下，完成复杂的排名、累计、分布等分析任务，是 OLAP 场景下不可或缺的强大工具。
- **窗口函数（Window Functions）**
  - 是一种可以对“一组相关行”进行计算的函数。
  - 在不改变原始行结构的前提下，为每行返回一个基于该“窗口”的计算值。
  - 窗口函数类似于传统的聚合函数（如 `SUM()`、`COUNT()`），但不会将多行数据合并为一行，而是 **为每一行返回一个计算结果**。
  - **MySQL 8.0 引入了对窗口函数（Window Functions）的支持**，这是其在分析型查询能力上的重大增强。这使得我们可以在不丢失原始行的前提下进行分组统计、排名、累计等操作。

| 功能 | MySQL 5.x | MySQL 8.0 |
| --- | --- | --- |
| 支持窗口函数 | ❌ 不支持 | ✅ 支持 |
| 实现排名功能 | ❌ 需借助变量或子查询 | ✅ 支持 `ROW_NUMBER`, `RANK`, `DENSE_RANK` |
| 实现滑动窗口统计 | ❌ 需手动模拟 | ✅ 支持 `ROWS BETWEEN ...` 定义窗口帧 |
| 实现分组统计而不合并行 | ❌ 不支持 | ✅ 支持 `OVER(PARTITION BY...)` |
| 分析型查询能力 | ⚠️ 较弱 | ✅ 强大且灵活 |

## 2. 📒 窗口函数的基本语法

```sql
function_name(...) OVER (
    [PARTITION BY partition_expression]
    [ORDER BY sort_expression]
    [window_frame_clause]
)
-- function_name(...)：窗口函数名，如 ROW_NUMBER(), RANK(), SUM()
-- OVER(...)：定义窗口范围
-- PARTITION BY：类似 GROUP BY，用于划分窗口的数据集
-- ORDER BY：指定窗口内数据排序方式
-- window_frame_clause：定义窗口帧范围（可选）
```

## 3. 💻 窗口函数与聚合函数的区别

- 聚合函数会把多行合并成一行
- 窗口函数保留原始行，同时增加一列或多列用于展示计算结果

| 特性 | 聚合函数（如 SUM, COUNT） | 窗口函数 |
| --- | --- | --- |
| 输出行数 | 多行 → 合并为一行 | 多行 → 每行都输出一个结果 |
| 是否保留原数据行 | ❌ 不保留 | ✅ 保留 |
| 是否支持排序和窗口范围 | ❌ 不支持 | ✅ 支持 |
| 是否能结合 RANK 排名使用 | ❌ 不支持 | ✅ 支持 |

```sql
-- 假设存在如下表 employees：
-- +------------+----------+--------+
-- | department | name     | salary |
-- +------------+----------+--------+
-- | HR         | Alice    | 8000   |
-- | HR         | Bob      | 7000   |
-- | HR         | Charlie  | 7000   |
-- | IT         | David    | 10000  |
-- | IT         | Eve      | 9000   |
-- | IT         | Frank    | 9000   |
-- +------------+----------+--------+

-- 使用聚合函数：SUM()
SELECT
    department,
    COUNT(*) AS employee_count,
    SUM(salary) AS total_salary
FROM employees
GROUP BY department;

-- 查询结果（聚合函数）：
-- +------------+--------------+--------------+
-- | department | employee_count | total_salary |
-- +------------+----------------+--------------+
-- | HR         | 3              | 22000        |
-- | IT         | 3              | 28000        |
-- +------------+----------------+--------------+
-- 聚合函数将多行数据合并为一行，仅返回统计结果。

-- 使用窗口函数：SUM() OVER()
SELECT
    department,
    name,
    salary,
    SUM(salary) OVER(PARTITION BY department) AS total_salary
FROM employees;

-- 查询结果（窗口函数）：
-- +------------+----------+--------+---------------+
-- | department | name     | salary | total_salary  |
-- +------------+----------+--------+---------------+
-- | HR         | Alice    | 8000   | 22000         |
-- | HR         | Bob      | 7000   | 22000         |
-- | HR         | Charlie  | 7000   | 22000         |
-- | IT         | David    | 10000  | 28000         |
-- | IT         | Eve      | 9000   | 28000         |
-- | IT         | Frank    | 9000   | 28000         |
-- +------------+----------+--------+---------------+
```

## 4. 💻 常见窗口函数分类

- **排名类函数**
  - `ROW_NUMBER()`：为每一行分配唯一序号，无并列
  - `RANK()`：有并列，后续序号跳跃
  - `DENSE_RANK()`：有并列，序号连续
  - `NTILE(n)`：将数据分为 n 个桶，并返回桶编号
- **分布类函数**
  - `PERCENT_RANK()`：返回当前行在其分区中的相对排名
  - `CUME_DIST()`：返回当前行在分区中累积分布比例
- **聚合类函数（配合 OVER 使用）**
  - `SUM(...) OVER (...)`
  - `AVG(...) OVER (...)`
  - `MIN(...) OVER (...)`
  - `MAX(...) OVER (...)`
  - `COUNT(...) OVER (...)`

::: code-group

```sql [排名类窗口函数]
-- 假设存在如下表 employees：
-- +------------+----------+--------+
-- | department | name     | salary |
-- +------------+----------+--------+
-- | HR         | Alice    | 8000   |
-- | HR         | Bob      | 7000   |
-- | HR         | Charlie  | 7000   |
-- | IT         | David    | 10000  |
-- | IT         | Eve      | 9000   |
-- | IT         | Frank    | 9000   |
-- +------------+----------+--------+

-- 查询员工薪资，并按部门分组，显示每个员工在部门内的薪资排名
SELECT
    department,
    name,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rank
FROM employees;

-- 查询结果：
-- +------------+----------+--------+---------+------+-------------+
-- | department | name     | salary | row_num | rank | dense_rank  |
-- +------------+----------+--------+---------+------+-------------+
-- | HR         | Alice    | 8000   | 1       | 1    | 1           |
-- | HR         | Bob      | 7000   | 2       | 2    | 2           |
-- | HR         | Charlie  | 7000   | 3       | 2    | 2           |
-- | IT         | David    | 10000  | 1       | 1    | 1           |
-- | IT         | Eve      | 9000   | 2       | 2    | 2           |
-- | IT         | Frank    | 9000   | 3       | 2    | 2           |
-- +------------+----------+--------+---------+------+-------------+

-- 可以清晰地看到每位员工在部门内的排名情况。
```

```sql [聚合类窗口函数]
-- 假设存在如下表 employees：
-- +------------+----------+--------+
-- | department | name     | salary |
-- +------------+----------+--------+
-- | HR         | Alice    | 8000   |
-- | HR         | Bob      | 7000   |
-- | IT         | David    | 10000  |
-- | IT         | Eve      | 9000   |
-- +------------+----------+--------+

-- 查询每个员工的工资及其所在部门的平均工资
SELECT
    department,
    name,
    salary,
    AVG(salary) OVER (PARTITION BY department) AS avg_salary
FROM employees;

-- 查询结果：
-- +------------+-------+--------+-----------------+
-- | department | name  | salary | avg_salary      |
-- +------------+-------+--------+-----------------+
-- | HR         | Alice | 8000   | 7500.0000       |
-- | HR         | Bob   | 7000   | 7500.0000       |
-- | IT         | David | 10000  | 9500.0000       |
-- | IT         | Eve   | 9000   | 9500.0000       |
-- +------------+-------+--------+-----------------+

-- ----------------------------------------------------------------

-- 假设存在如下表 sales：
-- +----+--------+
-- | id | salary |
-- +----+--------+
-- | 1  | 100    |
-- | 2  | 200    |
-- | 3  | 300    |
-- +----+--------+

-- 查询员工薪资及前 N 行的累计总和（滑动窗口）
SELECT
    id,
    salary,
    SUM(salary) OVER (ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM sales;

-- 查询结果：
-- +----+--------+---------------+
-- | id | salary | running_total   |
-- +----+--------+---------------+
-- | 1  | 100    | 100           |
-- | 2  | 200    | 300           |
-- | 3  | 300    | 600           |
-- +----+--------+---------------+

-- 可实现动态汇总、趋势分析、移动平均等复杂分析逻辑。
```

:::
