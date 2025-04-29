# [0933. 最近的请求次数【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0933.%20%E6%9C%80%E8%BF%91%E7%9A%84%E8%AF%B7%E6%B1%82%E6%AC%A1%E6%95%B0%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法 - 使用队列 queue](#2--题解1---暴力解法---使用队列-queue)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/number-of-recent-calls)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

写一个 `RecentCounter` 类来计算特定时间范围内最近的请求。

请你实现 `RecentCounter` 类：

- `RecentCounter()` 初始化计数器，请求数为 0 。
- `int ping(int t)` 在时间 `t` 添加一个新请求，其中 `t` 表示以毫秒为单位的某个时间，并返回过去 `3000` 毫秒内发生的所有请求数（包括新请求）。确切地说，返回在 `[t-3000, t]` 内发生的请求数。

**保证** 每次对 `ping` 的调用都使用比之前更大的 `t` 值。

**示例 1：**
```
输入：
["RecentCounter", "ping", "ping", "ping", "ping"]
[[], [1], [100], [3001], [3002]]
输出：
[null, 1, 2, 3, 3]

解释：
RecentCounter recentCounter = new RecentCounter();
recentCounter.ping(1);     // requests = [1]，范围是 [-2999,1]，返回 1
recentCounter.ping(100);   // requests = [1, 100]，范围是 [-2900,100]，返回 2
recentCounter.ping(3001);  // requests = [1, 100, 3001]，范围是 [1,3001]，返回 3
recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002]，范围是 [2,3002]，返回 3
```
**提示：**

- `1 <= t <= 10^9`
- 保证每次对 `ping` 调用所使用的 `t` 值都 **严格递增**
- 至多调用 `ping` 方法 `10^4` 次

## 2. 💻 题解.1 - 暴力解法 - 使用队列 queue

```js
var RecentCounter = function () {
  this.queue = []
};

/**
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function (t) {
  this.queue.push(t) // 入队
  while (this.queue[0] < t - 3000) this.queue.shift() // 出队
  return this.queue.length; // 返回符合条件的队列成员数量
}

/**
 * Your RecentCounter object will be instantiated and called as such:
 * var obj = new RecentCounter()
 * var param_1 = obj.ping(t)
 */
```

- `this.queue.shift()` 移除第一个成员（第二个成员将变为第一个成员，继续判断是否需要移除新的第一个成员。）
