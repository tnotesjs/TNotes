# [0118. 杨辉三角【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0118.%20%E6%9D%A8%E8%BE%89%E4%B8%89%E8%A7%92%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法](#2--题解1---暴力解法)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/pascals-triangle)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个非负整数 *`numRows`*，生成「杨辉三角」的前 *`numRows`* 行。

在「杨辉三角」中，每个数是它左上方和右上方的数的和。

![](./assets/PascalTriangleAnimated2.gif)

**示例 1:**
```
输入: numRows = 5
输出: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
```

**示例 2:**
```
输入: numRows = 1
输出: [[1]]
```

**提示:**

- `1 <= numRows <= 30`

## 2. 💻 题解.1 - 暴力解法

```js
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function (numRows) {
  if (numRows === 1) return [[1]]
  if (numRows === 2) return [[1], [1, 1]]

  // 初始化
  const triangle = []
  for (let i = 1; i <= numRows; i++) triangle.push(new Array(i).fill(1))

  // 内层求和
  for (let r = 2; r <= numRows - 1; r++)
    for (let c = 1; c <= r - 1; c++)
      triangle[r][c] = triangle[r - 1][c - 1] + triangle[r - 1][c]

  return triangle
};
```

- **解题思路：**
  - ![](assets/2024-11-10-21-52-49.png)
  - 首先初始化一个全为 `1` 的 `triangle` 三角。
  - 对内层的每个位置进行重新求和，求和的逻辑：`triangle[r][c] = triangle[r - 1][c - 1] + triangle[r - 1][c]`
