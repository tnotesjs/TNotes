import { exec } from 'child_process'
import path from 'path'
import { promisify } from 'util'
import { __dirname } from './constants.ts'
import { syncLocalAndRemote } from './utils.ts'

const execAsync = promisify(exec)

/**
 * 执行脚本
 */
async function runScript(
  scriptName: string,
  description: string
): Promise<void> {
  console.log(`🚀 ${description}...`)
  try {
    const { stdout, stderr } = await execAsync(`tsx scripts/${scriptName}`, {
      cwd: path.join(__dirname, '..'),
    })
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
  } catch (error: any) {
    console.error(`❌ ${description}失败: ${error.message}`)
    throw error
  }
}

/**
 * 部署流程
 * 1. 收集子知识库统计信息
 * 2. 收集子知识库侧边栏
 * 3. 同步并推送到远程
 */
async function deploy(): Promise<void> {
  console.log('📦 开始部署流程...\n')

  try {
    // 1. 收集统计信息
    await runScript('build.ts', '收集子知识库统计信息')

    // 2. 收集侧边栏
    await runScript('collect-sidebars.ts', '收集子知识库侧边栏')

    // 3. Git 同步
    console.log('🔄 同步到远程仓库...')
    await syncLocalAndRemote(path.join(__dirname, '..'))

    console.log('\n✅ 部署完成!')
  } catch (error) {
    console.error('\n❌ 部署失败!')
    process.exit(1)
  }
}

deploy()
