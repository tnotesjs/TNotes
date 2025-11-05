import fs from 'fs'
import path from 'path'
import { __dirname, ROOT_CONFIG_PATH } from './constants.ts'

const readJSON = (filePath: string): any =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'))

const rootConfig = readJSON(ROOT_CONFIG_PATH)

let totalCompletedNotes: number = 0

rootConfig.sub_knowledge_list
  .map((key: string) =>
    path.resolve(__dirname, '..', '..', key, '.tnotes.json')
  )
  .forEach((configPath: string) => {
    if (!fs.existsSync(configPath)) {
      console.warn(`⚠️ 配置文件不存在，跳过: ${configPath}`)
      return
    }

    const subConfig = readJSON(configPath)
    if (!subConfig.root_item) return

    const folderName = path.basename(path.dirname(configPath))

    rootConfig.root_items[folderName] = {
      ...rootConfig.root_items[folderName],
      ...subConfig.root_item,
    }

    // 累加已完成笔记数量
    if (subConfig.root_item.completed_notes_count !== undefined) {
      totalCompletedNotes += subConfig.root_item.completed_notes_count
    }
  })

rootConfig.statistic = {
  completed_notes_count: totalCompletedNotes,
}

fs.writeFileSync(ROOT_CONFIG_PATH, JSON.stringify(rootConfig, null, 2), 'utf8')
console.log(`✅ 根知识库配置已更新: ${ROOT_CONFIG_PATH}`)
console.log(`📊 已完成笔记总数: ${totalCompletedNotes}`)
