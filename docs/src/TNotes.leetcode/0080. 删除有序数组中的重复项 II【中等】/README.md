# [0080. 删除有序数组中的重复项 II【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0080.%20%E5%88%A0%E9%99%A4%E6%9C%89%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E7%9A%84%E9%87%8D%E5%A4%8D%E9%A1%B9%20II%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 暴力解法](#2--题解1---暴力解法)
- [3. 💻 题解.2 - 快慢指针](#3--题解2---快慢指针)
- [4. 📒 尝试正则解法失败](#4--尝试正则解法失败)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给你一个有序数组 `nums` ，请你 **[原地](http://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)** 删除重复出现的元素，使得出现次数超过两次的元素**只出现两次** ，返回删除后数组的新长度。

不要使用额外的数组空间，你必须在 **[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95) 修改输入数组** 并在使用 O(1) 额外空间的条件下完成。

**说明：**

为什么返回数值是整数，但输出的答案是数组呢？

请注意，输入数组是以 **「引用」** 方式传递的，这意味着在函数里修改输入数组对于调用者是可见的。

你可以想象内部操作如下:
```
// nums 是以“引用”方式传递的。也就是说，不对实参做任何拷贝
int len = removeDuplicates(nums);

// 在函数里修改输入数组对于调用者是可见的。
// 根据你的函数返回的长度, 它会打印出数组中 该长度范围内 的所有元素。
for (int i = 0; i < len; i++) {
    print(nums[i]);
}
```

**示例 1：**
```
输入：nums = [1,1,1,2,2,3]
输出：5, nums = [1,1,2,2,3]
解释：函数应返回新长度 length = 5, 并且原数组的前五个元素被修改为 1, 1, 2, 2, 3。 不需要考虑数组中超出新长度后面的元素。
```

**示例 2：**
```
输入：nums = [0,0,1,1,1,1,2,3,3]
输出：7, nums = [0,0,1,1,2,3,3]
解释：函数应返回新长度 length = 7, 并且原数组的前七个元素被修改为 0, 0, 1, 1, 2, 3, 3。不需要考虑数组中超出新长度后面的元素。
```

**提示：**

- `1 <= nums.length <= 3 * 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` 已按升序排列

## 2. 💻 题解.1 - 暴力解法

```js
/**
 * 22-08-28
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  let i = j = 0, len = nums.length, n = 2
  while (i < len) {
    // 找第一个和 nums[i] 不等的成员
    while (++j < len) if (nums[j] !== nums[i]) break
    // 判断下标 i, j 之间的差值
    if (j - i < n) {
      i = j
    } else {
      // 缩减 len
      len -= (j - i - n)
      // 移动 i
      i += n
      // 将后续片段往前挪
      for (let k = i; k < len;) nums[k++] = nums[j++]
      // j 复位，以便下次查找
      j = i
    }
  }
  return len
}
```

- 时间复杂度：O(n)
- 空间复杂度：O(1)
- **流程说明：**
  - ![](assets/2024-11-10-18-40-59.png)
- 这种解法的优势在于 n 可配置，本题要求重复次数最大两次，如果修改要求，改为 3、4 次，只需要将 n 赋值为 3、4 即可。

## 3. 💻 题解.2 - 快慢指针

```js
/**
 * 22-08-28
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let len = nums.length
  if (len <= 2) return len

  let i = 1, k = i - 1, j = i + 1
  for (; j < len; j++) {
    // 3 者相等，不做任何处理，j 继续往后挪。
    if (nums[j] === nums[k] && nums[j] === nums[i]) continue
    // 3 者不相等，i、k 往后挪一步
    k++;
    i++;
    // 更新 i，相当于将 nums[j] 插入“新数组”
    nums[i] = nums[j]
  }

  return i + 1
};
```

- 时间复杂度：O(n)
- 空间复杂度：O(1)
- **变量说明：**
  - `i` 是慢指针
  - `j` 是快指针
  - `k` 是一个紧跟着 `i` 的辅助指针
- **流程说明：**
- ![](assets/2024-11-10-18-55-21.png)

## 4. 📒 尝试正则解法失败

```js
var removeDuplicates = function(nums) {
  const reg = /(\d)\1{0,}/g
  const ansArr = nums.join('').replace(reg, (match) => match.slice(0, 2)).split('')
  for (let i = 0; i < ansArr.length; i++) nums[i] = Number(ansArr[i])
  return ansArr.length
}
```

- 这道题一开始想要使用正则表达式（捕获组、反向引用）来实现，但是由于题目中也许会出现负数，所以正则逻辑还需要优化。目前的逻辑，也许仅适用于 nums 中只出现 0~9 的情况。
- 提交记录：虽然能够通过一些示例，但 `nums[i]` 一旦出现负数或者大于 9 的数，这法子就行不通了。
  - ![](assets/2024-11-10-19-07-44.png)
