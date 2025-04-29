# [0074. 搜索二维矩阵【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0074.%20%E6%90%9C%E7%B4%A2%E4%BA%8C%E7%BB%B4%E7%9F%A9%E9%98%B5%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📝 Description](#2--description)
- [3. 💻 题解.1 - flat](#3--题解1---flat)
- [4. 💻 题解.1 - 循环二维数组](#4--题解1---循环二维数组)
- [5. 💻 题解.1 - 二分查找](#5--题解1---二分查找)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/search-a-2d-matrix/)


## 1. 🔗 links

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
  - MDN - `Array.prototype.flat()` - 将数组拍扁。

## 2. 📝 Description

给你一个满足下述两条属性的 `m x n` 整数矩阵：

- 每行中的整数从左到右按非严格递增顺序排列。
- 每行的第一个整数大于前一行的最后一个整数。

给你一个整数 `target` ，如果 `target` 在矩阵中，返回 `true` ；否则，返回 `false` 。

**示例 1：**

![](assets/2024-11-02-21-32-16.png)

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
输出：true
```

**示例 2：**

![](assets/2024-11-02-21-32-35.png)

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
输出：false
```

**提示：**

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 100`
- `-10^4 <= matrix[i][j], target <= 10^4`

## 3. 💻 题解.1 - flat

```javascript
var searchMatrix = function(matrix, target) {
  return matrix.flat().includes(target);
};
```

- 将二维数组转换为一维 - `Array.prototype.flat()` - 将数组拍扁。
```js
[0, 1, 2, [3, 4]].flat(); // => [0, 1, 2, 3, 4]
[0, 1, 2, [[[3, 4]]]].flat(2); // => [0, 1, 2, [3, 4]]
// flat() 参数默认值为 1
```
- ![](assets/2024-11-03-21-45-21.png)

## 4. 💻 题解.1 - 循环二维数组

```javascript
var searchMatrix = function(matrix, target) {
  const rows = matrix.length, cols = matrix[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const item = matrix[r][c];
      if (item === target) return true;
    }
  }
  return false;
};
```

- 两个 for 循环，暴力循环二维数组的每一项。
  - 一旦发现与目标值 target 相等的项，则返回 true，表示在该二维数组 matrix 中找到了目标值。
  - 若找完所有项都没找到与目标值相等的值，则返回 false，表明该二维数组 matrix 中不存在目标值。
- ![](assets/2024-11-03-21-47-00.png)

## 5. 💻 题解.1 - 二分查找

```javascript
var searchMatrix = function(matrix, target) {
  const rows = matrix.length,
    cols = matrix[0].length;
  let start = 0,
    end = rows * cols - 1;
  while (start <= end) {
    const mid = start + ((end - start) >> 1),
      r = parseInt(mid / cols),
      c = mid % cols,
      item = matrix[r][c];
    if (item === target) return true;
    else if (item < target) start = mid + 1;
    else end = mid - 1;
  }
  return false;
};
```

- 将二维数组视作一维数组来做，并且题目明确该二维数组是有序的。
- ![](assets/2024-11-03-21-47-44.png)
