import fs from "fs"
import path from "path"
import minimist from "minimist"
import { __dirname, ROOT_CONFIG_PATH } from "./constants.ts"
import { readRepoJSON } from "./utils.ts"

/**
 * 侧边栏项接口
 */
interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

interface RootConfig {
  sub_knowledge_list: string[]
}

/**
 * 读取本地 JSON 文件
 */
const readLocalJSON = <T = any>(filePath: string): T | null => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`❌ 读取文件失败: ${filePath}`)
    console.error(`   错误: ${message}`)
    return null
  }
}

/**
 * 转换侧边栏链接
 * 将相对路径转换为完整 URL
 *
 * @param items 侧边栏项数组
 * @param repoName 仓库名称
 * @returns 转换后的侧边栏项数组
 */
function transformSidebarLinks(
  items: SidebarItem[],
  repoName: string,
): SidebarItem[] {
  return items.map((item) => {
    const newItem: SidebarItem = { ...item }

    // 如果有 link 且是相对路径,转换为完整 URL
    if (newItem.link && newItem.link.startsWith("/")) {
      newItem.link = `https://tnotesjs.github.io/${repoName}${newItem.link}`
    }

    // 递归处理子项
    if (newItem.items) {
      newItem.items = transformSidebarLinks(newItem.items, repoName)
    }

    return newItem
  })
}

/**
 * 收集所有子知识库的侧边栏配置
 *
 * @param options.remote 是否强制远程读取
 * @param options.repo 仅收集指定仓库（增量模式）
 */
async function collectSidebars(
  options: { remote?: boolean; repo?: string } = {},
): Promise<void> {
  const { remote = false, repo } = options

  console.log("📚 开始收集侧边栏配置...\n")
  if (remote) console.log("🌐 使用远程模式读取\n")
  if (repo) console.log(`🎯 增量模式：仅收集 ${repo}\n`)

  // 读取根配置
  const rootConfig = readLocalJSON<RootConfig>(ROOT_CONFIG_PATH)
  if (!rootConfig || !rootConfig.sub_knowledge_list) {
    console.error("❌ 无法读取根配置或子知识库列表为空")
    return
  }

  const sidebarsDir = path.resolve(__dirname, "..", "sidebars")

  // 确保 sidebars 目录存在
  if (!fs.existsSync(sidebarsDir)) {
    fs.mkdirSync(sidebarsDir, { recursive: true })
  }

  // 确定要处理的仓库列表
  const repoList = repo
    ? [repo].filter((r) => rootConfig.sub_knowledge_list.includes(r))
    : rootConfig.sub_knowledge_list

  if (repo && repoList.length === 0) {
    console.error(`❌ ${repo} 不在 sub_knowledge_list 中`)
    process.exit(1)
  }

  let successCount = 0
  let failCount = 0

  // 遍历子知识库
  for (const repoName of repoList) {
    const targetDir = path.join(sidebarsDir, repoName)
    const targetSidebarPath = path.join(targetDir, "sidebar.json")

    try {
      // 通过 readRepoJSON 读取（本地优先或远程）
      const sidebarData = await readRepoJSON<SidebarItem[]>(
        repoName,
        "sidebar.json",
        { forceRemote: remote },
      )

      if (!sidebarData) {
        console.warn(`⚠️  [${repoName}] 侧边栏配置不存在或读取失败`)
        failCount++
        continue
      }

      // 转换链接
      const transformedData = transformSidebarLinks(sidebarData, repoName)

      // 确保目标目录存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // 写入转换后的配置（紧凑格式，减小文件体积）
      fs.writeFileSync(
        targetSidebarPath,
        JSON.stringify(transformedData),
        "utf8",
      )

      console.log(`✅ [${repoName}] 侧边栏已收集`)
      successCount++
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`❌ [${repoName}] 处理失败: ${message}`)
      failCount++
    }
  }

  console.log("\n📊 收集完成统计:")
  console.log(`   ✅ 成功: ${successCount}`)
  console.log(`   ❌ 失败: ${failCount}`)
  console.log(`   📁 输出目录: ${sidebarsDir}`)
}

// CLI 入口
const args = minimist(process.argv.slice(2))
collectSidebars({
  remote: !!args.remote,
  repo: args.repo || undefined,
}).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error("❌ 收集侧边栏失败:", message)
  process.exit(1)
})
