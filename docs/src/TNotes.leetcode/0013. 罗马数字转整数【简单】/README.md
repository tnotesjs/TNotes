# [0013. 罗马数字转整数【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0013.%20%E7%BD%97%E9%A9%AC%E6%95%B0%E5%AD%97%E8%BD%AC%E6%95%B4%E6%95%B0%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 基于哈希表的逐字符解析法（1）](#2--题解1---基于哈希表的逐字符解析法1)
- [3. 💻 题解.2 - 基于哈希表的逐字符解析法（2）](#3--题解2---基于哈希表的逐字符解析法2)

<!-- endregion:toc -->
- 备注：本文介绍的两种题解，都是基于哈希表来实现的。

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn/problems/roman-to-integer)

罗马数字包含以下七种字符: `I`， `V`， `X`， `L`，`C`，`D` 和 `M`。

| 字符 | 数值 |
| ---- | ---- |
| I    | 1    |
| V    | 5    |
| X    | 10   |
| L    | 50   |
| C    | 100  |
| D    | 500  |
| M    | 1000 |

例如， 罗马数字 `2` 写做 `II` ，即为两个并列的 1 。`12` 写做 `XII` ，即为 `X` + `II` 。 `27` 写做  `XXVII`, 即为 `XX` + `V` + `II` 。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 `IIII`，而是 `IV`。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 `IX`。这个特殊的规则只适用于以下六种情况：

- `I` 可以放在 `V` (5) 和 `X` (10) 的左边，来表示 4 和 9。
- `X` 可以放在 `L` (50) 和 `C` (100) 的左边，来表示 40 和 90。
- `C` 可以放在 `D` (500) 和 `M` (1000) 的左边，来表示 400 和 900。

给定一个罗马数字，将其转换成整数。

**示例 1:**

- 输入: s = "III"
- 输出: 3

**示例 2:**

- 输入: s = "IV"
- 输出: 4

**示例 3:**

- 输入: s = "IX"
- 输出: 9

**示例 4:**

- 输入: s = "LVIII"
- 输出: 58
- 解释: L = 50, V= 5, III = 3.

**示例 5:**

- 输入: s = "MCMXCIV"
- 输出: 1994
- 解释: M = 1000, CM = 900, XC = 90, IV = 4.

**提示：**

- `1 <= s.length <= 15`
- `s` 仅含字符 `('I', 'V', 'X', 'L', 'C', 'D', 'M')`
- 题目数据保证 `s` 是一个有效的罗马数字，且表示整数在范围 `[1, 3999]` 内
- 题目所给测试用例皆符合罗马数字书写规则，不会出现跨位等情况。
- IL 和 IM 这样的例子并不符合题目要求，49 应该写作 XLIX，999 应该写作 CMXCIX 。
- 关于罗马数字的详尽书写规则，可以参考 [罗马数字 - Mathematics](https://www.3dfindit.com/zh-CN/keywords/%e7%bd%97%e9%a9%ac%e6%95%b0%e5%ad%97) 。

> PS：不知道官方给的这个参考链接咋用……

:::

## 2. 💻 题解.1 - 基于哈希表的逐字符解析法（1）

```javascript
var romanToInt = function (s) {
  const map = new Map()
  map.set('I', 1)
  map.set('V', 5)
  map.set('X', 10)
  map.set('L', 50)
  map.set('C', 100)
  map.set('D', 500)
  map.set('M', 1000)

  // 特殊值
  map.set('IV', 4)
  map.set('IX', 9)
  map.set('XL', 40)
  map.set('XC', 90)
  map.set('CD', 400)
  map.set('CM', 900)

  let result = 0;
  for (let i = 0; i < s.length; i++) {
    if (map.has(`${s[i]}${s[i + 1]}`)) { // 特殊情况
      result += map.get(`${s[i]}${s[i + 1]}`)
      i++
    } else { // 非特殊情况
      result += map.get(s[i])
    }
  }
  return result
}
```

- 时间复杂度： $O(n)$
- 空间复杂度： $O(1)$

准备好转换库，将正常情况和特殊情况都存储起来，直接从转换库中匹配。

## 3. 💻 题解.2 - 基于哈希表的逐字符解析法（2）

```javascript
var romanToInt = function (s) {
  const map = new Map()
  map.set('I', 1)
  map.set('V', 5)
  map.set('X', 10)
  map.set('L', 50)
  map.set('C', 100)
  map.set('D', 500)
  map.set('M', 1000)

  let ans = 0
  for (let i = 0; i < s.length; i++) {
    if (map.get(s[i]) < map.get(s[i + 1])) { // 特殊情况
      ans += map.get(s[i + 1]) - map.get(s[i])
      i++
    } else { // 正常情况
      ans += map.get(s[i])
    }
  }
  return ans
}
```

- 时间复杂度： $O(n)$
- 空间复杂度： $O(1)$
- 思路：**在存储的时候，只要存储正常情况即可，特殊情况有固定的规律：**
  - 【正常情况】连续字符中，左侧的字符所表示的数字是比右侧的字符所表示的数字大的（或相等），此时累加即可。
  - 【特殊情况】连续字符中，左侧的字符所表示的数字比右侧小，那么左侧的字符表示的是一个负数，即：在累加时，需要对左侧的字符取反，再相加。
