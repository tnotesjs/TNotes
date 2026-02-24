import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import { __dirname, ROOT_CONFIG_PATH } from './constants.ts'
import { pMap, readRepoJSON } from './utils.ts'

interface RootConfig {
  statistic: {
    completed_notes_count: Record<string, number> | number
  }
  sub_knowledge_list: string[]
  root_items: Record<string, any>
}

interface SubConfig {
  root_item: {
    completed_notes_count?: Record<string, number> | number
    [key: string]: any
  }
}

/**
 * 获取当前月份的 key (格式: YY.MM)
 */
function getCurrentMonthKey(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  return `${year}.${month}`
}

/**
 * 从 completed_notes_count 获取当前月份的数量
 */
function getCurrentMonthCount(
  completed_notes_count: Record<string, number> | number | undefined,
): number {
  if (!completed_notes_count) return 0

  // 兼容旧格式（number 类型）
  if (typeof completed_notes_count === 'number') {
    return completed_notes_count
  }

  // 新格式：从当前月份读取
  const currentKey = getCurrentMonthKey()
  return completed_notes_count[currentKey] || 0
}

/**
 * 读取本地 JSON 文件
 */
const readLocalJSON = <T = any>(filePath: string): T =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'))

/**
 * 收集子知识库配置信息
 *
 * @param options.remote 是否强制远程读取
 * @param options.repo 仅收集指定仓库（增量模式）
 */
async function collectSubRepoConfigs(
  options: { remote?: boolean; repo?: string } = {},
): Promise<void> {
  const { remote = false, repo } = options

  console.log('📊 开始收集子知识库配置...\n')
  if (remote) console.log('🌐 使用远程模式读取\n')
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

  // 并行读取所有子知识库配置（并发数 6）
  const results = await pMap(repoList, async (repoName) => {
    try {
      const subConfig = await readRepoJSON<SubConfig>(
        repoName,
        '.tnotes.json',
        { forceRemote: remote },
      )
      return { repoName, subConfig, error: null }
    } catch (error: unknown) {
      return { repoName, subConfig: null, error }
    }
  })

  // 处理结果
  for (const { repoName, subConfig, error } of results) {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`❌ [${repoName}] 收集失败: ${message}`)
      failCount++
      continue
    }

    if (!subConfig) {
      console.warn(`⚠️  [${repoName}] 配置文件不存在或读取失败`)
      failCount++
      continue
    }

    if (!subConfig.root_item) {
      console.warn(`⚠️  [${repoName}] 缺少 root_item 字段`)
      failCount++
      continue
    }

    // 更新 root_items
    rootConfig.root_items[repoName] = {
      ...rootConfig.root_items[repoName],
      ...subConfig.root_item,
    }

    const currentMonthCount = getCurrentMonthCount(
      subConfig.root_item.completed_notes_count,
    )
    console.log(`✅ [${repoName}] 已收集 (当前月份笔记: ${currentMonthCount})`)
    successCount++
  }

  // 重新统计所有知识库的当前月份笔记总数
  let totalCompletedNotes = 0
  for (const rn of rootConfig.sub_knowledge_list) {
    const item = rootConfig.root_items[rn]
    if (item) {
      totalCompletedNotes += getCurrentMonthCount(item.completed_notes_count)
    }
  }

  // 更新统计信息
  const currentKey = getCurrentMonthKey()
  rootConfig.statistic = {
    completed_notes_count: {
      [currentKey]: totalCompletedNotes,
    },
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
  remote: !!args.remote,
  repo: args.repo || undefined,
}).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error('❌ 收集配置失败:', message)
  process.exit(1)
})
