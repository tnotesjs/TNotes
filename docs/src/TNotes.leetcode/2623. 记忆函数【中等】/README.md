# [2623. 记忆函数【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2623.%20%E8%AE%B0%E5%BF%86%E5%87%BD%E6%95%B0%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 📒 将数字数组直接作为 key](#2--将数字数组直接作为-key)
- [3. 💻 题解.哈希表](#3--题解哈希表)
- [4. 💻 题解.双哈希表](#4--题解双哈希表)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/memoize)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

请你编写一个函数 `fn`，它接收另一个函数作为输入，并返回该函数的 **记忆化** 后的结果。

**记忆函数** 是一个对于相同的输入永远不会被调用两次的函数。相反，它将返回一个缓存值。

你可以假设有 **3** 个可能的输入函数：`sum` 、`fib` 和 `factorial` 。

- `sum` 接收两个整型参数 `a` 和 `b` ，并返回 `a + b` 。假设如果参数 `(b, a)` 已经缓存了值，其中 `a != b`，它不能用于参数 `(a, b)`。例如，如果参数是 `(3, 2)` 和 `(2, 3)`，则应进行两个单独的调用。
- `fib` 接收一个整型参数 `n` ，如果 `n <= 1` 则返回 `1`，否则返回 `fib (n - 1) + fib (n - 2)`。
- `factorial` 接收一个整型参数 `n` ，如果 `n <= 1` 则返回  `1` ，否则返回 `factorial(n - 1) * n` 。

**示例 1：**

```
输入：
fnName = "sum"
actions = ["call","call","getCallCount","call","getCallCount"]
values = [[2,2],[2,2],[],[1,2],[]]
输出：[4,4,1,3,2]
解释：
const sum = (a, b) => a + b;
const memoizedSum = memoize(sum);
memoizedSum (2, 2);// "call" - 返回 4。sum() 被调用，因为之前没有使用参数 (2, 2) 调用过。
memoizedSum (2, 2);// "call" - 返回 4。没有调用 sum()，因为前面有相同的输入。
// "getCallCount" - 总调用数： 1
memoizedSum(1, 2);// "call" - 返回 3。sum() 被调用，因为之前没有使用参数 (1, 2) 调用过。
// "getCallCount" - 总调用数： 2
```

**示例 2：**

```
输入：
fnName = "factorial"
actions = ["call","call","call","getCallCount","call","getCallCount"]
values = [[2],[3],[2],[],[3],[]]
输出：[2,6,2,2,6,2]
解释：
const factorial = (n) => (n <= 1) ? 1 : (n * factorial(n - 1));
const memoFactorial = memoize(factorial);
memoFactorial(2); // "call" - 返回 2。
memoFactorial(3); // "call" - 返回 6。
memoFactorial(2); // "call" - 返回 2。 没有调用 factorial()，因为前面有相同的输入。
// "getCallCount" -  总调用数：2
memoFactorial(3); // "call" - 返回 6。 没有调用 factorial()，因为前面有相同的输入。
// "getCallCount" -  总调用数：2
```

**示例 3：**

```
输入：
fnName = "fib"
actions = ["call","getCallCount"]
values = [[5],[]]
输出：[8,1]
解释：
fib(5) = 8 // "call"
// "getCallCount" - 总调用数：1
```

**提示：**

- `0 <= a, b <= 10^5`
- `1 <= n <= 10`
- `actions.length === values.length`
- `actions[i]` 为 "call" 和 "getCallCount" 中的一个
- `fnName` 为 "sum", "factorial" 和 "fib" 中的一个

## 2. 📒 将数字数组直接作为 key

```js
const arr = [1, 2]
const cache = {}
cache[arr] = 3

console.log(arr in cache)                   // true

console.log(JSON.stringify(arr))            // [1,2]

console.log(cache[arr])                     // 3
console.log(cache['[1,2]'])                 // undefined
console.log(cache[JSON.stringify(arr)])     // undefined

console.log(cache)                          // { '1,2': 3 }

console.log(arr.join(','))                  // 1,2
console.log(cache['1,2'])                   // 3
console.log(cache[arr.join(',')])           // 3
```

## 3. 💻 题解.哈希表

```js
function memoize(fn) {
    const cache = {};

    return function (...args) {
        if (args in cache) {
            return cache[args];
        }
        const result = fn(...args);
        cache[args] = result;
        return result;
    };
}
```


## 4. 💻 题解.双哈希表

如果使用上述的单哈希表 cache 来缓存函数的返回值，当参数是两个对象时，例如 `[{}, {}]`，`[{}, {}]`，`[{}, {}]`，则 `[{}, {}]` 和 `[{}, {}]` 的索引值是相同的，导致缓存命中。

**示例**
```
输入：
getInputs = () => [[{},{}],[{},{}],[{},{}]]
fn = function (a, b) { return a + b; }
输出：[{"val":{},"calls":1},{"val":{},"calls":2},{"val":{},"calls":3}]
解释：
将两个空对象合并总是会得到一个空对象。尽管看起来应该缓存命中并只调用一次 fn()，但是这些空对象彼此之间都不是 === 相等的。
```
> 这是来自【2630. 记忆函数 II】的示例 2。【solutions - 哈希表】无法满足这个示例的要求。而双哈希表的解决，可以同时满足【2623. 记忆函数】和【2630. 记忆函数 II】两道题。根本原因在于内部单独维护了一个 idxMap 用来映射每一个参数的索引值。

```ts
type Fn = (...params: any) => any;

function memoize(fn: Fn): Fn {
    const idxMap: Map<string, number> = new Map();
    const cache: Map<string, any> = new Map();

    const getIdx = (obj: any): number => {
        if (!idxMap.has(obj)) {
            idxMap.set(obj, idxMap.size);
        }
        return idxMap.get(obj)!;
    };

    return function (...params: any) {
        const key = params.map(getIdx).join(',');
        if (!cache.has(key)) {
            cache.set(key, fn(...params));
        }
        return cache.get(key)!;
    };
}

/**
 * let callCount = 0;
 * const memoizedFn = memoize(function (a, b) {
 *   callCount += 1;
 *   return a + b;
 * })
 * memoizedFn(2, 3) // 5
 * memoizedFn(2, 3) // 5
 * console.log(callCount) // 1
 */
```
