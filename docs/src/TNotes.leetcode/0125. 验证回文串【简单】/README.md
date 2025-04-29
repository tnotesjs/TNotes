# [0125. 验证回文串【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0125.%20%E9%AA%8C%E8%AF%81%E5%9B%9E%E6%96%87%E4%B8%B2%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法](#2--题解1---暴力解法)
- [3. 💻 题解.2 - 双指针](#3--题解2---双指针)
- [4. 📒 正则 `\w`、`\W`](#4--正则-ww)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/valid-palindrome)



## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个 **回文串** 。

字母和数字都属于字母数字字符。

给你一个字符串 `s`，如果它是 **回文串** ，返回 `true` ；否则，返回 `false` 。

**示例 1：**
```
输入: s = "A man, a plan, a canal: Panama"
输出：true
解释："amanaplanacanalpanama" 是回文串。
```

**示例 2：**
```
输入：s = "race a car"
输出：false
解释："raceacar" 不是回文串。
```

**示例 3：**
```
输入：s = " "
输出：true
解释：在移除非字母数字字符之后，s 是一个空字符串 "" 。
由于空字符串正着反着读都一样，所以是回文串。
```

**提示：**

- `1 <= s.length <= 2 * 10^5`
- `s` 仅由可打印的 ASCII 字符组成

## 2. 💻 题解.1 - 暴力解法

```js
var isPalindrome = function (s) {
  // 1. 将所有字母统一转为小写
  // 2. 替换掉所有非法字符：空白字符、非字母字符、非数字字符
  // 3. 字符串逆置
  // 4. 返回比较原字符串和逆置后的字符串的结果
  s = s.toLowerCase().replace(/[^a-z0-9]|\s/g, '')
  return s === [...s].reverse().join("")
}
```

1. 将所有字母统一转为小写 `s.toLowerCase()`
2. 替换掉所有非法字符：空白字符、非字母字符、非数字字符 `s.toLowerCase().replace(/[^a-z0-9]|\s/g, '')`
3. 字符串逆置 `[...s].reverse().join("")`
4. 返回比较原字符串和逆置后的字符串的结果 `return s === [...s].reverse().join("")`

## 3. 💻 题解.2 - 双指针

```js
var isPalindrome = function (s) {
  let i = 0, j = s.length - 1, reg = /[a-zA-Z0-9]/
  while (i < j) {
    if (!reg.test(s[i])) ++i
    else if (!reg.test(s[j])) --j
    else if (s[i].toLowerCase() !== s[j].toLowerCase()) return false
    else i++, j--
  }
  return true
}
```

**实现流程**

1. **初始化变量**：
   - `i`：一个索引变量，初始值为 0，用于从字符串的开头向后遍历。
   - `j`：一个索引变量，初始值为 `s.length - 1`，用于从字符串的末尾向前遍历。
   - `reg`：一个正则表达式 `[a-zA-Z0-9]`，用于检查字符是否是字母或数字。
2. **遍历字符串**：
   - 使用一个 `while` 循环，条件是 `i < j`，即只要 `i` 小于 `j`，就继续循环。
   - 在每次循环中，进行以下检查和操作：
     - **检查 `s[i]` 是否是合法字符**：
       - 如果 `s[i]` 不是字母或数字（使用 `reg.test(s[i])` 检查），则将 `i` 增加 1，跳过当前字符。
     - **检查 `s[j]` 是否是合法字符**：
       - 如果 `s[j]` 不是字母或数字（使用 `reg.test(s[j])` 检查），则将 `j` 减少 1，跳过当前字符。
     - **比较 `s[i]` 和 `s[j]`**：
       - 如果 `s[i]` 和 `s[j]` 都是字母或数字，并且它们的小写形式不相等（使用 `s[i].toLowerCase() !== s[j].toLowerCase()` 检查），则返回 `false`，表示字符串不是回文。
     - **移动指针**：
       - 如果 `s[i]` 和 `s[j]` 都是字母或数字，并且它们的小写形式相等，则将 `i` 增加 1，`j` 减少 1，继续检查下一个字符。
3. **处理完毕**：
   - 当 `i` 不再小于 `j` 时，说明已经检查完所有需要比较的字符。
   - 返回 `true`，表示字符串是回文。


---

实现原理类似的其它写法：

```js
var isPalindrome = function (s) {
  let i = 0
  let j = s.length - 1

  while (i < j) {
    // 跳过非字母数字字符
    while (i < j && !isAlphanumeric(s[i])) i++
    while (i < j && !isAlphanumeric(s[j])) j--

    // 比较字符
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false

    // 移动指针
    i++
    j--
  }

  return true
}

// 辅助函数，判断字符是否为字母或数字
function isAlphanumeric(char) {
  return /[a-zA-Z0-9]/.test(char)
}
```

## 4. 📒 正则 `\w`、`\W`

- `\w` 表示单词字符，等价于 `[a-zA-Z0-9_]`。
- `\W` 表示非单词字符，等价于 `[^a-zA-Z0-9_]`。
- 如果你对正则中的 `\w`、`\W` 比较清楚，会发现上述题解中提到的 `[a-zA-Z0-9]` 和 `\w` 是非常类似的。

```js
/**
 * 22-09-06
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
  s = s.toLowerCase().replace(/[\W|_]/g, '')
  
  const len = s.length
  if (len === 0 || len === 1) return true
  
  let ans = true, start = 0, end = len - 1
  while (start < end) if (s[start++] !== s[end--]) ans = false
  
  return ans
};
```
