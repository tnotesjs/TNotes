const fs = require('fs').promises
const path = require('path')

async function checkFileExists(filename) {
  try {
    await fs.access(path.join(__dirname, filename), fs.constants.F_OK)
    // await fs.access(path.join(__dirname, filename)) // 等效写法
    console.log(`${filename} 存在`)
  } catch (err) {
    console.log(`${filename} 不存在`)
  }
}

const checkFileList = ['demo.txt', 'demo1', 'demo', 'demo2.txt', 'demo3']

checkFileList.forEach(async (filename) => {
  await checkFileExists(filename)
})

// 输出：
// demo.txt 存在
// demo1 存在
// demo 存在
// demo2.txt 存在
// demo3 不存在

// fs.access(path[, mode], callback)
// 在检查 path 是否存在的时候，不会区分是否是文件、还是文件夹。
// 比如这个示例中，文件和文件夹分别是：
// 文件：demo、demo.txt
// 文件夹：demo1、demos2.txt
