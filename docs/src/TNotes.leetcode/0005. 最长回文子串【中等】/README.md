# [0005. 最长回文子串【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0005.%20%E6%9C%80%E9%95%BF%E5%9B%9E%E6%96%87%E5%AD%90%E4%B8%B2%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 中心扩散](#2--题解1---中心扩散)

<!-- endregion:toc -->

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn/problems/longest-palindromic-substring/)

给你一个字符串 `s`，找到 `s` 中最长的 **回文** **子串**。

**示例 1：**

- 输入：s = "babad"
- 输出："bab"
- 解释："aba" 同样是符合题意的答案。

**示例 2：**

- 输入：s = "cbbd"
- 输出："bb"

**提示：**

- `1 <= s.length <= 1000`
- `s` 仅由数字和英文字母组成

:::

## 2. 💻 题解.1 - 中心扩散

```javascript
var longestPalindrome = function (s) {
  const len = s.length

  if (len < 2) return s

  let maxLen = 0
  let ans = [0, 1]
  // ans[0] 记录起始位置
  // ans[1] 记录长度

  for (let i = 0; i < len - 1; i++) {
    const odd = centerSpread(s, i, i)
    const even = centerSpread(s, i, i + 1)
    const max = odd[1] > even[1] ? odd : even
    if (max[1] > maxLen) {
      ans = max
      maxLen = max[1]
    }
  }

  return s.slice(ans[0], ans[0] + ans[1])
};

function centerSpread(s, l, r) {
  let len = s.length
  while (l >= 0 && r <= len - 1) {
    // 如果不相等，结束循环
    if (s[l] !== s[r]) break

    // 如果相等，则继续往两侧扩散，准备下一次判断
    l--
    r++
  }
  // 两侧各回退到上一步所在的位置（while 循环结束有两种可能：1. 有指针溢出；2. 不满足扩散条件）
  l++
  r--
  return [l, r - l + 1]
}
```

::: details

- 时间复杂度：O(n^2)
- 空间复杂度：O(1)

---

提示：

- 回文性：如果字符串向前和向后读都相同，则它满足 **回文性**。
- 子字符串：**子字符串** 是字符串中连续的 **非空** 字符序列。

**原理简述：**

中心扩散的核心：中心有可能是指定的某个成员，也可能是两个成员之间的间隙。<u>因为回文子串的长度可以是奇数也可以是偶数，而这两种情况必须分别处理。</u>

- 当 `l` 和 `r` 指针，指向的是同一个成员时，表示从指定成员开始向两端扩散。

![](assets/2024-09-25-15-40-07.png)

- 当 `l` 和 `r` 指针，指向的是相邻的两个成员时，表示从两个成员之间的间隙，向两端扩散。

![](assets/2024-09-25-15-40-19.png)

- 每次扩散，指针 `l` 左移一步，指针 `r` 右移一步
- 扩散的条件是满足回文串的特点，也就是 `s[l]` 和 `s[r]` 两者相等
- 每次扩散到没法扩散时，记录下从该位置开始扩散所能扩散到的最长的回文子串

在题解中，记录结果的数据结构，采用的是一个长度为 `2` 的数组，数组的第一位存放子串的起始位置，第二位存放子串的长度。当所有位置都遍历完之后，我们就可以依据该数组，对字符串 `s` 进行截取，最终将结果返回即可。

**特殊情况：**

s 的长度是 1，直接返回 s 即可。

:::
