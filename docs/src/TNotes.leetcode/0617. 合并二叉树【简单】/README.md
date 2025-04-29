# [0617. 合并二叉树【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0617.%20%E5%90%88%E5%B9%B6%E4%BA%8C%E5%8F%89%E6%A0%91%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 📒 在 js 中，null 参与加法运算的时候自动被视作 0 处理](#2--在-js-中null-参与加法运算的时候自动被视作-0-处理)
- [3. 💻 题解.1 - DFS + 递归](#3--题解1---dfs--递归)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/merge-two-binary-trees/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给你两棵二叉树： `root1` 和 `root2` 。

想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，**不为** null 的节点将直接作为新二叉树的节点。

返回合并后的二叉树。

**注意:** 合并过程必须从两个树的根节点开始。

**示例 1：**

- ![](assets/2024-11-03-10-15-50.png)

```
输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
输出：[3,4,5,5,4,null,7]
```
**示例 2：**
```
输入：root1 = [1], root2 = [1,2]
输出：[2,2]
```

**提示：**

- 两棵树中的节点数目在范围 `[0, 2000]` 内
- `-10^4 <= Node.val <= 10^4`

## 2. 📒 在 js 中，null 参与加法运算的时候自动被视作 0 处理

```js
1 + 2 + null // => 3
```

## 3. 💻 题解.1 - DFS + 递归

```js
var mergeTrees = function (root1, root2) {
  if (root1 && root2) {
    root1.val += root2.val
    root1.left = mergeTrees(root1.left, root2.left) // 处理左边的树
    root1.right = mergeTrees(root1.right, root2.right) // 处理右边的树
  }
  return root1 || root2;
};
```

- 优先处理 root1，优先返回 root1。
  - `return root1 || root2;`
  - 只要 root1 一开始不是空，那么，最后一次 return 时，会将 root1 返回。所以在 if 条件分支中，都是对二叉树 root1 做处理。
