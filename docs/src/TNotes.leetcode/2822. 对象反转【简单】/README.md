# [2822. 对象反转【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2822.%20%E5%AF%B9%E8%B1%A1%E5%8F%8D%E8%BD%AC%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/inversion-of-object)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个对象 `obj`，返回一个反转的对象 `invertedObj`。

`invertedObj` 应该以 `obj` 的键作为值，以 `obj` 的值作为键。题目保证 `obj` 中的值仅为字符串。该函数应该处理重复值，也就是说，如果在 `obj` 中有多个具有相同值的键，那么 `invertedObj` 应该将该值映射到一个包含所有相应键的数组中。

**示例 1：**

- 输入：`obj = {"a": "1", "b": "2", "c": "3", "d": "4"}`
- 输出：`invertedObj = {"1": "a", "2": "b", "3": "c", "4": "d"}`
- 解释：obj 中的键变成 invertedObj 中的值，而 obj 中的值变成 invertedObj 中的键。

**示例 2：**

- 输入：`obj = {"a": "1", "b": "2", "c": "2", "d": "4"}`
- 输出：`invertedObj = {"1": "a", "2": ["b", "c"], "4": "d"}`
- 解释：在 obj 中有两个具有相同值的键，invertedObj 将该值映射到一个包含所有对应键的数组中。

**示例 3：**

- 输入：`obj = ["1", "2", "3", "4"]`
- 输出：`invertedObj = {"1": "0", "2": "1", "3": "2", "4": "3"}`
- 解释：数组也是对象，因此数组已经转换为一个对象，obj 中的键（索引）变成了 invertedObj 中的值，而 obj 中的值变成了 invertedObj 中的键。

**提示：**

- `obj` 是一个有效的 JSON 对象
- `typeof obj[key] === "string"`
- `2 <= JSON.stringify(obj).length <= 10**5`

## 2. 💻 题解.1

```javascript
/**
 * @param {Object|Array} obj
 * @return {Object}
 */
var invertObject = function (obj) {
  const ans = {}
  const keysAndVals = Object.entries(obj)
  for (let i = 0; i < keysAndVals.length; i++) {
    const [k, v] = keysAndVals[i]
    if (Object.hasOwn(ans, v)) {
      // ans[v] = Array.isArray(ans[v]) ? [...ans[v], k] : [ans[v], k]
      if (Array.isArray(ans[v])) ans[v].push(k)
      else ans[v] = [ans[v], k]
    } else {
      ans[v] = k
    }
  }
  return ans
};
```

`ans[v] = Array.isArray(ans[v]) ? [...ans[v], k] : [ans[v], k]`

题目描述中提到：**“如果在 **`**obj**`** 中有多个具有相同值的键，那么 **`**invertedObj**`** 应该将该值映射到一个包含所有相应键的数组中”**

因此在对调 key、val 时，还需要做一个校验。如果 `ans[v]` 的值已经是数组了，那么将 k 插入到数组结尾，否则新建一个数组。

```typescript
if (Array.isArray(ans[v])) ans[v].push(k)
else ans[v] = [ans[v], k]
```

若数组已经存在了，其实没必要每次都开辟一块新空间来创建一个新数组 `[...ans[v], k]`。这种写法可以改为 `push` 操作，这样能更有效地使用之前已经创建好的数组的空间。

使用 `Array.prototype.reduce` 方法还能进一步简化代码的书写。

```javascript
/**
 * @param {Object|Array} obj
 * @return {Object}
 */
var invertObject = function (obj) {
  return Object.entries(obj).reduce((ans, [k, v]) => {
    if (!Object.hasOwn(ans, v)) ans[v] = k
    else Array.isArray(ans[v]) ? ans[v].push(k) : ans[v] = [ans[v], k]
    return ans
  }, {})
};
```
