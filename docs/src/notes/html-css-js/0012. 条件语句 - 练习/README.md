# [0012. 条件语句 - 练习](https://github.com/Tdahuyou/html-css-js/tree/main/0012.%20%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5%20-%20%E7%BB%83%E4%B9%A0)

<!-- region:toc -->
- [1. 💻 练习.1 - 判断数字是否是三位数，是否能被 13 整除](#1--练习1---判断数字是否是三位数是否能被-13-整除)
- [2. 💻 练习.2 - 判断学生成绩的等级](#2--练习2---判断学生成绩的等级)
- [3. 💻 练习.3 - 判断健康状况](#3--练习3---判断健康状况)
- [4. 💻 练习.4 - 计算理财收益](#4--练习4---计算理财收益)
- [5. 💻 练习.5 - 猜拳游戏](#5--练习5---猜拳游戏)
<!-- endregion:toc -->
- 完成笔记中记录的相关练习

## 1. 💻 练习.1 - 判断数字是否是三位数，是否能被 13 整除

假设变量 `number` 中存放的是用户输入的一个数字。

- 若不是三位数，则提示用户输入有误。
- 若是三位数，则判断该数能否被 `13` 整除。

```javascript
var number = 130

if (isNaN(number) || number < 100 || number > 999) {
  console.log('输入有误')
} else {
  if (number % 13 === 0) {
    console.log('能被13整除')
  } else {
    console.log('不能被13整除')
  }
}
```

## 2. 💻 练习.2 - 判断学生成绩的等级

假设 score 是用户输入一个成绩（0-100），判断这个成绩属于哪个范围并输出结果（A:90-100 B:70-89 C:60-69 D:40-59 E:0-39），若用户输入的不是 0-100 的数字，则输出输入有误。

```javascript
var score = 80

if (isNaN(score) || score < 0 || score > 100) {
  console.log('输入有误')
} else {
  if (score >= 90) {
    console.log('A')
  } else if (score >= 70) {
    console.log('B')
  } else if (score >= 60) {
    console.log('C')
  } else if (score >= 40) {
    console.log('D')
  } else {
    console.log('E')
  }
}
```

## 3. 💻 练习.3 - 判断健康状况

**根据世界卫生组织推荐的计算方法：**

男性标准体重计算方法为（身高cm－80）×70﹪

女性标准体重计算方法为（身高cm－70）×60﹪

标准体重正负10%为正常体重

低于标准体重的10%为过瘦

高于标准体重的10%为过重

**编写程序，让用户输入性别、身高、体重，判断用户的健康状况，健康状况有 3 种：**

1. 你的体重正常，请继续保持
2. 你的身体偏瘦，请加强营养
3. 你的身体偏胖，请加强锻炼

```javascript
var height = 166
var weight = 66
var gender = '男'

if (isNaN(height) || isNaN(weight) || (gender !== '男' && gender !== '女')) {
  console.log('输入有误')
} else {
  var standardWeight // 标准体重
  if (gender === '男') {
    standardWeight = (height - 80) * 0.7
  } else {
    standardWeight = (height - 70) * 0.6
  }

  if (weight < standardWeight * 0.9) {
    console.log('你的身体偏瘦，请加强营养')
  } else if (weight > standardWeight * 1.1) {
    console.log('你的身体偏胖，请加强锻炼')
  } else {
    console.log('你的体重正常，请继续保持')
  }
}
```

## 4. 💻 练习.4 - 计算理财收益

**某理财公司推出一种理财服务，服务规则如下：**

1. 若用户的理财金额在 50 万元以下，则每年的收益按照 4% 计算。
2. 若用户的理财金额在 50 万元以上（包括 50万），则每年收益按照 4.5% 计算。
3. 若用户的理财金额超过 200 万，除了理财收益外，还要额外给予用户收益金额的 10%。

编写程序，让用户输入理财金额和理财年限，计算到期后的收益。

```javascript
var money = 1000000 // 100 万
var year = 1

if (isNaN(money) || isNaN(year) || money <= 0 || year <= 0) {
  console.log('输入有误')
} else {
  var rate = 0.04 // 年利率4%
  if (money >= 500000) {
    rate = 0.045
  }
  var earnMoney = money * rate * year // 收益
  if (money >= 2000000) {
    earnMoney += earnMoney * 0.1
  }
  console.log(`总收益为：${earnMoney}`)
}
```

## 5. 💻 练习.5 - 猜拳游戏

编写一个用户和计算机猜拳的游戏，用户输入剪刀、石头或布，与计算机的出拳进行比较，判断胜负。

```javascript
var fist = '剪刀'

if (fist === '剪刀' || fist === '石头' || fist === '布') {
  // 1. 模拟计算机出拳
  var rad = Math.random() // 生成一个 0~1 之间的随机数
  var pcFist // 计算机出拳结果
  if (rad < 0.3333) {
    pcFist = '剪刀'
  } else if (rad < 0.6666) {
    pcFist = '石头'
  } else {
    pcFist = '布'
  }
  // 2. 比较胜负
  console.log(`你的出拳：${fist}, 电脑出拳：${pcFist}`)
  if (
    (fist === '剪刀' && pcFist === '布') ||
    (fist === '布' && pcFist === '石头') ||
    (fist === '石头' && pcFist === '剪刀')
  ) {
    console.log('你胜利了！')
  } else if (fist === pcFist) {
    console.log('平局')
  } else {
    console.log('电脑胜利！')
  }
} else {
  console.log('输入有误')
}
```
