const path = require('path')

const pathList = [
  'D:\\mydiro\\index.html',
  '..\\images\\a.png',
  'D:\\mydiro\\images\\b.jpg',
  'D:\\mydiro\\js\\bootstrap.min.js',
  '..\\js\\main.js',
  'D:\\mydiro\\css\\bootstrap.min.css',
  '..\\css\\main.css',
]
// 需求：以 pathList[0] 作为基准，将路径列表中的所有绝对路径转为相对路径。

let log = ''
const baseDir = pathList[0]

pathList.forEach((filePath, i) => {
  if (path.win32.isAbsolute(filePath)) {
    const relativePath = path.win32.relative(baseDir, filePath)
    pathList[i] = relativePath
    log += `【${filePath}】为绝对路径\n相对【${baseDir}】的路径为：【${relativePath}】\n\n`
  }
})

console.log(log)

// 输出：
// 【D:\mydiro\index.html】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【】

// 【D:\mydiro\images\b.jpg】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【..\images\b.jpg】

// 【D:\mydiro\js\bootstrap.min.js】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【..\js\bootstrap.min.js】

// 【D:\mydiro\css\bootstrap.min.css】为绝对路径
// 相对【D:\mydiro\index.html】的路径为：【..\css\bootstrap.min.css】
