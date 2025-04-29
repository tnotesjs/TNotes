# [0022. 括号生成【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0022.%20%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📝 Description](#2--description)
- [3. 💻 题解.1 - 回溯算法](#3--题解1---回溯算法)

<!-- endregion:toc -->

## 1. 🔗 links

- https://leetcode.cn/problems/generate-parentheses/solutions/418884/shou-hua-tu-jie-gua-hao-sheng-cheng-hui-su-suan-fa/
  - 「手画图解」从 22. 括号生成 看回溯算法的三个要点

## 2. 📝 Description

::: details [leetcode](https://leetcode.cn/problems/generate-parentheses/)

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

**示例 1：**
```
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```
**示例 2：**
```
输入：n = 1
输出：["()"]
```
**提示：**

- `1 <= n <= 8`

:::

## 3. 💻 题解.1 - 回溯算法

```js
var generateParenthesis = function (n) {
  const ans = [];

  const dfs = (lRemain, rRemain, str) => {
    if (str.length === n * 2) {
      ans.push(str);
      return;
    }

    if (lRemain > 0) dfs(lRemain - 1, rRemain, str + '(');
    if (rRemain > lRemain) dfs(lRemain, rRemain - 1, str + ')');
  }

  dfs(n, n, "");
  return ans;
};
```


- ![](assets/2024-10-27-00-17-34.png)
  - from: 「手画图解」从 22. 括号生成 看回溯算法的三个要点
  - 该图片来自参考题解，图片中标注的顺序，是 dfs 依次入栈的次序。
  - 图片中标注的顺序，是 dfs 依次入栈的次序。
- 已选：`str`
- 可选：由 `lRemain` 和 `rRemain` 决定
- 结束：`str.length === n * 2`
- 回溯的套路中，难点通常在于确定「可选」是什么，「已选」、「结束」往往都很容易明确。
