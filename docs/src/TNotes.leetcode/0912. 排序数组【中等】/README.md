# [0912. 排序数组【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0912.%20%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📝 Description](#2--description)
- [3. 💻 题解.1 - 原生排序方法](#3--题解1---原生排序方法)
- [4. 💻 题解.2 - 冒泡排序](#4--题解2---冒泡排序)
  - [4.1. 冒泡排序 - 标准版](#41-冒泡排序---标准版)
  - [4.2. 冒泡排序 - 加入提前终止标志](#42-冒泡排序---加入提前终止标志)
  - [4.3. 冒泡排序 - 鸡尾酒排序 Cocktail Shaker Sort](#43-冒泡排序---鸡尾酒排序-cocktail-shaker-sort)
- [5. 💻 题解.3 - 选择排序](#5--题解3---选择排序)
- [6. 💻 题解.4 - 快速排序](#6--题解4---快速排序)
- [7. 📒 排序的本质](#7--排序的本质)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/sort-an-array)



## 1. 🔗 links

- https://github.com/hustcc/JS-Sorting-Algorithm
  - Github，JS-Sorting-Algorithm，十大经典排序算法。`5.1k starts`
- https://blog.csdn.net/hlc246/article/details/81064951
  - CSDN，排序算法系列之鸡尾酒排序

## 2. 📝 Description

给你一个整数数组 `nums`，请你将该数组升序排列。

**示例 1：**

- 输入：nums = [5,2,3,1]
- 输出：[1,2,3,5]

**示例 2：**

- 输入：nums = [5,1,1,2,0,0]
- 输出：[0,0,1,1,2,5]

**提示：**

- `1 <= nums.length <= 5 * 10^4`
- `-5 * 10^4 <= nums[i] <= 5 * 10^4`

## 3. 💻 题解.1 - 原生排序方法

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
  // 在 JavaScript 中，数组的原生排序方法是 Array.prototype.sort
  return nums.sort((a, b) => a - b)
}
```

写法最简单，并且性能表现也是最优秀的那一批。

![](assets/2024-09-25-17-19-13.png)

## 4. 💻 题解.2 - 冒泡排序

> 提示：
> 尝试通过冒泡排序来解答此题，无论如何修改，提交后始终无法通过。
> 逻辑或许是正确的，不过提交后始终会 **超出时间限制**。

### 4.1. 冒泡排序 - 标准版

冒泡排序的标准版本。

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
  const len = nums.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (compare(nums, j, j + 1)) swap(nums, j, j + 1)
    }
  }
  return nums
};

function compare(arr, a, b) {
  return arr[a] - arr[b] > 0
}

function swap(arr, a, b) {
  const temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
}
```

![](assets/2024-09-25-17-19-58.png)

### 4.2. 冒泡排序 - 加入提前终止标志

对【冒泡排序 - 标准版】做了一些优化处理，如果某次排序过程中没有交换，意味着序列已经是有序的了，直接 break 即可。

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
  const len = nums.length
  let swapped
  for (let i = 0; i < len; i++) {
    swapped = false
    for (let j = 0; j < len - i - 1; j++) {
      if (compare(nums, j, j + 1)) {
        swap(nums, j, j + 1)
        swapped = true
      }
    }
    // 如果没有交换发生，那么数组已经排序好了，可提前结束排序
    if (!swapped) break
  }
  return nums
};

function compare(arr, a, b) {
  return arr[a] - arr[b] > 0
}

function swap(arr, a, b) {
  const temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
}
```

优化完之后依旧是超出时间限制。

![](assets/2024-09-25-17-20-34.png)

### 4.3. 冒泡排序 - 鸡尾酒排序 Cocktail Shaker Sort

**双向冒泡排序（鸡尾酒排序 Cocktail Shaker Sort）**

每一轮从左到右完成后，再从右到左进行一次冒泡排序。

从性能表现来看，这种做法并不一定比传统的冒泡排序性能更好，在数组 **部分有序、接近有序或有较多重复元素 **的情况下，鸡尾酒排序的双向遍历可以更快地缩小未排序部分的范围，从而提高排序效率。

---

**示例 **`**nums: [8, 7, 6, 5, 4, 3, 2, 1]**`** 执行流程**

![](assets/2024-09-25-17-20-55.png)

```javascript
var sortArray = function(nums) {
  const len = nums.length;
  let start = 0;
  let end = len - 1;
  let swapped;

  while (start < end) {
    swapped = false;

    for (let i = start; i < end; i++) {
      if (nums[i] > nums[i + 1]) {
        swap(nums, i, i + 1);
        swapped = true;
      }
    }
    end--;

    for (let i = end; i > start; i--) {
      if (nums[i] < nums[i - 1]) {
        swap(nums, i, i - 1);
        swapped = true;
      }
    }
    start++;

    if (!swapped) break;
  }

  return nums;
};

function swap(arr, a, b) {
  const temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}
```

优化完之后依旧是超出时间限制。

![](assets/2024-09-25-17-20-34.png)

## 5. 💻 题解.3 - 选择排序

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function (nums) {
  const len = nums.length
  let minIdx

  for (let i = 0; i < len - 1; i++) {
    minIdx = i

    for (let j = i + 1; j < len; j++) {
      if (nums[j] < nums[minIdx]) {
        minIdx = j
      }
    }

    if (minIdx !== i) swap(nums, i, minIdx)
  }
  return nums
}

function swap(arr, a, b) {
  const temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
}
```

![](assets/2024-09-25-17-21-40.png)

## 6. 💻 题解.4 - 快速排序

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
  return quickSort(nums, 0, nums.length)
};

function swap(arr, a, b) {
  const temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
}

function quickSort(arr, begin, end) {
  if (begin >= end - 1) return arr // 只有一项 直接 return
  let left = begin
  let right = end
  do {
    do left++
    while (left < right && arr[left] < arr[begin])

    do right--
    while (left < right && arr[right] > arr[begin])

    if (left < right) swap(arr, left, right)
  } while (left < right)

  const swapIdx = left === right ? right - 1 : right
  swap(arr, begin, swapIdx)
  quickSort(arr, begin, swapIdx)
  quickSort(arr, swapIdx + 1, end)
  return arr
}
```

## 7. 📒 排序的本质

排序的本质是基于 **比较** 和 **交换**（或移动）来将数据按某种顺序排列起来。

不同的排序算法在比较和交换的方式上有着显著的不同，这也是为什么各种排序算法在时间复杂度和性能上有所差异的原因。

---

**比较**

在排序过程中，算法需要比较两个或多个元素之间的大小关系，以决定它们的顺序。

例如，在冒泡排序中，每次比较 **相邻 **的两个元素，如果它们的顺序不对，就交换它们的位置。

---

**交换/移动**

根据比较的结果，可能需要交换两个元素的位置，或者将某个元素移动到合适的位置。

例如，冒泡排序通过交换相邻元素来排序，而插入排序则通过将一个元素插入到已排序部分的正确位置来实现排序。
