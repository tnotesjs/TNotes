# [2622. 有时间限制的缓存【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2622.%20%E6%9C%89%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E7%9A%84%E7%BC%93%E5%AD%98%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 哈希表](#2--题解1---哈希表)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/cache-with-time-limit/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

编写一个类，它允许获取和设置键-值对，并且每个键都有一个 **过期时间** 。

该类有三个公共方法：

`set(key, value, duration)` ：接收参数为整型键 `key` 、整型值 `value` 和以毫秒为单位的持续时间 `duration` 。一旦 `duration` 到期后，这个键就无法访问。如果相同的未过期键已经存在，该方法将返回 `true` ，否则返回 `false` 。如果该键已经存在，则它的值和持续时间都应该被覆盖。

`get(key)` ：如果存在一个未过期的键，它应该返回这个键相关的值。否则返回 `-1` 。

`count()` ：返回未过期键的总数。


**示例 1：**

输入：
```js
actions = ["TimeLimitedCache", "set", "get", "count", "get"]
values = [[], [1, 42, 100], [1], [], [1]]
timeDeays = [0, 0, 50, 50, 150]
```

输出： `[null, false, 42, 1, -1]`

解释：
- 在 t=0 时，缓存被构造。
- 在 t=0 时，添加一个键值对 (1: 42) ，过期时间为 100ms 。因为该值不存在，因此返回false。
- 在 t=50 时，请求 key=1 并返回值 42。
- 在 t=50 时，调用 count() ，缓存中有一个未过期的键。
- 在 t=100 时，key=1 到期。
- 在 t=150 时，调用 get(1) ，返回 -1，因为缓存是空的。

**示例 2：**

输入：
```js
actions = ["TimeLimitedCache", "set", "set", "get", "get", "get", "count"]
values = [[], [1, 42, 50], [1, 50, 100], [1], [1], [1], []]
timeDelays = [0, 0, 40, 50, 120, 200, 250]
```

输出： `[null, false, true, 50, 50, -1]`

解释：
- 在 t=0 时，缓存被构造。
- 在 t=0 时，添加一个键值对 (1: 42) ，过期时间为 50ms。因为该值不存在，因此返回false。
- 在 t=40 时，添加一个键值对 (1: 50) ，过期时间为 100ms。因为一个未过期的键已经存在，返回 true 并覆盖这个键的旧值。
- 在 t=50 时，调用 get(1) ，返回 50。
- 在 t=120 时，调用 get(1) ，返回 50。
- 在 t=140 时，key=1 过期。
- 在 t=200 时，调用 get(1) ，但缓存为空，因此返回 -1。
- 在 t=250 时，count() 返回0 ，因为缓存是空的，没有未过期的键。


**提示：**

- `0 <= key, value <= 10^9`
- `0 <= duration <= 1000`
- `1 <= actions.length <= 100`
- `actions.length === values.length`
- `actions.length === timeDelays.length`
- `0 <= timeDelays[i] <= 1450`
- `actions[i]` 是 "TimeLimitedCache"、"set"、"get" 和 "count" 中的一个。
- 第一个操作始终是 "TimeLimitedCache" 而且一定会以 0 毫秒的延迟立即执行

## 2. 💻 题解.1 - 哈希表

```ts
class TimeLimitedCache {
    #cache: Map<number, [value: number, expire: number]> = new Map();

    set(key: number, value: number, duration: number): boolean {
        const isExist = this.#cache.has(key);

        if (!this.#isExpired(key)) {
            this.#cache.set(key, [value, Date.now() + duration]);
        }

        return isExist;
    }

    get(key: number): number {
        if (this.#isExpired(key)) return -1;
        const res = this.#cache.get(key)?.[0] ?? -1;
        return res;
    }

    count(): number {
        const xs = Array.from(this.#cache).filter(([key]) => !this.#isExpired(key));
        return xs.length;
    }

    #isExpired = (key: number) =>
        this.#cache.has(key) &&
        (this.#cache.get(key)?.[1] ?? Number.NEGATIVE_INFINITY) < Date.now();
}

/**
 * Your TimeLimitedCache object will be instantiated and called as such:
 * var obj = new TimeLimitedCache()
 * obj.set(1, 42, 1000); // false
 * obj.get(1) // 42
 * obj.count() // 1
 */
```
