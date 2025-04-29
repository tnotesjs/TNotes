const fs = require('fs')
const path = require('path')

// 定义歌词文件路径
const songFilePath = path.join(__dirname, 'song.txt')

/**
 * 解析歌词行，提取时间戳和内容
 * @param {string} line - 歌词文件的一行
 * @returns {Object|null} - 返回解析后的对象，包含时间（毫秒）和内容；如果解析失败，返回 null
 */
function parseLyricLine(line) {
  const reg = /\[(\d{2}):(\d{2})\.(\d{2})\]\s*(.+)/
  const matches = reg.exec(line)
  if (!matches) return null

  // 提取分钟、秒、毫秒和歌词内容
  const [_, minutes, seconds, milliseconds, content] = matches
  const time =
    parseInt(minutes, 10) * 60 * 1000 +
    parseInt(seconds, 10) * 1000 +
    parseInt(milliseconds, 10)

  return { time, content }
}

/**
 * 处理歌词文件内容，定时输出歌词
 * @param {string} data - 歌词文件的完整内容
 */
function processLyrics(data) {
  const lines = data.split('\n') // 按行分割歌词

  lines.forEach((line) => {
    const parsedLine = parseLyricLine(line)
    if (parsedLine) {
      // 使用 setTimeout 定时输出歌词
      setTimeout(() => {
        console.log(parsedLine.content)
      }, parsedLine.time)
    }
  })
}

/**
 * 主函数：读取歌词文件并处理
 */
function main() {
  fs.readFile(songFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`读取歌词文件失败: ${err.message}`)
      return
    }

    try {
      processLyrics(data) // 处理歌词内容
    } catch (error) {
      console.error(`处理歌词时发生错误: ${error.message}`)
    }
  })
}

// 执行主函数
main()
