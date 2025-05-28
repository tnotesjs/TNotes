# [0178. 分数排名【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0178.%20%E5%88%86%E6%95%B0%E6%8E%92%E5%90%8D%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - DENSE_RANK](#2--题解1---dense_rank)
- [3. 💻 题解.2 - 使用 `COUNT(DISTINCT ...)` 的相关子查询](#3--题解2---使用-countdistinct--的相关子查询)
- [4. 💻 题解.3 - 使用 `INNER JOIN` 和 `COUNT(DISTINCT...)`](#4--题解3---使用-inner-join-和-countdistinct)

<!-- endregion:toc -->

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn/problems/rank-scores)

表: `Scores`

```
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| score       | decimal |
+-------------+---------+
id 是该表的主键（有不同值的列）。
该表的每一行都包含了一场比赛的分数。Score 是一个有两位小数点的浮点值。
```

编写一个解决方案来查询分数的排名。排名按以下规则计算:

- 分数应按从高到低排列。
- 如果两个分数相等，那么两个分数的排名应该相同。
- 在排名相同的分数后，排名数应该是下一个连续的整数。换句话说，排名之间不应该有空缺的数字。

按  `score`  降序返回结果表。

查询结果格式如下所示。

---

- **示例 1:**

```
输入:
Scores 表:
+----+-------+
| id | score |
+----+-------+
| 1  | 3.50  |
| 2  | 3.65  |
| 3  | 4.00  |
| 4  | 3.85  |
| 5  | 4.00  |
| 6  | 3.65  |
+----+-------+
输出:
+-------+------+
| score | rank |
+-------+------+
| 4.00  | 1    |
| 4.00  | 1    |
| 3.85  | 2    |
| 3.65  | 3    |
| 3.65  | 3    |
| 3.50  | 4    |
+-------+------+
```

:::

## 2. 💻 题解.1 - DENSE_RANK

::: code-group

```sql [mysql]
SELECT
  S.score,
  DENSE_RANK() OVER (
    ORDER BY
      S.score DESC
  ) AS 'rank'
FROM
  Scores S;
```

:::

## 3. 💻 题解.2 - 使用 `COUNT(DISTINCT ...)` 的相关子查询

::: code-group

```sql [mysql]
SELECT
  S1.score,
  (
    SELECT
      COUNT(DISTINCT S2.score)
    FROM
      Scores S2
    WHERE
      S2.score >= S1.score
  ) AS 'rank'
FROM
  Scores S1
ORDER BY
  S1.score DESC;
```

:::

## 4. 💻 题解.3 - 使用 `INNER JOIN` 和 `COUNT(DISTINCT...)`

::: code-group

```sql [mysql]
SELECT
  S.score,
  COUNT(DISTINCT T.score) AS 'rank'
FROM
  Scores S
  INNER JOIN Scores T ON S.score <= T.score
GROUP BY
  S.id,
  S.score
ORDER BY
  S.score DESC;
```

:::
