// cmd-all.js
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { __dirname, ROOT_CONFIG_PATH } from './constants.js'

const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))

const rootConfig = readJSON(ROOT_CONFIG_PATH)

// pnpm i
// pnpm tn:update
// pnpm tn:push
// git clean -df && git restore . && git pull origin main
const CMD = 'git pull'

console.log(`✅ 正在批量执行命令: ${CMD}`)
console.log('----------------------------------------')

rootConfig.sub_knowledge_list
  .map((key) => path.resolve(__dirname, '..', '..', key))
  .forEach((dir) => {
    const folderName = path.basename(dir)

    // 检查目录是否存在
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ [${folderName}] 目录不存在，跳过`)
      return
    }

    try {
      // 执行命令
      execSync(CMD, { stdio: ['inherit', 'pipe', 'pipe'], cwd: dir })

      console.log(`✅ [${folderName}]`)
    } catch (err) {
      console.error(`❌ [${folderName}] 命令执行失败: ${err.message}`)
    }
  })

console.log('\n🎉 done ～')
