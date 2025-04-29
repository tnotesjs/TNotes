# [0520. 检测大写字母【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0520.%20%E6%A3%80%E6%B5%8B%E5%A4%A7%E5%86%99%E5%AD%97%E6%AF%8D%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/detect-capital)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

我们定义，在以下情况时，单词的大写用法是正确的：

- 全部字母都是大写，比如 `"USA"` 。
- 单词中所有字母都不是大写，比如 `"leetcode"` 。
- 如果单词不只含有一个字母，只有首字母大写， 比如 `"Google"` 。

给你一个字符串 `word` 。如果大写用法正确，返回 `true` ；否则，返回 `false` 。

**示例 1：**

输入：word = "USA"
输出：true

**示例 2：**

输入：word = "FlaG"
输出：false

**提示：**

- `1 <= word.length <= 100`
- `word` 由小写和大写英文字母组成

## 2. 💻 题解.1

```javascript
/**
 * @param {string} word
 * @return {boolean}
 */
var detectCapitalUse = function(word) {
  // 'A'.charCodeAt() // 65
  // 'a'.charCodeAt() // 97
  if (isUpperCase(0)) {
    // 首字母大写
    // 检查第二个字母是否存在，若不存在，则返回 true
    if (!word[1]) return true
    // 后续所有字母必须和第二个字母保持一致，否则返回 false
    let isSecondUpperCase = isUpperCase(1)
    for (let i = 2; i < word.length; i++) {
      if (isUpperCase(i) !== isSecondUpperCase) return false
    }
  } else {
    // 首字母非大写，一旦出现一个大写，返回 false
    for (let i = 1; i < word.length; i++) {
      if (isUpperCase(i)) return false
    }
  }
  return true

  function isUpperCase(index) {
    return word[index].charCodeAt() < 97
  }
};
```
