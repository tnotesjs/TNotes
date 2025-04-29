# [0557. 反转字符串中的单词 III【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0557.%20%E5%8F%8D%E8%BD%AC%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E7%9A%84%E5%8D%95%E8%AF%8D%20III%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法 - 使用原生 API](#2--题解1---暴力解法---使用原生-api)
- [3. 💻 题解.2 - 双指针](#3--题解2---双指针)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/reverse-words-in-a-string-iii/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个字符串 `s` ，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。

**示例 1：**
```
输入：s = "Let's take LeetCode contest"
输出："s'teL ekat edoCteeL tsetnoc"
```
**示例 2:**
```
输入： s = "Mr Ding"
输出："rM gniD"
```

**提示：**

- `1 <= s.length <= 5 * 10^4`
- `s` 包含可打印的 **ASCII** 字符。
- `s` 不包含任何开头或结尾空格。
- `s` 里 **至少** 有一个词。
- `s` 中的所有单词都用一个空格隔开。

## 2. 💻 题解.1 - 暴力解法 - 使用原生 API

```js
var reverseWords = function(s) {
  return s.split(" ").map(item => item.split("").reverse().join("")).join(" ")
}
```

- 处理逻辑：

```js
// 1. 先将字符串按照空格进行拆分，得到一个新数组
"Let's take LeetCode contest".split(" ")
// => ["Let's", "take", "LeetCode", "contest"]

// 2. 再对每一项进行反转，在反转过程中，需要将其转为 Array 类型
"Let's take LeetCode contest".split(" ").map(item => item.split("").reverse().join(""))
// => ["s'teL", 'ekat', 'edoCteeL', 'tsetnoc']

// 3. 最后将结果拼接为一个字符串即可
"Let's take LeetCode contest".split(" ").map(item => item.split("").reverse().join("")).join(" ")
// => "s'teL ekat edoCteeL tsetnoc"
```

## 3. 💻 题解.2 - 双指针

```js
/**
示例：
  输入："abcde" 1 3
  输出：adcbe
  注解：将字符串的第1位到第3位进行反转
类似于 344. 反转字符串
 */
var reverseString = function (s) {
  let left = 0, len = s.length, right = len - 1, newArr = new Array(len)
  while (left <= right) {
    newArr[left] = s[right]
    newArr[right] = s[left]
    left++, right--
  }
  return newArr.join("")
};

/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  return s.split(" ").map(item => reverseString(item)).join(" ");
};
```

- `newArr = new Array(len)`
  - 由于 JavaScript 中 String 是不可变的，所以这里就换成了 Array 来替代一下，实现原理上和 `344. 反转字符串` 都是一样的。
