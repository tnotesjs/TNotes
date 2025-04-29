# [2624. 蜗牛排序【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2624.%20%E8%9C%97%E7%89%9B%E6%8E%92%E5%BA%8F%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📝 Description](#2--description)
- [3. 💻 题解.1](#3--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/snail-traversal/)


## 1. 🔗 links

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from - MDN Array.from()
- https://github.com/Tdahuyou/javascript - 0076. 使用 Array.form 来创建一个二维数组

## 2. 📝 Description

请你编写一段代码为所有数组实现  `snail(rowsCount，colsCount)` 方法，该方法将 1D 数组转换为以蜗牛排序的模式的 2D 数组。无效的输入值应该输出一个空数组。当 `rowsCount * colsCount !==``nums.length` 时。这个输入被认为是无效的。

蜗牛排序从左上角的单元格开始，从当前数组的第一个值开始。然后，它从上到下遍历第一列，接着移动到右边的下一列，并从下到上遍历它。将这种模式持续下去，每列交替变换遍历方向，直到覆盖整个数组。例如，当给定输入数组  `[19, 10, 3, 7, 9, 8, 5, 2, 1, 17, 16, 14, 12, 18, 6, 13, 11, 20, 4, 15]` ，当 `rowsCount = 5` 且 `colsCount = 4` 时，需要输出矩阵如下图所示。注意，矩阵沿箭头方向对应于原数组中数字的顺序

![](assets/2024-09-29-16-47-15.png)

**示例 1：**
```
输入：
nums = [19, 10, 3, 7, 9, 8, 5, 2, 1, 17, 16, 14, 12, 18, 6, 13, 11, 20, 4, 15]
rowsCount = 5
colsCount = 4
输出：
[
 [19,17,16,15],
 [10,1,14,4],
 [3,2,12,20],
 [7,5,18,11],
 [9,8,6,13]
]
```
**示例 2：**
```
输入：
nums = [1,2,3,4]
rowsCount = 1
colsCount = 4
输出：[[1, 2, 3, 4]]
```
**示例 3：**
```
输入：
nums = [1,3]
rowsCount = 2
colsCount = 2
输出：[]
Explanation: 2 * 2 = 4, 且原数组 [1,3] 的长度为 2; 所以，输入是无效的。
```

**提示：**

- `0 <= nums.length <= 250`
- `1 <= nums[i] <= 1000`
- `1 <= rowsCount <= 250`
- `1 <= colsCount <= 250`

## 3. 💻 题解.1

```ts
interface Array<T> {
  snail(rowsCount: number, colsCount: number): number[][];
}

Array.prototype.snail = function (
  rowsCount: number,
  colsCount: number
): number[][] {
  // 处理无效输入
  if (rowsCount * colsCount !== this.length) {
    return [];
  }

  // 二维数组初始化
  const ans: number[][] = Array.from({ length: rowsCount }, () =>
    Array(colsCount)
  );

  for (let i = 0, j = 1, r = 0, c = 0; i < this.length; i++) {
    ans[r][c] = this[i];

    r += j; // 偏移

    // 越界处理
    if (r === rowsCount || r === -1) {
      r -= j;
      j = -j;
      c++;
    }
  }
  return ans;
};

/**
 * const arr = [1,2,3,4];
 * arr.snail(1,4); // [[1,2,3,4]]
 */
```
