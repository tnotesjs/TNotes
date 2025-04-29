# [2414. 最长的字母序连续子字符串的长度【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2414.%20%E6%9C%80%E9%95%BF%E7%9A%84%E5%AD%97%E6%AF%8D%E5%BA%8F%E8%BF%9E%E7%BB%AD%E5%AD%90%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E9%95%BF%E5%BA%A6%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/length-of-the-longest-alphabetical-continuous-substring)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

**字母序连续字符串** 是由字母表中连续字母组成的字符串。换句话说，字符串 `"abcdefghijklmnopqrstuvwxyz"` 的任意子字符串都是 **字母序连续字符串** 。

- 例如，`"abc"` 是一个字母序连续字符串，而 `"acb"` 和 `"za"` 不是。

给你一个仅由小写英文字母组成的字符串 `s` ，返回其 **最长** 的 字母序连续子字符串 的长度。

**示例 1：**

- 输入：s = "abacaba"
- 输出：2
- 解释：共有 4 个不同的字母序连续子字符串 "a"、"b"、"c" 和 "ab" 。
  - "ab" 是最长的字母序连续子字符串。

**示例 2：**

- 输入：s = "abcde"
- 输出：5
- 解释："abcde" 是最长的字母序连续子字符串。

**提示：**

- `1 <= s.length <= 10^5`
- `s` 由小写英文字母组成

## 2. 💻 题解.1

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var longestContinuousSubstring = function(s) {
  const len = s.length
  if (len === 1) return len

  let ans = curMax = 1
  for (let i = 0; i + 1 < len; i++) {
    if (s[i + 1].codePointAt() - s[i].codePointAt() === 1) {
      curMax++
    } else {
      curMax = 1
    }
    ans = Math.max(curMax, ans)
  }

  return ans
};
```
