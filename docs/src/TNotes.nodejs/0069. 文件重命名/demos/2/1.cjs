const fs = require('fs')
const path = require('path')

// 定义目标目录路径
const dirPath = path.join(__dirname, 'we-imgs')

try {
  // 读取目录中的所有文件
  const files = fs.readdirSync(dirPath)

  // 过滤出图片文件（假设图片文件扩展名为 .png, .jpg, .jpeg, .gif）
  const imageFiles = files.filter((file) => /\.(png|jpe?g|gif)$/i.test(file))

  if (imageFiles.length === 0) {
    console.log('目录中没有图片文件')
    return
  }

  // 获取文件的状态信息（包括时间戳）
  const fileDetails = imageFiles.map((file) => {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)
    return {
      name: file,
      path: filePath,
      time: stats.birthtime || stats.mtime, // 使用创建时间（birthtime），如果不可用则使用修改时间（mtime）
    }
  })

  // 按时间戳升序排序
  fileDetails.sort((a, b) => a.time - b.time)

  // 重命名文件
  fileDetails.forEach((fileDetail, index) => {
    const newFileName = `${index + 1}.png`
    const newFilePath = path.join(dirPath, newFileName)

    // 重命名文件
    fs.renameSync(fileDetail.path, newFilePath)
    console.log(`已将文件 ${fileDetail.name} 重命名为 ${newFileName}`)
  })
} catch (err) {
  console.error(`操作失败: ${err.message}`)
}

// 输出：
// 已将文件 week-009.jpg 重命名为 1.png
// 已将文件 week-008.png 重命名为 2.png
// 已将文件 week-007.png 重命名为 3.png
