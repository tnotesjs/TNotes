# [1695. 删除子数组的最大得分【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/1695.%20%E5%88%A0%E9%99%A4%E5%AD%90%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%80%E5%A4%A7%E5%BE%97%E5%88%86%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 滑动窗口](#2--题解1---滑动窗口)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/maximum-erasure-value/)



## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给你一个正整数数组 `nums` ，请你从中删除一个含有 **若干不同元素** 的子数组。删除子数组的 **得分** 就是子数组各元素之 **和** 。

返回 **只删除一个** 子数组可获得的 **最大得分**。

如果数组 `b` 是数组 `a` 的一个连续子序列，即如果它等于 `a[l],a[l+1],...,a[r]` ，那么它就是 `a` 的一个子数组。

**示例 1：**

- 输入：nums = [4,2,4,5,6]
- 输出：17
- 解释：最优子数组是 [2,4,5,6]

**示例 2：**

- 输入：nums = [5,2,1,2,5,2,1,2,5]
- 输出：8
- 解释：最优子数组是 [5,2,1] 或 [1,2,5]

**提示：**

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^4`

## 2. 💻 题解.1 - 滑动窗口

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumUniqueSubarray = function(nums) {
  const set = new Set()
  let ans = 0, left = 0, right = 0, sum = 0

  while (right < nums.length) {
    if (!set.has(nums[right])) {
      set.add(nums[right])
      sum += nums[right]
      ans = Math.max(ans, sum)
      right++
    } else {
      set.delete(nums[left])
      sum -= nums[left]
      left++
    }
  }
  return ans
};
```

题解参考：0003. 无重复字符的最长子串
