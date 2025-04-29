# [0695. 岛屿的最大面积【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0695.%20%E5%B2%9B%E5%B1%BF%E7%9A%84%E6%9C%80%E5%A4%A7%E9%9D%A2%E7%A7%AF%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.DFS + 递归](#2--题解dfs--递归)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/max-area-of-island/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给你一个大小为 `m x n` 的二进制矩阵 `grid` 。

**岛屿** 是由一些相邻的 `1` (代表土地) 构成的组合，这里的「相邻」要求两个 `1` 必须在 **水平或者竖直的四个方向上** 相邻。你可以假设 `grid` 的四个边缘都被 `0`（代表水）包围着。

岛屿的面积是岛上值为 `1` 的单元格的数目。

计算并返回 `grid` 中最大的岛屿面积。如果没有岛屿，则返回面积为 `0` 。

**示例 1：**

![](assets/2024-11-03-10-20-45.png)

```
输入：grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]
输出：6
解释：答案不应该是 11 ，因为岛屿只能包含水平或垂直这四个方向上的 1 。
```
**示例 2：**
```
输入：grid = [[0,0,0,0,0,0,0,0]]
输出：0
```
**提示：**

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 50`
- `grid[i][j]` 为 `0` 或 `1`

## 2. 💻 题解.DFS + 递归

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function (grid) {
  let result = 0 // 最终结果
  const rowCount = grid.length, colCount = grid[0].length

  // 递归，遍历与当前陆地相连的所有陆地
  const dfs = (grid, i, j) => {
    if (i < 0 || j < 0 || i > rowCount - 1 || j > colCount - 1) return 0 // 越界
    if (grid[i][j] !== 1) return 0 // 不是陆地
    // 这个点是陆地
    grid[i][j] = 0 // 将遍历过的陆地全部置 0，防止重复遍历
    return 1 +              // 1 表示当前这个点是陆地
      dfs(grid, i - 1, j) + // 上
      dfs(grid, i + 1, j) + // 下
      dfs(grid, i, j - 1) + // 左
      dfs(grid, i, j + 1)   // 右
  }

  // 遍历 grid
  for (let i = 0; i < rowCount; i++) { // 遍历行
    for (let j = 0; j < colCount; j++) { // 遍历列
      result = Math.max(result, dfs(grid, i, j))
    }
  }
  return result
}
```

- 如何防止同一个陆地被重复遍历？
  - 但凡是遍历过的陆地（也就是被计数过的陆地），就将其重置为 0；重置以后，下次再遍历到它时，它将不再被识别为陆地。
