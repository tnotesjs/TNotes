# [2648. 生成斐波那契数列【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2648.%20%E7%94%9F%E6%88%90%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%91%E6%95%B0%E5%88%97%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/generate-fibonacci-sequence)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

请你编写一个生成器函数，并返回一个可以生成 **斐波那契数列** 的生成器对象。

**斐波那契数列** 的递推公式为 `Xn = Xn-1 + Xn-2` 。

这个数列的前几个数字是 `0, 1, 1, 2, 3, 5, 8, 13` 。

**示例 1：**

- 输入：`callCount = 5`
- 输出：`[0,1,1,2,3]`
- 解释：
  - `const gen = fibGenerator();`
  - `gen.next().value; // 0`
  - `gen.next().value; // 1`
  - `gen.next().value; // 1`
  - `gen.next().value; // 2`
  - `gen.next().value; // 3`

**示例 2：**

输入：`callCount = 0`
输出：`[]`
解释：`gen.next()` 永远不会被调用，所以什么也不会输出

**提示：**

- `0 <= callCount <= 50`

## 2. 💻 题解.1

```javascript
/**
 * @return {Generator<number>}
 */
var fibGenerator = function* () {
  let a = 0, b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
};

/**
 * const gen = fibGenerator();
 * gen.next().value; // 0
 * gen.next().value; // 1
 */
```
