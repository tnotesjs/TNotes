import fs from 'fs'
import path from 'path'
import { __dirname, ROOT_CONFIG_PATH } from './constants.ts'

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
  completed_notes_count: Record<string, number> | number | undefined
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
 * 读取 JSON 文件
 */
const readJSON = <T = any>(filePath: string): T =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'))

/**
 * 收集子知识库配置信息
 */
function collectSubRepoConfigs(): void {
  console.log('📊 开始收集子知识库配置...\n')

  const rootConfig = readJSON<RootConfig>(ROOT_CONFIG_PATH)
  let totalCompletedNotes = 0
  let successCount = 0
  let failCount = 0

  // 遍历所有子知识库
  rootConfig.sub_knowledge_list.forEach((repoName: string) => {
    const configPath = path.resolve(
      __dirname,
      '..',
      '..',
      repoName,
      '.tnotes.json'
    )

    // 检查配置文件是否存在
    if (!fs.existsSync(configPath)) {
      console.warn(`⚠️  [${repoName}] 配置文件不存在`)
      failCount++
      return
    }

    try {
      const subConfig = readJSON<SubConfig>(configPath)

      // 检查是否有 root_item
      if (!subConfig.root_item) {
        console.warn(`⚠️  [${repoName}] 缺少 root_item 字段`)
        failCount++
        return
      }

      // 更新 root_items
      rootConfig.root_items[repoName] = {
        ...rootConfig.root_items[repoName],
        ...subConfig.root_item,
      }

      // 累加当前月份的笔记数量
      const currentMonthCount = getCurrentMonthCount(
        subConfig.root_item.completed_notes_count
      )
      totalCompletedNotes += currentMonthCount

      console.log(
        `✅ [${repoName}] 已收集 (当前月份笔记: ${currentMonthCount})`
      )
      successCount++
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`❌ [${repoName}] 收集失败: ${message}`)
      failCount++
    }
  })

  // 更新统计信息（使用对象格式存储当前月份的数据）
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
    'utf8'
  )

  console.log('\n📊 收集完成统计:')
  console.log(`   ✅ 成功: ${successCount}`)
  console.log(`   ❌ 失败: ${failCount}`)
  console.log(`   📒 笔记总数: ${totalCompletedNotes}`)
  console.log(`   📁 配置文件: ${ROOT_CONFIG_PATH}`)
}

collectSubRepoConfigs()
