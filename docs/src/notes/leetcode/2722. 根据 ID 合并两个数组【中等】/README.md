# [2722. 根据 ID 合并两个数组【中等】](https://github.com/Tdahuyou/leetcode/tree/main/2722.%20%E6%A0%B9%E6%8D%AE%20ID%20%E5%90%88%E5%B9%B6%E4%B8%A4%E4%B8%AA%E6%95%B0%E7%BB%84%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->
- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)
<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/join-two-arrays-by-id)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

现给定两个数组 `arr1` 和 `arr2` ，返回一个新的数组 `joinedArray` 。两个输入数组中的每个对象都包含一个 `id` 字段。

`joinedArray` 是一个通过 `id` 将 `arr1` 和 `arr2` 连接而成的数组。`joinedArray` 的长度应为唯一值 `id` 的长度。返回的数组应按 `id` **升序** 排序。

如果一个 `id` 存在于一个数组中但不存在于另一个数组中，则该对象应包含在结果数组中且不进行修改。

如果两个对象共享一个 `id` ，则它们的属性应进行合并：

- 如果一个键只存在于一个对象中，则该键值对应该包含在对象中。
- 如果一个键在两个对象中都包含，则 `arr2` 中的值应覆盖 `arr1` 中的值。

**示例 1：**

输入：
```js
arr1 = [
    {"id": 1, "x": 1},
    {"id": 2, "x": 9}
],
arr2 = [
    {"id": 3, "x": 5}
]
```

输出：
```js
[
    {"id": 1, "x": 1},
    {"id": 2, "x": 9},
    {"id": 3, "x": 5}
]
```

解释：没有共同的 id，因此将 arr1 与 arr2 简单地连接起来。

**示例 2：**

输入：
```js
arr1 = [
    {"id": 1, "x": 2, "y": 3},
    {"id": 2, "x": 3, "y": 6}
],
arr2 = [
    {"id": 2, "x": 10, "y": 20},
    {"id": 3, "x": 0, "y": 0}
]
```

输出：
```js
[
    {"id": 1, "x": 2, "y": 3},
    {"id": 2, "x": 10, "y": 20},
    {"id": 3, "x": 0, "y": 0}
]
```

解释：id 为 1 和 id 为 3 的对象在结果数组中保持不变。id 为 2 的两个对象合并在一起。arr2 中的键覆盖 arr1 中的值。

**示例 3：**

输入：
```js
arr1 = [
    {"id": 1, "b": {"b": 94},"v": [4, 3], "y": 48}
]
arr2 = [
    {"id": 1, "b": {"c": 84}, "v": [1, 3]}
]
```

输出：`[ {"id": 1, "b": {"c": 84}, "v": [1, 3], "y": 48} ]`

解释：具有 id 为 1 的对象合并在一起。对于键 "b" 和 "v" ，使用 arr2 中的值。由于键 "y" 只存在于 arr1 中，因此取 arr1 的值。

**提示：**

- `arr1 和 arr2 都是有效的 JSON 数组`
- `在 arr1 和 arr2 中都有唯一的键值 id`
- `2 <= JSON.stringify(arr1).length <= 10^6`
- `2 <= JSON.stringify(arr2).length <= 10^6`

## 2. 💻 题解.1

```javascript
/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
var join = function (arr1, arr2) {
  const ans = [...arr1] // 防止修改 arr1

  // 初始化 map
  const map = new Map() // 存储 id -> index 的映射
  for (let i = 0; i < ans.length; i++) map.set(ans[i].id, i)

  // 查 arr2
  for (let i = 0; i < arr2.length; i++) {
    const item = arr2[i]
    if (!map.has(item.id)) { // id 不存在
      ans.push(item)
      map.set(item.id, ans.length - 1)
    } else { // id 存在
      const existedItem = ans[map.get(item.id)]
      ans[map.get(item.id)] = { ...existedItem, ...item }
    }
  }

  return ans.sort((a, b) => a.id - b.id) // 按照 id 升序排序
};
```












