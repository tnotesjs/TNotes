# [0278. 第一个错误的版本【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0278.%20%E7%AC%AC%E4%B8%80%E4%B8%AA%E9%94%99%E8%AF%AF%E7%9A%84%E7%89%88%E6%9C%AC%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法](#2--题解1---暴力解法)
- [3. 💻 题解.2 - 二分查找](#3--题解2---二分查找)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/first-bad-version/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

你是产品经理，目前正在带领一个团队开发新的产品。不幸的是，你的产品的最新版本没有通过质量检测。由于每个版本都是基于之前的版本开发的，所以错误的版本之后的所有版本都是错的。

假设你有 `n` 个版本 `[1, 2, ..., n]`，你想找出导致之后所有版本出错的第一个错误的版本。

你可以通过调用 `bool isBadVersion(version)` 接口来判断版本号 `version` 是否在单元测试中出错。实现一个函数来查找第一个错误的版本。你应该尽量减少对调用 API 的次数。

**示例 1：**
```
输入：n = 5, bad = 4
输出：4
解释：
调用 isBadVersion(3) -> false
调用 isBadVersion(5) -> true
调用 isBadVersion(4) -> true
所以，4 是第一个错误的版本。
```
**示例 2：**
```
输入：n = 1, bad = 1
输出：1
```
**提示：**

- `1 <= bad <= n <= 2^31 - 1`

## 2. 💻 题解.1 - 暴力解法

```js
var solution = function (isBadVersion) {
  return function (n) {
    for (let i = 1; i <= n; i ++) if (isBadVersion(i)) return i
  }
};
```

- 直接将所有成员都遍历一遍来查找，从最小的开始。
- 超时：
  - 这种解法在早期（21、22 年那会儿）是可以通过的，不过现在（2024 年 11 月 16 日 23:08:01）测试了一下，发现会超时。
  - leetcode 提交记录
    - ![](assets/2024-11-16-23-09-11.png)

## 3. 💻 题解.2 - 二分查找

```js
var solution = function (isBadVersion) {
  return function (n) {
    let left = 1, right = n, mid = left + ((right - left) >> 1)
    while (left <= right) {
      if (isBadVersion(mid) && !isBadVersion(mid - 1)) return mid // 若当前版本错误，且前一个版本没错，则当前版本就是第一个错误版本。

      if (isBadVersion(mid)) right = mid - 1 // 当前版本有错 - 切片 - 舍弃后续所有错误版本继续查找。
      else left = mid + 1 // 当前版本没错 - 切片 - 舍弃前边的所有正确版本继续查找。

      mid = left + ((right - left) >> 1) // 重新计算中点
    }
  }
}
```

实现思路：同 `704. 二分查找`，不过得加一个判断，当找到错误的成员之后，必须确保该错误成员的左侧（前一个）成员必须是正确的，这样才能确保当前找到的这个错误成员是第一个出错的成员。
