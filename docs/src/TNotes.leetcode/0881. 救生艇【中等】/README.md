# [0881. 救生艇【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0881.%20%E6%95%91%E7%94%9F%E8%89%87%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 贪心](#2--题解1---贪心)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/boats-to-save-people)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定数组 `people` 。`people[i]`表示第 `i` 个人的体重 ，**船的数量不限**，每艘船可以承载的最大重量为 `limit`。

每艘船最多可同时载两人，但条件是这些人的重量之和最多为 `limit`。

返回 *承载所有人所需的最小船数* 。

**示例 1：**
```
输入：people = [1,2], limit = 3
输出：1
解释：1 艘船载 (1, 2)
```
**示例 2：**
```
输入：people = [3,2,2,1], limit = 3
输出：3
解释：3 艘船分别载 (1, 2), (2) 和 (3)
```
**示例 3：**
```
输入：people = [3,5,3,4], limit = 5
输出：4
解释：4 艘船分别载 (3), (3), (4), (5)
```

**提示：**

- `1 <= people.length <= 5 * 10^4`
- `1 <= people[i] <= limit <= 3 * 10^4`

## 2. 💻 题解.1 - 贪心

```js
var numRescueBoats = function(people, limit) {
  people.sort((p1, p2) => p1 - p2); // 升序
  let light = 0, heavy = people.length - 1, ans = 0;
  while (light <= heavy) {
    if (people[light] + people[heavy] <= limit) {
      light++;
      heavy--;
    } else {
      heavy--;
    }
    ans++;
  }
  return ans;
};
```

**注解**

核心：能装俩，绝不装一。

先将乘客按照体重升序排序，站在最前面的是最轻的，站在最后面的是最重的。每次都先让最重的上艇，若此时最轻的还能上，则上；不能上，则开艇。

**思考**

- 为什么最重和最轻搭，是最优解呢？

![](assets/2024-11-16-08-41-13.png)


比如说，最重的是 7，最轻的是 1；那么 7 和 3 搭显然是要比 7 和 1 搭更“贪心”，看似更能充分地利用资源。但是，我们不妨换一种思维方式来看待这个问题。

`更充分地利用资源 == 尽可能少地浪费资源`

首先，最轻的 2 必然是要走的，那么它如果能和当前最重的一起走，对资源的浪费是最少的，以此类推。所以说最重和最轻的搭，是最优解。

> 会发现，本题的最优解不唯一。
>
> - 3 + 7 | 5 + 5 | 2 => 浪费的资源 0 + 0 + 8 => 8
>
> - 7 + 2 | 5 + 3 | 5 => 浪费的资源 1 + 2 + 5 => 8
> - ... 等等
>
> 但是这些最优解都有一个共同点，浪费的资源量都是一样的。
