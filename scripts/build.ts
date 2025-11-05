import fs from 'fs'
import path from 'path'
import { __dirname, ROOT_CONFIG_PATH } from './constants.ts'

interface RootConfig {
  statistic: {
    completed_notes_count: number
  }
  sub_knowledge_list: string[]
  root_items: Record<string, any>
}

interface SubConfig {
  root_item: {
    completed_notes_count?: number
    [key: string]: any
  }
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

      // 累加笔记数量
      if (subConfig.root_item.completed_notes_count !== undefined) {
        totalCompletedNotes += subConfig.root_item.completed_notes_count
      }

      console.log(
        `✅ [${repoName}] 已收集 (笔记: ${
          subConfig.root_item.completed_notes_count || 0
        })`
      )
      successCount++
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`❌ [${repoName}] 收集失败: ${message}`)
      failCount++
    }
  })

  // 更新统计信息
  rootConfig.statistic = {
    completed_notes_count: totalCompletedNotes,
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
  console.log(`   � 笔记总数: ${totalCompletedNotes}`)
  console.log(`   📁 配置文件: ${ROOT_CONFIG_PATH}`)
}

collectSubRepoConfigs()
