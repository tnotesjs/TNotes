# [2703. 返回传递的参数的长度【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2703.%20%E8%BF%94%E5%9B%9E%E4%BC%A0%E9%80%92%E7%9A%84%E5%8F%82%E6%95%B0%E7%9A%84%E9%95%BF%E5%BA%A6%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/return-length-of-arguments-passed)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

请你编写一个函数 `argumentsLength`，返回传递给该函数的参数数量。

**示例 1：**

- 输入：`args = [5]`
- 输出：`1`
- 解释：`argumentsLength(5); // 1`

只传递了一个值给函数，因此它应返回 `1`。

**示例 2：**

- 输入：`args = [{}, null, "3"]`
- 输出：`3`
- 解释：`argumentsLength({}, null, "3"); // 3`

传递了三个值给函数，因此它应返回 `3`。

**提示：**

- `args` 是一个有效的 JSON 数组
- `0 <= args.length <= 100`

## 2. 💻 题解.1

```javascript
var argumentsLength = function(...args) {
  return args.length
}
```

- 评论区点个赞～
  - ![](assets/2024-09-26-22-26-49.png)
