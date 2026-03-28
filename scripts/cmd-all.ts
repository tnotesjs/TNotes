// cmd-all.ts - 在所有子知识库中批量执行命令
import { execSync } from 'child_process'
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'
import { __dirname, ROOT_CONFIG_PATH } from './constants.ts'

interface RootConfig {
  sub_knowledge_list: string[]
}
const COMMANDS_FILE = path.resolve(__dirname, 'commands.sh')

const TEMPLATE_PKG = `{
  "type": "module",
  "scripts": {
    "tn:build": "                       tsx ./.vitepress/tnotes/index.ts --build",
    "tn:create-notes": "                tsx ./.vitepress/tnotes/index.ts --create-notes",
    "tn:dev": "                         tsx ./.vitepress/tnotes/index.ts --dev",
    "tn:fix-timestamps": "              tsx ./.vitepress/tnotes/index.ts --fix-timestamps",
    "tn:help": "                        tsx ./.vitepress/tnotes/index.ts --help",
    "tn:preview": "                     tsx ./.vitepress/tnotes/index.ts --preview",
    "tn:pull": "                        tsx ./.vitepress/tnotes/index.ts --pull",
    "tn:push": "                        tsx ./.vitepress/tnotes/index.ts --push",
    "tn:sync": "                        tsx ./.vitepress/tnotes/index.ts --sync",
    "tn:sync-core": "                   tsx ./.vitepress/tnotes/index.ts --sync-core",
    "tn:update": "                      tsx ./.vitepress/tnotes/index.ts --update",
    "tn:update-all": "                  tsx ./.vitepress/tnotes/index.ts --update --all",
    "tn:update-completed-count": "      tsx ./.vitepress/tnotes/index.ts --update-completed-count",
    "tn:update-completed-count-all": "  tsx ./.vitepress/tnotes/index.ts --update-completed-count --all"
  },
  "devDependencies": {
    "@types/markdown-it": "^14.1.2",
    "@types/node": "^24.6.2",
    "markdown-it-task-lists": "^2.1.1",
    "mermaid": "^11.5.0",
    "sass-embedded": "^1.90.0",
    "tsx": "^4.19.2",
    "vite": "^7.3.1",
    "vitepress": "^1.6.3",
    "vue": "^3.5.27"
  },
  "dependencies": {
    "d3": "^7.9.0",
    "echarts": "^6.0.0",
    "github-slugger": "^2.0.0",
    "markdown-it-container": "^4.0.0",
    "markdown-it-link-attributes": "^4.0.1",
    "markdown-it-mathjax3": "^4.3.2",
    "marked": "^15.0.11",
    "markmap-lib": "^0.18.12",
    "markmap-toolbar": "^0.18.12",
    "markmap-view": "^0.18.12",
    "swiper": "^11.2.1",
    "uuid": "^11.1.0",
    "vue-echarts": "^8.0.1"
  }
}
`

// 解析命令行参数
const args = minimist(process.argv.slice(2), {
  string: ['cmd', 'command'],
  boolean: ['sync-pkg'],
  alias: {
    c: 'cmd',
    cmd: 'command',
  },
})

/**
 * 获取要执行的命令
 * 优先级: 命令行参数 > commands.sh 文件
 */
function getCommand(): string {
  // 1. 优先使用命令行参数
  if (args.command) {
    return args.command
  }

  // 2. 从 commands.sh 文件读取
  if (fs.existsSync(COMMANDS_FILE)) {
    const content = fs.readFileSync(COMMANDS_FILE, 'utf8')
    // 过滤掉注释和空行
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))

    if (lines.length > 0) {
      // 返回第一条非注释命令
      return lines[0]
    }
  }

  // 3. 默认命令
  console.warn('⚠️  未找到要执行的命令，使用默认命令: git pull')
  return 'git pull'
}

const CMD = getCommand()

// 读取根配置
const rootConfig: RootConfig = JSON.parse(
  fs.readFileSync(ROOT_CONFIG_PATH, 'utf8')
)

const dirs = rootConfig.sub_knowledge_list.map((key: string) =>
  path.resolve(__dirname, '..', '..', key)
)

// --sync-pkg 模式：批量同步 package.json 文件内容
if (args['sync-pkg']) {
  console.log(`\n🚀 开始批量同步 package.json\n`)
  console.log('----------------------------------------')

  dirs.forEach((dir: string) => {
    const folderName = path.basename(dir)

    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ [${folderName}] 目录不存在，跳过`)
      return
    }

    try {
      const pkgPath = path.resolve(dir, 'package.json')
      fs.writeFileSync(pkgPath, TEMPLATE_PKG.trim() + '\n', 'utf8')
      console.log(`✅ [${folderName}]`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`❌ [${folderName}] 写入失败: ${message}`)
    }
  })

  console.log('\n🎉 done ～')
  process.exit(0)
}

console.log(`\n🚀 开始批量执行命令: ${CMD}\n`)
console.log('----------------------------------------')

// 批量执行命令
dirs.forEach((dir: string) => {
    const folderName = path.basename(dir)

    // 检查目录是否存在
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ [${folderName}] 目录不存在，跳过`)
      return
    }

    try {
      // 执行命令
      console.log(`▶️  [${folderName}]`)
      execSync(CMD, { stdio: 'inherit', cwd: dir })
      console.log(`✅ [${folderName}]`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`❌ [${folderName}] 命令执行失败: ${message}`)
    }
  })

console.log('\n🎉 done ～')
