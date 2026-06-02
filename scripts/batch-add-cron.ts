/**
 * batch-add-cron.ts
 *
 * 为所有子知识库的 deploy.yml 添加月初定时触发 (schedule cron)
 * 确保每个月初子库自动跑 deploy，上报当月 completed_notes_count
 *
 * 用法：
 *   pnpm tsx scripts/batch-add-cron.ts          # 预览模式
 *   pnpm tsx scripts/batch-add-cron.ts --apply   # 实际写入并提交推送
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import { __dirname, ROOT_CONFIG_PATH } from './constants.ts'

const REPOS_ROOT = path.resolve(__dirname, '..', '..')

/** Git 组织名 */
const GITHUB_ORG = 'tnotesjs'

/** 要添加的 schedule cron 块 */
const SCHEDULE_BLOCK = `  schedule:
    - cron: '0 0 1 * *'   # 每月 1 号 UTC 00:00 自动触发 deploy`

/**
 * 检查 deploy.yml 是否已有 schedule cron
 */
function hasScheduleCron(content: string): boolean {
  return /\bschedule\s*:/.test(content)
}

/**
 * 在 on: 区块的 workflow_dispatch: 后插入 schedule cron
 * 如果 workflow_dispatch: 不存在，则在 push 块后插入
 */
function insertScheduleCron(content: string): string {
  // 匹配 workflow_dispatch: 及其后面的内容（可能是下一行缩进或直接是下一个 job）
  // 在 workflow_dispatch: 那一行后面插入
  const regex = /^(\s*)workflow_dispatch\s*:\s*$/m
  const match = regex.exec(content)
  if (match) {
    const indent = match[1]
    // 在 workflow_dispatch: 行后插入 schedule
    return content.replace(
      match[0],
      `${match[0]}\n${indent}schedule:\n${indent}  - cron: '0 0 1 * *'   # 每月 1 号 UTC 00:00 自动触发 deploy`,
    )
  }

  // fallback: 在 on: 区块末尾的 push 块后插入（找 permissions: 或 jobs: 前一行）
  const fallbackRegex = /(^on:[\s\S]*?)(\n\S)/m
  return content.replace(
    fallbackRegex,
    `$1\n\n  schedule:\n    - cron: '0 0 1 * *'   # 每月 1 号 UTC 00:00 自动触发 deploy\n$2`,
  )
}

/**
 * 克隆仓库到本地（如果不存在）
 */
function ensureRepoCloned(repoName: string): string {
  const repoPath = path.join(REPOS_ROOT, repoName)

  if (fs.existsSync(path.join(repoPath, '.git'))) {
    // 已存在，拉取最新
    console.log(`  📥 [${repoName}] 已存在，拉取最新...`)
    execSync('git fetch origin && git checkout main && git pull origin main', {
      cwd: repoPath,
      stdio: 'pipe',
    })
    return repoPath
  }

  // 需要克隆
  const cloneUrl = `https://github.com/${GITHUB_ORG}/${repoName}.git`
  console.log(`  🌀 [${repoName}] 克隆中...`)
  execSync(`git clone ${cloneUrl}`, { cwd: REPOS_ROOT, stdio: 'pipe' })
  return repoPath
}

/**
 * 提交并推送更改
 */
function commitAndPush(repoPath: string, repoName: string): void {
  const ymlPath = path.join(repoPath, '.github', 'workflows', 'deploy.yml')

  execSync('git add .github/workflows/deploy.yml', {
    cwd: repoPath,
    stdio: 'pipe',
  })

  execSync(
    `git commit -m "chore: add monthly cron schedule to deploy workflow"`,
    { cwd: repoPath, stdio: 'pipe' },
  )

  execSync('git push origin main', { cwd: repoPath, stdio: 'pipe' })
  console.log(`  🚀 [${repoName}] 已提交并推送`)
}

async function main() {
  const args = minimist(process.argv.slice(2))
  const apply = !!args.apply

  // 读取根配置获取子仓库列表
  const rootConfig = JSON.parse(fs.readFileSync(ROOT_CONFIG_PATH, 'utf8'))
  const repoList: string[] = rootConfig.sub_knowledge_list || []

  console.log(`📋 共 ${repoList.length} 个子知识库\n`)
  if (!apply) {
    console.log('⚠️  预览模式，不会实际写入或推送。加 --apply 参数执行写入。\n')
  }

  let updatedCount = 0
  let skippedCount = 0
  let missingCount = 0
  let clonedCount = 0

  for (const repoName of repoList) {
    const ymlPath = path.join(
      REPOS_ROOT,
      repoName,
      '.github',
      'workflows',
      'deploy.yml',
    )

    // 检查文件是否存在
    if (!fs.existsSync(ymlPath)) {
      if (apply) {
        // 尝试克隆
        try {
          const repoPath = ensureRepoCloned(repoName)
          clonedCount++

          if (!fs.existsSync(ymlPath)) {
            console.log(`  ⚠️  [${repoName}] 克隆后 deploy.yml 仍不存在，跳过`)
            missingCount++
            continue
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error)
          console.log(`  ❌ [${repoName}] 克隆失败: ${message}`)
          missingCount++
          continue
        }
      } else {
        const existsLocally = fs.existsSync(
          path.join(REPOS_ROOT, repoName, '.git'),
        )
        if (!existsLocally) {
          console.log(`  🔍 [${repoName}] 需要克隆（本地不存在）`)
        } else {
          console.log(`  ⚠️  [${repoName}] deploy.yml 不存在`)
        }
        missingCount++
        continue
      }
    }

    const content = fs.readFileSync(ymlPath, 'utf8')

    // 已有 schedule cron 则跳过
    if (hasScheduleCron(content)) {
      console.log(`  ✅ [${repoName}] 已有 schedule cron，跳过`)
      skippedCount++
      continue
    }

    if (apply) {
      // 插入 schedule cron
      const newContent = insertScheduleCron(content)
      fs.writeFileSync(ymlPath, newContent, 'utf8')

      // 提交并推送
      const repoPath = path.join(REPOS_ROOT, repoName)
      try {
        commitAndPush(repoPath, repoName)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        console.log(`  ❌ [${repoName}] 推送失败: ${message}`)
        continue
      }
      console.log(`  📝 [${repoName}] 已添加 schedule cron`)
    } else {
      console.log(`  🔍 [${repoName}] 将添加 schedule cron`)
    }
    updatedCount++
  }

  console.log('\n📊 统计:')
  console.log(`   📝 ${apply ? '已更新' : '待更新'}: ${updatedCount}`)
  console.log(`   ✅ 已跳过: ${skippedCount}`)
  console.log(`   ⚠️  缺失: ${missingCount}`)
  if (clonedCount > 0) {
    console.log(`   🌀 新克隆: ${clonedCount}`)
  }
}

main().catch((err) => {
  console.error('❌ 批量更新失败:', err.message || err)
  process.exit(1)
})
