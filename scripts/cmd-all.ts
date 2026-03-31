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
    "tn:build": "                       tnotes --build",
    "tn:create-notes": "                tnotes --create-notes",
    "tn:dev": "                         tnotes --dev",
    "tn:fix-timestamps": "              tnotes --fix-timestamps",
    "tn:help": "                        tnotes --help",
    "tn:preview": "                     tnotes --preview",
    "tn:pull": "                        tnotes --pull",
    "tn:push": "                        tnotes --push",
    "tn:update": "                      tnotes --update",
    "tn:update-completed-count": "      tnotes --update-completed-count"
  },
  "devDependencies": {
    "vite": "^7.3.1",
    "vitepress": "^1.6.3",
    "vue": "^3.5.27"
  },
  "dependencies": {
    "@tnotesjs/core": "^0.1.12"
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
  fs.readFileSync(ROOT_CONFIG_PATH, 'utf8'),
)

const dirs = rootConfig.sub_knowledge_list.map((key: string) =>
  path.resolve(__dirname, '..', '..', key),
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
