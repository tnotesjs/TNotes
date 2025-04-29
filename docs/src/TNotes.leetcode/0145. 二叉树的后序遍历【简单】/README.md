# [0145. 二叉树的后序遍历【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0145.%20%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%90%8E%E5%BA%8F%E9%81%8D%E5%8E%86%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📝 Description](#2--description)
- [3. 💻 题解.1 - 递归](#3--题解1---递归)
- [4. 📒 二叉树的遍历](#4--二叉树的遍历)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/binary-tree-postorder-traversal)



## 1. 🔗 links

- https://wansuanfa.com/index.php/701 - 玩算法，二叉树的 DFS 遍历。


## 2. 📝 Description

给你一棵二叉树的根节点 `root` ，返回其节点值的 **后序遍历** 。

**示例 1：**

![](assets/2024-09-25-17-02-44.png)

- 输入：root = [1,null,2,3]
- 输出：[3,2,1]

**示例 2：**

- 输入：root = []
- 输出：[]

**示例 3：**

- 输入：root = [1]
- 输出：[1]

**提示：**

- 树中节点的数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

**进阶：**递归算法很简单，你可以通过迭代算法完成吗？

## 3. 💻 题解.1 - 递归

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
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root, res = []) {
  if (!root) return res
  postorderTraversal(root.left, res)
  postorderTraversal(root.right, res)
  res.push(root.val)
  return res
}
```

## 4. 📒 二叉树的遍历

- 前序遍历（先根次序遍历）：**根节点** -> 左子树 -> 右子树
- 中序遍历（中根次序遍历）：左子树 -> **根节点** -> 右子树
- 后序遍历（后根次序遍历）：左子树 -> 右子树 -> **根节点**

![](assets/2024-09-25-17-01-44.png)

> 图片来源：https://wansuanfa.com/index.php/701
