# [0046. 全排列【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0046.%20%E5%85%A8%E6%8E%92%E5%88%97%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 回溯](#2--题解1---回溯)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/permutations/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个不含重复数字的数组 `nums` ，返回其 *所有可能的全排列* 。你可以 **按任意顺序** 返回答案。

**示例 1：**
```
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```
**示例 2：**
```
输入：nums = [0,1]
输出：[[0,1],[1,0]]
```
**示例 3：**
```
输入：nums = [1]
输出：[[1]]
```
**提示：**

- `1 <= nums.length <= 6`
- `-10 <= nums[i] <= 10`
- `nums` 中的所有整数 **互不相同**

## 2. 💻 题解.1 - 回溯

```javascript
var permute = function(nums) {
  const ans = [];

  const dfs = (path) => {
    if (path.length === nums.length) {
      ans.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (path.includes(nums[i])) continue;
      path.push(nums[i]);
      dfs(path);
      path.pop();
    }
  }

  dfs([]);
  return ans;
};
```
