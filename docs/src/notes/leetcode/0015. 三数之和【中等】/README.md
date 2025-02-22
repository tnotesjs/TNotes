# [0015. 三数之和【中等】](https://github.com/Tdahuyou/leetcode/tree/main/0015.%20%E4%B8%89%E6%95%B0%E4%B9%8B%E5%92%8C%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->
- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 排序 + 双指针【📺 leetcode.0015.1】](#2--题解1---排序--双指针-leetcode00151)
<!-- endregion:toc -->

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn/problems/3sum/description/)

给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请你返回所有和为 `0` 且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。

**示例 1：**

- 输入：nums = [-1,0,1,2,-1,-4]
- 输出：[[-1,-1,2],[-1,0,1]]
- 解释：
  - nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
  - nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
  - nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
  - 不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
  - 注意，输出的顺序和三元组的顺序并不重要。

**示例 2：**

- 输入：nums = [0,1,1]
- 输出：[]
- 解释：唯一可能的三元组和不为 0 。

**示例 3：**

- 输入：nums = [0,0,0]
- 输出：[[0,0,0]]
- 解释：唯一可能的三元组和为 0 。

**提示：**

- `3 <= nums.length <= 3000`
- `-10^5 <= nums[i] <= 10^5`

:::

## 2. 💻 题解.1 - 排序 + 双指针【📺 leetcode.0015.1】

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const ans = []
  const len = nums.length

  nums.sort((a, b) => a - b) // 升序

  for (let i = 0; i < len - 2; i++) {
    // 跳过重复的数字
    if (i > 0 && nums[i] === nums[i - 1]) continue

    let left = i + 1
    let right = len - 1

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]

      if (sum === 0) {
        ans.push([nums[i], nums[left], nums[right]])

        // 跳过重复的数字
        while (left < right && nums[left] === nums[left + 1]) left++
        while (left < right && nums[right] === nums[right - 1]) right--

        left++
        right--
      } else if (sum < 0) {
        left++
      } else {
        right--
      }
    }
  }
  return ans
};
```

![](assets/0015.%20三数之和-题解-排序+双指针.gif)

**实现流程**

1. **初始化结果数组**

创建一个空数组 `ans`，用于存储所有符合条件的三元组结果。

2. **排序**

首先对数组 `nums` 进行升序排序。

这一步非常重要，因为它将有助于后续使用双指针技巧来寻找满足条件的三元组，并且排序后的数组使得相同数字可以集中在一起，便于跳过重复元素。

3. **外层循环遍历数组**

使用一个 `for` 循环，遍历数组中的每一个元素，设定当前元素为 `nums[i]`。该元素将作为三元组的第一个数字。

为了避免重复计算，跳过与 **前一个**元素相同的元素（通过 `if (i > 0 && nums[i] === nums[i - 1]) continue` 实现），从而避免生成重复的三元组。

4. **双指针初始化**

在每次外层循环中，设定两个指针：`left` 指向当前元素 `i` 后面的第一个元素（`i + 1`），`right` 指向数组的最后一个元素（`len - 1`）。

这两个指针用于寻找与 `nums[i]` 组合成和为 0 的两个数字。

5. **双指针查找**

进入 `while (left < right)` 循环，计算当前三元组的和 `sum = nums[i] + nums[left] + nums[right]`。根据 `sum` 的值，进行以下操作：

- **如果 **`sum === 0`：表示找到一个符合条件的三元组，将其添加到结果数组 `ans` 中。然后：
    - **跳过重复元素**：如果 `left` 和 `right` 所指向的元素有重复，分别跳过这些重复的元素（即 `while (left < right && nums[left] === nums[left + 1]) left++` 和 `while (left < right && nums[right] === nums[right - 1]) right--`）。
    - 然后同时移动 `left` 和 `right` 指针，以继续查找新的三元组。
- **如果 **`sum < 0`：表示当前三元组的和小于 0，需要通过移动 `left` 指针向右来增加总和。
- **如果 **`sum > 0`：表示当前三元组的和大于 0，需要通过移动 `right` 指针向左来减少总和。

6. **返回结果**

外层循环结束后，所有可能的三元组都已经被检查并加入到 `ans` 数组中。返回结果数组 `ans`，其中包含所有符合条件的不重复的三元组。













