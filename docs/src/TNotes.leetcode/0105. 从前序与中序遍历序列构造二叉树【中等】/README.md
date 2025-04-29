# [0105. 从前序与中序遍历序列构造二叉树【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0105.%20%E4%BB%8E%E5%89%8D%E5%BA%8F%E4%B8%8E%E4%B8%AD%E5%BA%8F%E9%81%8D%E5%8E%86%E5%BA%8F%E5%88%97%E6%9E%84%E9%80%A0%E4%BA%8C%E5%8F%89%E6%A0%91%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的**先序遍历**， `inorder` 是同一棵树的**中序遍历**，请构造二叉树并返回其根节点。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/02/19/tree.jpg)

- 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
- 输出: [3,9,20,null,null,15,7]

**示例 2:**

- 输入: preorder = [-1], inorder = [-1]
- 输出: [-1]

**提示:**

- `1 <= preorder.length <= 3000`
- `inorder.length == preorder.length`
- `-3000 <= preorder[i], inorder[i] <= 3000`
- `preorder` 和 `inorder` 均 **无重复** 元素
- `inorder` 均出现在 `preorder`
- `preorder` **保证** 为二叉树的前序遍历序列
- `inorder` **保证** 为二叉树的中序遍历序列

## 2. 💻 题解.1

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
  if (preorder.length === 0 || inorder.length === 0) return null

  const root = new TreeNode(preorder[0])
  const idx = inorder.indexOf(root.val)

  root.left = buildTree(preorder.slice(1, 1 + idx), inorder.slice(0, idx))
  root.right = buildTree(preorder.slice(1 + idx), inorder.slice(1 + idx))

  return root
}
```
