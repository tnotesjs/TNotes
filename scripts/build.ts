import fs from 'fs'
import minimist from 'minimist'
import { ROOT_CONFIG_PATH } from './constants.ts'

interface RootConfig {
  statistic: {
    completed_notes_count: number
  }
  sub_knowledge_list: string[]
  root_items: Record<string, any>
}

/**
 * 从 completed_notes_count 中取最近一个月的值
 * 支持对象格式（多月份历史记录）和数字格式（旧格式兼容）
 * 若读取失败或异常，返回 0
 */
function getLatestMonthCount(
  completed_notes_count: Record<string, number> | number | undefined,
): number {
  if (!completed_notes_count) return 0

  // 兼容旧格式（number 类型）
  if (typeof completed_notes_count === 'number') {
    return completed_notes_count
  }

  // 对象格式：取最后一个 key 的值
  try {
    const keys = Object.keys(completed_notes_count).sort()
    return keys.length > 0 ? completed_notes_count[keys[keys.length - 1]] : 0
  } catch {
    return 0
  }
}

/**
 * 读取本地 JSON 文件
 */
const readLocalJSON = <T = any>(filePath: string): T =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'))

/**
 * 收集子知识库配置信息
 *
 * 从根知识库自身的 root_items 中读取每个子库的统计数据，
 * 取最近一个月的值作为当前月份的笔记完成数。
 * 不再远程读取子知识库的 .tnotes.json。
 *
 * @param options.repo 仅收集指定仓库（增量模式）
 */
async function collectSubRepoConfigs(
  options: { repo?: string } = {},
): Promise<void> {
  const { repo } = options

  console.log('📊 开始收集子知识库配置...\n')
  if (repo) console.log(`🎯 增量模式：仅收集 ${repo}\n`)

  const rootConfig = readLocalJSON<RootConfig>(ROOT_CONFIG_PATH)
  let successCount = 0
  let failCount = 0

  // 确定要处理的仓库列表
  const repoList = repo
    ? [repo].filter((r) => rootConfig.sub_knowledge_list.includes(r))
    : rootConfig.sub_knowledge_list

  if (repo && repoList.length === 0) {
    console.error(`❌ ${repo} 不在 sub_knowledge_list 中`)
    process.exit(1)
  }

  // 遍历所有子知识库，从根库自身数据中取最近月份值
  for (const repoName of repoList) {
    const item = rootConfig.root_items[repoName]
    if (!item) {
      console.warn(`⚠️  [${repoName}] 不存在于 root_items 中`)
      failCount++
      continue
    }

    const completedCount = getLatestMonthCount(
      item.completed_notes_count,
    )
    console.log(`✅ [${repoName}] 已收集 (当前月份笔记: ${completedCount})`)
    successCount++
  }

  // 重新统计所有知识库的当前月份笔记总数
  let totalCompletedNotes = 0
  for (const rn of rootConfig.sub_knowledge_list) {
    const item = rootConfig.root_items[rn]
    if (item) {
      totalCompletedNotes += getLatestMonthCount(item.completed_notes_count)
    }
  }

  // 更新统计信息（数字类型）
  rootConfig.statistic = {
    completed_notes_count: totalCompletedNotes,
  }

  // 写入根配置
  fs.writeFileSync(
    ROOT_CONFIG_PATH,
    JSON.stringify(rootConfig, null, 2),
    'utf8',
  )

  console.log('\n📊 收集完成统计:')
  console.log(`   ✅ 成功: ${successCount}`)
  console.log(`   ❌ 失败: ${failCount}`)
  console.log(`   📒 笔记总数: ${totalCompletedNotes}`)
  console.log(`   📁 配置文件: ${ROOT_CONFIG_PATH}`)
}

// CLI 入口
const args = minimist(process.argv.slice(2))
collectSubRepoConfigs({
  repo: args.repo || undefined,
}).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error('❌ 收集配置失败:', message)
  process.exit(1)
})
