import { exec } from "child_process"
import fs from "fs"
import path from "path"
import { __dirname } from "./constants.ts"

// ================================================================
// #region - 常量
// ================================================================

/** GitHub 组织名 */
const GITHUB_ORG = "tnotesjs"

/** GitHub raw 文件 CDN 基础 URL */
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com"

// #endregion

// ================================================================
// #region - 远程文件读取
// ================================================================

/**
 * 从 GitHub raw CDN 获取远程文件内容
 *
 * @param repoName 仓库名称，如 TNotes.leetcode
 * @param filePath 文件路径，如 .tnotes.json 或 sidebar.json
 * @param branch 分支名，默认 main
 * @returns 文件内容字符串，失败返回 null
 */
async function fetchRemoteFile(
  repoName: string,
  filePath: string,
  branch = "main",
): Promise<string | null> {
  const url = `${GITHUB_RAW_BASE}/${GITHUB_ORG}/${repoName}/${branch}/${filePath}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`⚠️  远程文件获取失败: ${url} (${res.status})`)
      return null
    }
    return await res.text()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`⚠️  远程文件获取异常: ${url} — ${message}`)
    return null
  }
}

/**
 * 读取子仓库中的文件内容（本地优先，可选远程回退）
 *
 * @param repoName 仓库名称
 * @param filePath 文件相对路径
 * @param options.forceRemote 强制使用远程读取
 * @returns 文件内容字符串，失败返回 null
 */
async function readRepoFile(
  repoName: string,
  filePath: string,
  options: { forceRemote?: boolean } = {},
): Promise<string | null> {
  const { forceRemote = false } = options

  // 本地读取
  if (!forceRemote) {
    const localPath = path.resolve(__dirname, "..", "..", repoName, filePath)
    if (fs.existsSync(localPath)) {
      try {
        return fs.readFileSync(localPath, "utf8")
      } catch {
        // 本地读取失败，回退到远程
      }
    }
  }

  // 远程读取
  return fetchRemoteFile(repoName, filePath)
}

/**
 * 读取子仓库中的 JSON 文件
 *
 * @param repoName 仓库名称
 * @param filePath JSON 文件相对路径
 * @param options.forceRemote 强制使用远程读取
 * @returns 解析后的 JSON 对象，失败返回 null
 */
async function readRepoJSON<T = any>(
  repoName: string,
  filePath: string,
  options: { forceRemote?: boolean } = {},
): Promise<T | null> {
  const content = await readRepoFile(repoName, filePath, options)
  if (content === null) return null
  try {
    return JSON.parse(content)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`⚠️  JSON 解析失败 [${repoName}/${filePath}]: ${message}`)
    return null
  }
}

// #endregion

// ================================================================
// #region - Shell 命令执行
// ================================================================

/**
 * 执行 shell 命令
 * @param command 要执行的命令
 * @param dir 工作目录
 * @param silent 是否静默执行(不输出错误)
 */
async function runCommand(
  command: string,
  dir: string,
  silent = false,
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: dir }, (error, stdout, stderr) => {
      if (error) {
        if (!silent) {
          console.error(`❌ 命令执行失败: ${command}`)
          console.error(`   错误信息: ${stderr}`)
        }
        reject(error)
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

/**
 * 检查是否是 Git 仓库
 */
async function isGitRepository(dir: string): Promise<boolean> {
  try {
    await runCommand("git rev-parse --is-inside-work-tree", dir, true)
    return true
  } catch {
    return false
  }
}

/**
 * 检查是否有未提交的更改
 */
async function hasUncommittedChanges(dir: string): Promise<boolean> {
  const status = await runCommand("git status --porcelain", dir)
  return status.length > 0
}

/**
 * 检查是否有 stash
 */
async function hasStash(dir: string): Promise<boolean> {
  try {
    const stashList = await runCommand("git stash list", dir, true)
    return stashList.length > 0
  } catch {
    return false
  }
}

/**
 * 同步本地和远程仓库
 *
 * 工作流程:
 * 1. 检查是否是 Git 仓库
 * 2. Stash 本地未提交的更改
 * 3. Pull 远程更新 (使用 rebase)
 * 4. Pop stash 恢复本地更改
 * 5. 如果有新的更改,提交并推送
 *
 * @param dir 仓库目录
 */
async function syncLocalAndRemote(dir: string): Promise<void> {
  const repoName = path.basename(dir)

  try {
    // 1. 验证是否是 Git 仓库
    if (!(await isGitRepository(dir))) {
      console.warn(`⚠️  [${repoName}] 不是 Git 仓库,跳过同步`)
      return
    }

    // 2. 保存本地更改
    let hasStashed = false
    if (await hasUncommittedChanges(dir)) {
      console.log(`💾 [${repoName}] 保存本地更改...`)
      await runCommand('git stash push -u -m "auto-stash before sync"', dir)
      hasStashed = true
    }

    // 3. 拉取远程更新
    try {
      console.log(`⬇️  [${repoName}] 拉取远程更新...`)
      await runCommand("git pull --rebase", dir)
    } catch (error: any) {
      // 如果 pull 失败,尝试恢复 stash
      if (hasStashed) {
        console.log(`🔄 [${repoName}] Pull 失败,恢复本地更改...`)
        try {
          await runCommand("git stash pop", dir)
        } catch {
          console.error(`❌ [${repoName}] 无法恢复 stash,请手动处理`)
        }
      }
      throw error
    }

    // 4. 恢复本地更改
    if (hasStashed) {
      console.log(`📤 [${repoName}] 恢复本地更改...`)
      try {
        await runCommand("git stash pop", dir)
      } catch (error: any) {
        // Stash pop 失败通常是因为冲突
        if (error.message.includes("CONFLICT")) {
          console.error(`⚠️  [${repoName}] 检测到合并冲突,请手动解决`)
          console.error(`   运行: cd ${dir} && git status`)
        }
        throw error
      }
    }

    // 5. 提交并推送新的更改
    if (await hasUncommittedChanges(dir)) {
      console.log(`📝 [${repoName}] 提交更改...`)

      await runCommand("git add .", dir)

      // 获取更改的文件列表
      const status = await runCommand("git status --porcelain", dir)
      const files = status.split("\n").filter((line) => line.trim())
      const changedCount = files.length

      // 生成提交信息
      const timestamp = new Date().toISOString().split("T")[0]
      const commitMsg = `chore: update ${changedCount} file${
        changedCount > 1 ? "s" : ""
      } (${timestamp})`

      await runCommand(`git commit -m "${commitMsg}"`, dir)

      console.log(`⬆️  [${repoName}] 推送到远程...`)
      await runCommand("git push", dir)

      console.log(`✅ [${repoName}] 同步完成`)
    } else {
      console.log(`✅ [${repoName}] 已是最新,无需提交`)
    }
  } catch (error: any) {
    console.error(`❌ [${repoName}] 同步失败: ${error.message}`)

    // 提供恢复建议
    if (await hasStash(dir)) {
      console.log(`💡 提示: 可能有未恢复的 stash,运行以下命令查看:`)
      console.log(`   cd ${dir} && git stash list`)
    }

    throw error
  }
}

/**
 * 同步配置选项
 */
interface SyncOptions {
  /** 是否跳过自动提交 */
  skipCommit?: boolean
  /** 自定义提交信息 */
  commitMessage?: string
  /** 是否静默模式(减少日志输出) */
  silent?: boolean
  /** 是否跳过推送 */
  skipPush?: boolean
}

/**
 * 同步本地和远程仓库(带配置选项)
 */
async function syncLocalAndRemoteWithOptions(
  dir: string,
  options: SyncOptions = {},
): Promise<void> {
  const {
    skipCommit = false,
    commitMessage,
    silent = false,
    skipPush = false,
  } = options
  const repoName = path.basename(dir)

  const log = (msg: string) => {
    if (!silent) console.log(msg)
  }

  try {
    if (!(await isGitRepository(dir))) {
      log(`⚠️  [${repoName}] 不是 Git 仓库,跳过同步`)
      return
    }

    let hasStashed = false
    if (await hasUncommittedChanges(dir)) {
      log(`💾 [${repoName}] 保存本地更改...`)
      await runCommand('git stash push -u -m "auto-stash before sync"', dir)
      hasStashed = true
    }

    try {
      log(`⬇️  [${repoName}] 拉取远程更新...`)
      await runCommand("git pull --rebase", dir)
    } catch (error: unknown) {
      if (hasStashed) {
        log(`🔄 [${repoName}] Pull 失败,恢复本地更改...`)
        try {
          await runCommand("git stash pop", dir)
        } catch {
          console.error(`❌ [${repoName}] 无法恢复 stash,请手动处理`)
        }
      }
      throw error
    }

    if (hasStashed) {
      log(`📤 [${repoName}] 恢复本地更改...`)
      try {
        await runCommand("git stash pop", dir)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        if (message.includes("CONFLICT")) {
          console.error(`⚠️  [${repoName}] 检测到合并冲突,请手动解决`)
          console.error(`   运行: cd ${dir} && git status`)
        }
        throw error
      }
    }

    // 检查是否跳过提交
    if (skipCommit) {
      log(`⏭️  [${repoName}] 跳过自动提交`)
      return
    }

    if (await hasUncommittedChanges(dir)) {
      log(`📝 [${repoName}] 提交更改...`)

      await runCommand("git add .", dir)

      const status = await runCommand("git status --porcelain", dir)
      const files = status.split("\n").filter((line) => line.trim())
      const changedCount = files.length

      const timestamp = new Date().toISOString().split("T")[0]
      const msg =
        commitMessage ||
        `chore: update ${changedCount} file${
          changedCount > 1 ? "s" : ""
        } (${timestamp})`

      await runCommand(`git commit -m "${msg}"`, dir)

      if (!skipPush) {
        log(`⬆️  [${repoName}] 推送到远程...`)
        await runCommand("git push", dir)
      }

      log(`✅ [${repoName}] 同步完成`)
    } else {
      log(`✅ [${repoName}] 已是最新,无需提交`)
    }
  } catch (error: any) {
    console.error(`❌ [${repoName}] 同步失败: ${error.message}`)

    if (await hasStash(dir)) {
      console.log(`💡 提示: 可能有未恢复的 stash,运行以下命令查看:`)
      console.log(`   cd ${dir} && git stash list`)
    }

    throw error
  }
}

export {
  fetchRemoteFile,
  readRepoFile,
  readRepoJSON,
  syncLocalAndRemote,
  syncLocalAndRemoteWithOptions,
  type SyncOptions,
}
