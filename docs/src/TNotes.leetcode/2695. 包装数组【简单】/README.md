# [2695. 包装数组【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2695.%20%E5%8C%85%E8%A3%85%E6%95%B0%E7%BB%84%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/array-wrapper)

- 总感觉这题考察的点有点儿偏，你需要知道对象类型的加法运算，实际上会先走 valueOf 然后走 toString。但是平时谁没事会那对象来做加法运算呢？？？除此之外，你还需要知道在 JS 中，当一个函数被 new 关键字调用的时候，会隐式的在函数作用域的头部新建一个 this，然后在结尾将 this 返回。

```javascript
var ArrayWrapper = function(nums) {
  // const this = {} // 头部会隐式的新建一个对象
  this.nums = nums
  // return this // 结尾会将这个对象给返回
}

new ArrayWrapper(...)
```

- 只要我们的函数在调用的时候，加上了 new 关键字的话，那么被注释掉的两条语句，相当于是自动执行，是不可见的行为。（这两条语句的内部实际实现应该不是这么简单地写，不过在做题时，我们可以先简单地这么理解。）

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

创建一个名为 `ArrayWrapper` 的类，它在其构造函数中接受一个整数数组作为参数。该类应具有以下两个特性：

- 当使用 `+` 运算符将两个该类的实例相加时，结果值为两个数组中所有元素的总和。
- 当在实例上调用 `String()` 函数时，它将返回一个由逗号分隔的括在方括号中的字符串。例如，`[1,2,3]` 。

**示例 1：**

输入：`nums = [[1,2],[3,4]], operation = "Add"`

输出：`10`

解释：
```js
const obj1 = new ArrayWrapper([1,2]);
const obj2 = new ArrayWrapper([3,4]);
obj1 + obj2; // 10
```

**示例 2：**

输入：`nums = [[23,98,42,70]], operation = "String"`

输出：`"[23,98,42,70]"`

解释：
```js
const obj = new ArrayWrapper([23,98,42,70]);
String(obj); // "[23,98,42,70]"
```

**示例 3：**

输入：`nums = [[],[]], operation = "Add"`

输出：`0`

解释：
```js
const obj1 = new ArrayWrapper([]);
const obj2 = new ArrayWrapper([]);
obj1 + obj2; // 0
```

**提示：**

- `0 <= nums.length <= 1000`
- `0 <= nums[i] <= 1000`
- `注意：nums 是传递给构造函数的数组。`

## 2. 💻 题解.1

```javascript
/**
 * @param {number[]} nums
 * @return {void}
 */
var ArrayWrapper = function(nums) {
  this.nums = nums
};

/**
 * @return {number}
 */
ArrayWrapper.prototype.valueOf = function() {
  return this.nums.reduce((pre, cur) => pre + cur, 0)
}

/**
 * @return {string}
 */
ArrayWrapper.prototype.toString = function() {
  return `[${this.nums.toString()}]`
}

/**
 * const obj1 = new ArrayWrapper([1,2]);
 * const obj2 = new ArrayWrapper([3,4]);
 * obj1 + obj2; // 10
 * String(obj1); // "[1,2]"
 * String(obj2); // "[3,4]"
 */
```
