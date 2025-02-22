# [0704. 二分查找【简单】](https://github.com/Tdahuyou/leetcode/tree/main/0704.%20%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->
- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法](#2--题解1---暴力解法)
- [3. 💻 题解.2 - 二分查找](#3--题解2---二分查找)
- [4. 💻 题解.3 - 暴力解法 - 使用原生 API - indexOf](#4--题解3---暴力解法---使用原生-api---indexof)
<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/binary-search)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个 `n` 个元素有序的（升序）整型数组 `nums` 和一个目标值 `target`  ，写一个函数搜索 `nums` 中的 `target`，如果目标值存在返回下标，否则返回 `-1`。


**示例 1:**
```
输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
```
**示例 2:**
```
输入: nums = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不存在 nums 中因此返回 -1
```

**提示：**

1. 你可以假设 `nums` 中的所有元素是不重复的。
2. `n` 将在 `[1, 10000]`之间。
3. `nums` 的每个元素都将在 `[-9999, 9999]`之间。

## 2. 💻 题解.1 - 暴力解法

```js
var search = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i // 找到了身高相同的同学，返回该同学的位置。
    if (nums[i] > target) return -1 // 当前同学的身高高于目标同学，后续同学都比当前同学高，不可能存在和目标同学相同身高的了。
  }
  return -1 // 目标同学是最高的。
}
```

- 实现思路：
  - ![](https://pic.leetcode-cn.com/1641040650-CRsyOX-image-20220101101423645.png)
  - nums 就好比是从矮到高的一队同学，target 就是要插入到这队同学中的一个新同学。但是，插入规则是，target 只能插入到身高和他相同的那位同学所在的位置「返回该同学所在索引」，如果找不到该同学，那么他无法插入「返回 -1」。

## 3. 💻 题解.2 - 二分查找

```js
var search = function(nums, target) {
  let l = 0, r = nums.length - 1, mid = (r - l >> 1) + l
  while(l <= r) {
    if (nums[mid] === target) return mid // 找到了和 target 相同的成员，返回改成员的索引。
    else if (nums[mid] < target) l = mid + 1 // 切片 - 舍弃掉左边的所有成员，这些成员均小于 target。
    else r = mid - 1 // 切片 - 舍弃掉右边的所有成员，这些成员均大于 target。

    mid = (r - l >> 1) + l // 重新计算剩余成员的中心位置。
  }
  return -1
}
```

- 实现思路：
  - ![](https://pic.leetcode-cn.com/1641040650-Mzlvzj-image-20220101094933992.png)
  - 初始情况下，left 指向头，right 指向尾。通过 left 和 right 计算出中间指针 mid 的位置，由于数组已经是有序的了，所以每次循环时，通过比较 nums[mid] 和 target 之间的大小，即可**不断缩小目标值 target 可能存在的区间**。
- 🤔 思考：继续循环的条件，是否可以改为 `l < r`？
  - 不可
  - 设想一种极端情况，`nums.length === 1`，并且 `nums[0] === target`。这种情况下，应该返回的是 0，但实际返回的是 -1。
- 🤔 思考：每次缩减区间时，都要将 `l = mid + 1` 或 `r = mid - 1`，是否可以改为 `l = mid` 或 `r = mid`？
  - 不可
  - 按照以上程序的逻辑，当 l 和 r 之间的差值小于 2 时，那么 mid 将始终指向 l。

```js
输入：nums = [1, 2], target = 2
输出：1
实际：死循环
```

## 4. 💻 题解.3 - 暴力解法 - 使用原生 API - indexOf

```js
var search = function(nums, target) {
  return nums.indexOf(target)
};
```

- 歪门邪道
  - 题目描述的其实就是 JavaScript 数组原生 api indexOf 的功能。如果仅仅是为了解决问题的话，使用 JavaScript 完全可以使用 indexOf 这个原生的数组 api 来解决。并且在实际开发中，若真遇到此需求，应该也会首先想到使用它。
- 如何选择
  - 实际开发：indexOf
  - 练习算法题：手写 indexOf
  - 练习算法题，主要是锻炼思维，思考思考 indexOf 的实现逻辑。解决实际问题的时候，推荐直接使用 indexOf API 来处理，一方面是简单，只需要一行就搞定了，另外一方面是原生 API 的性能表现很可能会比我们手写的逻辑更好一些。
  - 从本题的提交记录来看，indexOf 的执行时间和消耗的内存都是上述题解中最小的。











