# [0076. 使用 Array.form 来创建一个二维数组](https://github.com/Tdahuyou/html-css-js/tree/main/0076.%20%E4%BD%BF%E7%94%A8%20Array.form%20%E6%9D%A5%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E4%BA%8C%E7%BB%B4%E6%95%B0%E7%BB%84)


## 🔗 links

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from - MDN Array.from()

## 🤖 AI - 通过 Array.form 来创建一个二维数组

使用 `Array.from` 方法可以方便地创建数组。如果你想要创建一个二维数组，你可以通过嵌套调用 `Array.from` 来实现。下面是一些示例代码，展示了如何使用 `Array.from` 创建不同类型的二维数组。

### 示例 1: 创建一个 m x n 的二维数组，所有元素初始化为特定值

假设你想要创建一个 3x4 的二维数组，并且所有的元素都初始化为 0。

```javascript
const rows = 3;
const cols = 4;
const initialValue = 0;

const matrix = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => initialValue)
);

console.log(matrix);
// 输出:
// [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0]
// ]
```

### 示例 2: 创建一个 m x n 的二维数组，每个元素是一个递增的索引

假设你想要创建一个 3x4 的二维数组，其中每个元素是它在数组中的位置（行和列的组合）。

```javascript
const rows = 3;
const cols = 4;

const matrix = Array.from({ length: rows }, (_, rowIndex) =>
  Array.from({ length: cols }, (_, colIndex) => [rowIndex, colIndex])
);

console.log(matrix);
// 输出:
// [
//   [[0, 0], [0, 1], [0, 2], [0, 3]],
//   [[1, 0], [1, 1], [1, 2], [1, 3]],
//   [[2, 0], [2, 1], [2, 2], [2, 3]]
// ]
```

### 示例 3: 创建一个 m x n 的二维数组，每个元素是随机数

假设你想要创建一个 3x4 的二维数组，其中每个元素是一个介于 0 到 99 之间的随机整数。

```javascript
const rows = 3;
const cols = 4;

const matrix = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => Math.floor(Math.random() * 100))
);

console.log(matrix);
// 输出类似于:
// [
//   [45, 17, 88, 66],
//   [23, 55, 34, 92],
//   [78, 12, 47, 61]
// ]
```

### 解释

- `Array.from({ length: n })` 创建了一个长度为 `n` 的新数组。
- 在上面的例子中，我们首先创建了外层数组，其长度等于行数。
- 然后对于每一行，我们再次使用 `Array.from` 来创建内层数组，其长度等于列数。
- 我们可以提供一个映射函数给 `Array.from`，该函数将用于填充数组的每一个元素。在这个映射函数中，我们可以根据需要返回任何值。

这样，你就能够创建一个具有任意维度和初始值的二维数组。