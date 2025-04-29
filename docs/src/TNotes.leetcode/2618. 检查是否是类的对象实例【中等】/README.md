# [2618. 检查是否是类的对象实例【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2618.%20%E6%A3%80%E6%9F%A5%E6%98%AF%E5%90%A6%E6%98%AF%E7%B1%BB%E7%9A%84%E5%AF%B9%E8%B1%A1%E5%AE%9E%E4%BE%8B%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📝 Description](#2--description)
- [3. 📒 使用 Object() 将原始类型的值转为对应的包装对象](#3--使用-object-将原始类型的值转为对应的包装对象)
- [4. 💻 题解.1](#4--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/check-if-object-instance-of-class)


## 1. 🔗 links

- https://leetcode.cn/problems/check-if-object-instance-of-class/solutions/2288152/2618-jian-cha-shi-fou-shi-lei-de-dui-xia-spyn/ - 题解，2618. 检查是否是类的对象实例。从使用 instanceof 到迭代，递归实现 instanceof。

## 2. 📝 Description

请你编写一个函数，检查给定的值是否是给定类或超类的实例。

**可以传递给函数的数据类型没有限制。**例如，值或类可能是  `undefined` 。

**示例 1：**

- 输入：func = () => checkIfInstance(new Date(), Date)
- 输出：true
- 解释：根据定义，Date 构造函数返回的对象是 Date 的一个实例。

**示例 2：**

- 输入：func = () => { class Animal {}; class Dog extends Animal {}; return checkIfInstance(new Dog(), Animal); }
- 输出：true
- 解释：
  - class Animal {};
  - class Dog extends Animal {};
  - checkIfInstanceOf(new Dog(), Animal); // true

Dog 是 Animal 的子类。因此，Dog 对象同时是 Dog 和 Animal 的实例。

**示例 3：**

- 输入：func = () => checkIfInstance(Date, Date)
- 输出：false
- 解释：日期的构造函数在逻辑上不能是其自身的实例。

**示例 4：**

- 输入：func = () => checkIfInstance(5, Number)
- 输出：true
- 解释：5 是一个 Number。注意，"instanceof" 关键字将返回 false。

## 3. 📒 使用 Object() 将原始类型的值转为对应的包装对象

**提示：**`Object` 函数的参数是各种原始类型的值，转换成对象就是原始类型值对应的包装对象。

```javascript
var obj = Object(1);
obj instanceof Object // true
obj instanceof Number // true

var obj = Object('foo');
obj instanceof Object // true
obj instanceof String // true

var obj = Object(true);
obj instanceof Object // true
obj instanceof Boolean // true
```

## 4. 💻 题解.1

```javascript
/**
 * @param {*} obj
 * @param {*} classFunction
 * @return {boolean}
 */
var checkIfInstanceOf = function (obj, classFunction) {
  if ([null, undefined].includes(obj) || !(classFunction instanceof Function)) return false
  // else if (['object', 'function', 'array'].includes(typeof obj)) return obj instanceof classFunction
  else return Object(obj) instanceof classFunction
};

/**
 * checkIfInstanceOf(new Date(), Date); // true
 */
```

**难点分析**

难点在于 obj 的几乎涵盖了所有 JS 中可能的类型，编写完程序提交之后，时不时会发现有遗漏的类型没考虑到。除了 obj 之外，classFunction 也有可能是任意类型，不一定是函数，不过是否是函数类型，可以通过检查原型链上是否有 Function 的原型来判断。

**Object()**

程序中的 `Object(obj)` 作用是将一个原始类型的值转为引用类型，以便通过 `instanceof` 关键字来检查其类型。引用类型判断可加可不加，效果都一样，若 obj 已经是引用类型了，那么 `Object(obj) === obj`。

```javascript
if (['object', 'function', 'array'].includes(typeof obj)){
  return obj instanceof classFunction
  // 若 if 条件成立，则 Object(obj) === obj
  // 因此上述写法和下面的写法是等价的
  return Object(obj) instanceof classFunction
}
```
