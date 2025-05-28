# [2690. 无穷方法对象【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2690.%20%E6%97%A0%E7%A9%B7%E6%96%B9%E6%B3%95%E5%AF%B9%E8%B1%A1%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/infinite-method-object)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

请你编写一个函数，返回一个 **无穷方法对象** 。

**无穷方法对象** 被定义为一个对象，它允许您调用任何方法，并始终返回方法的名称。

例如，如果执行 `obj.abc123()` ，它将返回 `"abc123"` 。

**示例 1：**

- 输入：`method = "abc123"`
- 输出：`"abc123"`
- 解释：
  - `const obj = createInfiniteObject();`
  - `obj['abc123'](); // "abc123"`
  - 返回的字符串应始终与方法名称匹配。

**示例 2：**

- 输入：`method = ".-qw73n|^2It"`
- 输出：`".-qw73n|^2It"`
- 解释：返回的字符串应始终与方法名称匹配。

**提示：**

- `0 <= method.length <= 1000`

## 2. 💻 题解.1

```javascript
/**
 * @return {Object}
 */
var createInfiniteObject = function () {
  return new Proxy({}, {
    get(target, prop) {
      if (typeof prop === 'string') return () => prop
    }
  })
}

/**
 * const obj = createInfiniteObject();
 * obj['abc123'](); // "abc123"
 */
```

**原理简述：**

返回一个 Proxy 代理，包装一层 get，每次访问某个属性的时候，都会被这个 get 拦截，然后我们在这个拦截器里面丢一个 `return () => prop` 函数回去，当函数被调用的时候，将 `prop` 给返回即可。
