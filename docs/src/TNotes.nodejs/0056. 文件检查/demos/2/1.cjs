const fs = require('fs').promises
const path = require('path')

/**
 * 查看 filename 是否存在且可写
 * @param {string} filename 文件名
 */
async function checkFile(filename) {
  try {
    await fs.access(
      path.join(__dirname, filename),
      fs.constants.F_OK | fs.constants.W_OK // 等效于 fs.constants.W_OK
    )
    console.log(`${filename} 存在，并且可写`)
  } catch (err) {
    console.log(err.message)
    if (err.code == 'ENOENT') {
      console.log(`${filename} 文件不存在`)
    } else if ((err.code = 'EPERM')) {
      console.log(`${filename} 文件存在，但不可写`)
    } else {
      console.log('未知错误')
    }
  }
}

const checkFileList = ['demo.txt', 'demo1.txt', 'demo2.txt']

checkFileList.forEach(async (item) => {
  await checkFile(item)
})

// 输出：
// ENOENT: no such file or directory, access '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0056. 文件检查/demos/2/demo.txt'
// demo.txt 文件不存在
// EACCES: permission denied, access '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0056. 文件检查/demos/2/demo2.txt'
// demo2.txt 文件存在，但不可写
// demo1.txt 存在，并且可写
