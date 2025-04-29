# [0021. 合并两个有序链表【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0021.%20%E5%90%88%E5%B9%B6%E4%B8%A4%E4%B8%AA%E6%9C%89%E5%BA%8F%E9%93%BE%E8%A1%A8%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 📒 测试代码](#2--测试代码)
- [3. 💻 题解.1 - 迭代](#3--题解1---迭代)
- [4. 💻 题解.2 - 递归](#4--题解2---递归)

<!-- endregion:toc -->

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn/problems/merge-two-sorted-lists/)

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

**示例 1：**

- ![](assets/2024-10-26-23-11-25.png)
- 输入：`l1 = [1,2,4], l2 = [1,3,4]`
- 输出：`[1,1,2,3,4,4]`

**示例 2：**

- 输入：`l1 = [], l2 = []`
- 输出：`[]`

**示例 3：**

- 输入：`l1 = [], l2 = [0]`
- 输出：`[0]`

**提示：**

- 两个链表的节点数目范围是 `[0, 50]`
- `-100 <= Node.val <= 100`
- `l1` 和 `l2` 均按 **非递减顺序** 排列

:::

## 2. 📒 测试代码

```js
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

function traverseLinkedList(root) {
  let temp = root;
  while (true) {
      if (temp !== null) {
          console.log(temp.val);
      } else {
          break;
      }
      temp = temp.next;
  }
}

// 示例1
const l1_node1 = new ListNode(1);
const l1_node2 = new ListNode(2);
const l1_node4 = new ListNode(4);
l1_node1.next = l1_node2;
l1_node2.next = l1_node4;

const l2_node1 = new ListNode(1);
const l2_node3 = new ListNode(3);
const l2_node4 = new ListNode(4);
l2_node1.next = l2_node3;
l2_node3.next = l2_node4;

const newList1 = mergeTwoLists(l1_node1, l2_node1);
traverseLinkedList(newList1); // 1 1 2 3 4 4

// 示例2
// const newList2 = mergeTwoLists(new ListNode(null), new ListNode(null));
// traverseLinkedList(newList2); // null null

// 示例3
// const newList3 = mergeTwoLists(new ListNode(null), new ListNode(0));
// traverseLinkedList(newList3); // 0 null
```

## 3. 💻 题解.1 - 迭代

```js
// 22-08-17
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
  if (!list1) return list2
  if (!list2) return list1
  let head, cur
  if (list1.val >= list2.val) {
    head = cur = list2
    list2 = list2.next
  } else {
    head = cur = list1
    list1 = list1.next
  }
  while(list1 && list2) {
    if (list1.val >= list2.val) {
      cur.next = list2
      cur = cur.next
      list2 = list2.next
    } else {
      cur.next = list1
      cur = cur.next
      list1 = list1.next
    }
  }
  cur.next = list1 ? list1 : list2
  return head
};
```

```js
// 官方题解
var mergeTwoLists = function(l1, l2) {
  const prehead = new ListNode(-1);

  let prev = prehead;
  while (l1 != null && l2 != null) {
    if (l1.val <= l2.val) {
      prev.next = l1;
      l1 = l1.next;
    } else {
      prev.next = l2;
      l2 = l2.next;
    }
    prev = prev.next;
  }

  // 合并后 l1 和 l2 最多只有一个还未被合并完，我们直接将链表末尾指向未合并完的链表即可
  prev.next = l1 === null ? l2 : l1;

  return prehead.next;
};
```

- 对比自己写的和官方提供的题解，主要区别：对于空链表的处理
  - 自己的做法：最开始的时候添加判断，如果某个链表是空，那么直接返回另外一个
  - 官方题解的做法：新建一个 prehead 节点，最后返回 prehead.next

## 4. 💻 题解.2 - 递归

```js
var mergeTwoLists = function(list1, list2) {
  if (!list1) return list2
  if (!list2) return list1
  if (list1.val <= list2.val) {
    list1.next = mergeTwoLists(list1.next, list2)
    return list1
  } else {
    list2.next = mergeTwoLists(list1, list2.next)
    return list2
  }
};
```

- 如果使用递归的方式来写，代码确实会更加简洁，不过性能貌似并没有迭代好。
