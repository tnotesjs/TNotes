// 加载 module.cjs 模块文件
const module = require('./module.cjs')
// 使用模块方法
console.log('abs(-273) = %d', module.abs(-273))
console.log('circleArea(3) = %d', module.circleArea(3))

// 上面代码中，通过使用 require() 导入了创建的 module.js 模块文件。运行 main.js 文件，结果如下：
// abs(-273) = 273
// circleArea(3) = 28.274333882308138
