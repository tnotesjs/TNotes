# [0058. 最后一个单词的长度【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0058.%20%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E5%8D%95%E8%AF%8D%E7%9A%84%E9%95%BF%E5%BA%A6%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法 - 直接调用原生 API - trim、split、pop](#2--题解1---暴力解法---直接调用原生-api---trimsplitpop)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/length-of-last-word/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给你一个字符串 `s`，由若干单词组成，单词前后用一些空格字符隔开。返回字符串中 **最后一个** 单词的长度。

**单词** 是指仅由字母组成、不包含任何空格字符的最大 **子字符串**。

> **子字符串** 是字符串中连续的 **非空** 字符序列。

**示例 1：**
```
输入：s = "Hello World"
输出：5
解释：最后一个单词是“World”，长度为 5。
```
**示例 2：**
```
输入：s = "   fly me   to   the moon  "
输出：4
解释：最后一个单词是“moon”，长度为 4。
```
**示例 3：**
```
输入：s = "luffy is still joyboy"
输出：6
解释：最后一个单词是长度为 6 的“joyboy”。
```
**提示：**

- `1 <= s.length <= 10^4`
- `s` 仅有英文字母和空格 `' '` 组成
- `s` 中至少存在一个单词

## 2. 💻 题解.1 - 暴力解法 - 直接调用原生 API - trim、split、pop

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
  return s.trim().split(/\s+/).pop().length
}
```
