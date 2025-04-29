# [2806. 取整购买后的账户余额【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2806.%20%E5%8F%96%E6%95%B4%E8%B4%AD%E4%B9%B0%E5%90%8E%E7%9A%84%E8%B4%A6%E6%88%B7%E4%BD%99%E9%A2%9D%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)
- [3. 💻 题解.2](#3--题解2)
- [4. 💻 题解.3](#4--题解3)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/account-balance-after-rounded-purchase)

- 备注：找规律解题，规律很多，解法也很多。

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

一开始，你的银行账户里有 `100` 块钱。

给你一个整数`purchaseAmount` ，它表示你在一次购买中愿意支出的金额。

在一个商店里，你进行一次购买，实际支出的金额会向 **最近** 的 `10` 的 **倍数** 取整。换句话说，你实际会支付一个 **非负** 金额 `roundedAmount` ，满足 `roundedAmount` 是 `10` 的倍数且 `abs(roundedAmount - purchaseAmount)` 的值 **最小** 。

如果存在多于一个最接近的 `10` 的倍数，**较大的倍数** 是你的实际支出金额。

请你返回一个整数，表示你在愿意支出金额为 `purchaseAmount` 块钱的前提下，购买之后剩下的余额。

**注意：** `0` 也是 `10` 的倍数。

**示例 1：**

- 输入：`purchaseAmount = 9`
- 输出：`90`
- 解释：这个例子中，最接近 9 的 10 的倍数是 10 。所以你的账户余额为 100 - 10 = 90 。

**示例 2：**

- 输入：`purchaseAmount = 15`
- 输出：`80`
- 解释：这个例子中，有 2 个最接近 15 的 10 的倍数：10 和 20，较大的数 20 是你的实际开销。所以你的账户余额为 `100 - 20 = 80`。

**提示：**

- `0 <= purchaseAmount <= 100`

## 2. 💻 题解.1

![](assets/2024-09-26-23-10-13.png)

```javascript
var accountBalanceAfterPurchase = function (purchaseAmount) {
  const total = 100
  const base = 10
  if (purchaseAmount < base / 2) return 100
  const x1 = Math.trunc(purchaseAmount / base)
  const x2 = Math.trunc((purchaseAmount - base / 2) / base)
  if (x1 === x2) return total - (x1 + 1) * base
  else return total - Math.max(x1, x2) * base
}
```

- 时间复杂度：$O(1)$
- 空间复杂度：$O(1)$

**解题思路：**

找规律，假设要付 n * 10 元，那么在数轴上，从 n * 10 开始往前后各推 10/2，观察这些数字之间的规律。

规律有很多，所以解法也有很多。

![](assets/2024-09-26-23-10-44.png)

## 3. 💻 题解.2

**所有金额整除 5 找规律：**

| purchaseAmount          | 整除 5 得到的结果 | 支付的金额 |
| ----------------------- | ----------------- | ---------- |
| 1、2、3、4              | 0                 | 0          |
| 5～14                   | 1、2              | 10         |
| 15～24                  | 3、4              | 20         |
| 25～34                  | 5、6              | 30         |
| ……                      | ……                | ……         |
| 75～84                  | 15、16            | 80         |
| 85～94                  | 17、18            | 90         |
| 95、96、97、98、99、100 | 19、20            | 100        |


支付的金额，规律如下：

1. purchaseAmount 整除 5
2. 得到的结果 + 1
3. 再整除 2
4. 再乘以 10

$$
\text{roundedAmount} = \left\lfloor \frac{(\left\lfloor \frac{\text{purchaseAmount}}{5} \right\rfloor + 1)}{2} \right\rfloor \times 10
$$

```javascript
var accountBalanceAfterPurchase = function (purchaseAmount) {
  return 100 - Math.floor((Math.floor(purchaseAmount / 5) + 1) / 2) * 10
}
```

## 4. 💻 题解.3

**所有金额 ➕ 5 后整除 10 找规律：**

| purchaseAmount          | 整除 10 得到的结果 | 支付的金额 |
| ----------------------- | ------------------ | ---------- |
| 1、2、3、4              | 0                  | 0          |
| 5～14                   | 1                  | 10         |
| 15～24                  | 2                  | 20         |
| 25～34                  | 3                  | 30         |
| ……                      | ……                 | ……         |
| 75～84                  | 8                  | 80         |
| 85～94                  | 9                  | 90         |
| 95、96、97、98、99、100 | 10                 | 100        |


**🤔 为什么这里会想到加 5？**

以 5、6、7、8、9、10、11、12、13、14 这组数据为例。

若加上 5，就能确保这组数组都是 1 开头，11 ～ 19，多找一些共性的部分，有助于查找规律。

```javascript
var accountBalanceAfterPurchase = function (purchaseAmount) {
  return 100 - Math.floor((purchaseAmount + 5) / 10) * 10;
}
```
