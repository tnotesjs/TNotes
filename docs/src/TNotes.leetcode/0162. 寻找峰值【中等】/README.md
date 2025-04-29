# [0162. 寻找峰值【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0162.%20%E5%AF%BB%E6%89%BE%E5%B3%B0%E5%80%BC%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 二分查找](#2--题解1---二分查找)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/find-peak-element)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

峰值元素是指其值严格大于左右相邻值的元素。

给你一个整数数组 `nums`，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回 **任何一个峰值** 所在位置即可。

你可以假设 `nums[-1] = nums[n] = -∞` 。

你必须实现时间复杂度为 `O(log n)` 的算法来解决此问题。

**示例 1：**
```
输入：nums = [1,2,3,1]
输出：2
解释：3 是峰值元素，你的函数应该返回其索引 2。
```
**示例 2：**
```
输入：nums = [1,2,1,3,5,6,4]
输出：1 或 5
解释：你的函数可以返回索引 1，其峰值元素为 2；
     或者返回索引 5， 其峰值元素为 6。
```
**提示：**

- `1 <= nums.length <= 1000`
- `-2^31 <= nums[i] <= 2^31 - 1`
- 对于所有有效的 `i` 都有 `nums[i] != nums[i + 1]`

## 2. 💻 题解.1 - 二分查找

```js
var findPeakElement = function(nums) {
  let l = 0, r = nums.length - 1, mid = (r - l >> 1) + l;
  while (r > l) {
    if (nums[mid] > nums[mid + 1]) r = mid; // 下坡
    else l = mid + 1; // 上坡
    mid = (r - l >> 1) + l;
  }
  return mid;
};
```

将 nums 比作是一座山，山的两头，是谷底，并且山是没有水平路段的。一个人从某一个点「mid」向左侧「mid + 1」爬山

- 若这一段路是上坡，那么在区间 [mid + 1, R] 之间，必然存在峰值点，令 L = mid + 1，细分区间；（当前点 mid 不可能是峰值点，因为下一个点比它大）
- 若这一段路是下坡，那么在区间 [L, mid] 之间，必然存在峰值点，令 R = mid，细分区间；（当前点 mid 有可能是峰值点，因为它可能还会比前一个点大）
- 循环上述步骤，直到循环结束，L = R = mid，此时就找到了峰值点；

核心：如果是上坡，就往前走；如果是下坡，就不动。

> 题目中说，假设 `nums[-1] = nums[n] = -∞`，也就是说我们可以将两侧比作是谷底；
>
> 提示中说，对于所有有效的 i 都有 nums[i] != nums[i + 1]，也即是说我们可以认为山是没有水平路段的，要么上坡，要么下坡；

类似的题目还有：
- 35
- 74
- 162
- 704
