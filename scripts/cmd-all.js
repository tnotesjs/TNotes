// cmd-all.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

// 🧩 常量定义 ------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// npm i
// npm run tn:update
// npm run tn:push
const CMD = 'npm run tn:push'

const SUB_KNOWLEDGE_DIR = [
  'TNotes.c-cpp',
  'TNotes.canvas',
  'TNotes.cooking',
  'TNotes.egg',
  'TNotes.electron',
  'TNotes.en-notes',
  'TNotes.footprints',
  'TNotes.git-notes',
  'TNotes.html-css-js',
  'TNotes.introduction',
  'TNotes.leetcode',
  'TNotes.miniprogram',
  'TNotes.network',
  'TNotes.nodejs',
  'TNotes.notes',
  'TNotes.react',
  'TNotes.sql',
  'TNotes.svg',
  'TNotes.typescript',
  'TNotes.vite',
  'TNotes.vitepress',
  'TNotes.vue',
  'TNotes.webpack',
  'TNotes.0',
].map((key) => path.resolve(__dirname, '..', '..', key))

// 📦 主函数逻辑 ------------------------------------------------------------------

function main() {
  console.log(`✅ 正在批量执行命令: ${CMD}`)
  console.log('----------------------------------------')

  for (const dir of SUB_KNOWLEDGE_DIR) {
    const folderName = path.basename(dir)

    // 检查目录是否存在
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ [${folderName}] 目录不存在，跳过`)
      continue
    }

    try {
      // 执行命令
      execSync(CMD, { stdio: ['inherit', 'pipe', 'pipe'], cwd: dir })

      console.log(`✅ [${folderName}]`)
    } catch (err) {
      console.error(`❌ [${folderName}] 命令执行失败: ${err.message}`)
    }
  }

  console.log('\n🎉 done ～')
}

// ▶️ 启动脚本
main()
