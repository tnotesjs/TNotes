# [0048. 旋转图像【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0048.%20%E6%97%8B%E8%BD%AC%E5%9B%BE%E5%83%8F%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法](#2--题解1---暴力解法)
- [3. 💻 题解.2 - 翻转](#3--题解2---翻转)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/rotate-image)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个 *n* × *n* 的二维矩阵 `matrix` 表示一个图像。请你将图像顺时针旋转 90 度。

你必须在 **[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)** 旋转图像，这意味着你需要直接修改输入的二维矩阵。**请不要** 使用另一个矩阵来旋转图像。

**示例 1：**

- ![](assets/2024-11-10-08-10-39.png)

```
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[[7,4,1],[8,5,2],[9,6,3]]
```

**示例 2：**

- ![](assets/2024-11-10-08-10-51.png)

```
输入：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
输出：[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

**提示：**

- `n == matrix.length == matrix[i].length`
- `1 <= n <= 20`
- `-1000 <= matrix[i][j] <= 1000`

## 2. 💻 题解.1 - 暴力解法

```js
/**
 * 22-10-27
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const n = matrix.length, arr = []

  for (let c = 0; c < n; c++) {
    for (let r = n - 1; r >= 0; r--) {
      arr.push(matrix[r][c])
    }
  }
  // console.log(arr)
  // => [7, 4, 1, 8, 5, 2, 9, 6, 3]

  for(let i = 0; i < n * n; i++) {
    const r = Math.floor(i / n)
    const c = i % n
    matrix[r][c] = arr[i]
  }
};
```

- 思路：
  - ![](assets/2024-11-10-08-27-33.png)
  - 把图像顺时针 🔃 旋转 90° 后来看，其实就是从每一列的最后一行开始遍历到第一行的内容。
- 【注意】这种解法不符合题目要求的 **原地** 旋转。

## 3. 💻 题解.2 - 翻转

```js
/**
 * 22-09-22
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const n = matrix.length
  for (let i = 0; i < Math.floor(n / 2); i++) {// 上下翻转
    for (let j = 0; j < n; j++) {
      [matrix[i][j], matrix[n - i - 1][j]] = [matrix[n - i - 1][j], matrix[i][j]]
    }
  }
  for (let i = 0; i < n; i++) {// 对角线不动，以对角线为对称轴交换两侧位置
    for (let j = 0; j < i; j++) {
      if (i === j) continue
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }
}
```

- 思路：先完成垂直反向上的水平翻转，再进行对角线翻转。
  - ![](assets/2024-11-10-08-40-16.png)
  - ![](assets/2024-11-10-08-40-26.png)
  - ![](assets/2024-11-10-08-40-34.png)
- 矩阵类的题目，多在纸上画一画，结合矩阵图形来辅助思考。找到规律后，实现起来可能就很简单，没找到规律那就一头雾水了。
- 优化：垂直反向上的水平翻转可以直接改变整行内容，将第 `i` 行的头指针和第 `n - i - 1` 行的头指针互换即可。
  - ![](assets/2024-11-10-08-53-26.png)

```js
/**
 * 22-10-27
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const n = matrix.length
  for (let i = 0; i < Math.floor(n / 2); i++) {// 上下翻转
    [matrix[i], matrix[n - i - 1]] = [matrix[n - i - 1], matrix[i]]
  }
  for (let i = 0; i < n; i++) {// 对角线不动，以对角线为对称轴交换两侧位置
    for (let j = 0; j < i; j++) {
      if (i === j) continue
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }
}
```
