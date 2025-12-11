/**
 * generate-changelog.ts
 *
 * 生成月度更新日志
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { __dirname, ROOT_CONFIG_PATH } from './constants.ts'

interface RootConfig {
  sub_knowledge_list: string[]
}

interface Note {
  number: string // 编号，如 "0001"
  title: string // 标题
  link: string // GitHub 链接
  isCompleted: boolean // 是否完成
}

interface RepoChangelog {
  repoName: string
  repoUrl: string
  newNotes: Note[]
}

/**
 * 获取指定月份的时间范围
 * @param year 年份，如 2025 或 25
 * @param month 月份，如 1 或 12
 * @returns { start: Date, end: Date }
 */
function getMonthRange(
  year: string,
  month: string
): { start: Date; end: Date } {
  // 标准化年份为完整格式
  const fullYear = year.length === 2 ? `20${year}` : year
  const monthNum = parseInt(month, 10)

  const start = new Date(`${fullYear}-${month.padStart(2, '0')}-01T00:00:00`)
  const end = new Date(parseInt(fullYear), monthNum, 0, 23, 59, 59, 999) // 当月最后一天

  return { start, end }
}

/**
 * 格式化月份键
 * @param year 年份
 * @param month 月份
 * @returns YY.MM 格式字符串
 */
function formatMonthKey(year: string, month: string): string {
  const shortYear = year.length === 2 ? year : year.slice(-2)
  return `${shortYear}.${month.padStart(2, '0')}`
}

/**
 * 获取上个月的年份和月份
 */
function getPreviousMonth(
  year: string,
  month: string
): { year: string; month: string } {
  const fullYear = year.length === 2 ? `20${year}` : year
  const monthNum = parseInt(month, 10)

  if (monthNum === 1) {
    return {
      year: (parseInt(fullYear) - 1).toString().slice(-2),
      month: '12',
    }
  }

  return {
    year: year,
    month: (monthNum - 1).toString(),
  }
}

/**
 * 查找指定月份的最后一次提交
 * @param repoPath 仓库路径
 * @param start 月份开始时间
 * @param end 月份结束时间
 * @returns 提交 hash，如果没有返回 null
 */
function getLastCommitInMonth(
  repoPath: string,
  start: Date,
  end: Date
): string | null {
  try {
    const startStr = start.toISOString()
    const endStr = end.toISOString()

    const result = execSync(
      `git log --after="${startStr}" --before="${endStr}" --format=%H -n 1`,
      {
        cwd: repoPath,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    ).trim()

    return result || null
  } catch (error) {
    return null
  }
}

/**
 * 获取特定提交的文件内容
 * @param repoPath 仓库路径
 * @param commitHash 提交 hash
 * @param filePath 文件路径（相对于仓库根目录）
 * @returns 文件内容，如果不存在返回 null
 */
function getFileContentAtCommit(
  repoPath: string,
  commitHash: string,
  filePath: string
): string | null {
  try {
    const content = execSync(`git show ${commitHash}:${filePath}`, {
      cwd: repoPath,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    return content
  } catch (error) {
    return null
  }
}

/**
 * 解析 README.md 中的笔记列表
 * @param content README.md 内容
 * @returns 笔记数组
 */
function parseNotes(content: string): Note[] {
  const notes: Note[] = []

  // 匹配格式：- [x] [0001. 标题](链接) 或 - [ ] [0001. 标题](链接)
  const regex = /^- \[([ x])\] \[(\d+)\.\s+([^\]]+)\]\(([^)]+)\)/gm

  let match
  while ((match = regex.exec(content)) !== null) {
    notes.push({
      number: match[2],
      title: match[3],
      link: '', // 链接将在生成 changelog 时构建
      isCompleted: match[1] === 'x',
    })
  }

  return notes
}

/**
 * 对比两个月份的笔记，找出新完成的笔记
 * @param currentNotes 当前月份的笔记
 * @param previousNotes 上个月的笔记
 * @returns 新完成的笔记数组
 */
function compareMonths(currentNotes: Note[], previousNotes: Note[]): Note[] {
  const newCompletedNotes: Note[] = []

  // 构建上个月笔记的映射表
  const prevMap = new Map<string, Note>()
  previousNotes.forEach((note) => {
    prevMap.set(note.number, note)
  })

  // 查找新完成的笔记
  currentNotes.forEach((currentNote) => {
    if (!currentNote.isCompleted) {
      return // 当前未完成，跳过
    }

    const prevNote = prevMap.get(currentNote.number)

    // 新增笔记 或 状态从未完成变为完成
    if (!prevNote || !prevNote.isCompleted) {
      newCompletedNotes.push(currentNote)
    }
  })

  return newCompletedNotes
}

/**
 * 生成单个仓库的更新日志
 */
function generateRepoChangelog(
  repoName: string,
  repoPath: string,
  currentYear: string,
  currentMonth: string
): RepoChangelog | null {
  try {
    // 检查是否为首月（25.01）
    const isFirstMonth = currentYear === '25' && currentMonth === '1'

    // 1. 获取当前月份和上个月的时间范围
    const currentRange = getMonthRange(currentYear, currentMonth)

    // 2. 查找当前月份的最后一次提交
    const currentCommit = getLastCommitInMonth(
      repoPath,
      currentRange.start,
      currentRange.end
    )

    if (!currentCommit) {
      // 当前月份没有提交，跳过
      return null
    }

    // 3. 获取 README.md 内容
    const currentContent = getFileContentAtCommit(
      repoPath,
      currentCommit,
      'README.md'
    )

    if (!currentContent) {
      return null
    }

    // 4. 解析当前月份的笔记
    const currentNotes = parseNotes(currentContent)
    let newNotes: Note[]

    if (isFirstMonth) {
      // 首月特殊处理：所有已完成的笔记都算作新增
      newNotes = currentNotes.filter((note) => note.isCompleted)
    } else {
      // 非首月：对比上个月的变化
      const { year: prevYear, month: prevMonth } = getPreviousMonth(
        currentYear,
        currentMonth
      )
      const prevRange = getMonthRange(prevYear, prevMonth)

      const prevCommit = getLastCommitInMonth(
        repoPath,
        prevRange.start,
        prevRange.end
      )

      const prevContent = prevCommit
        ? getFileContentAtCommit(repoPath, prevCommit, 'README.md')
        : null

      const previousNotes = prevContent ? parseNotes(prevContent) : []

      // 5. 对比找出新完成的笔记
      newNotes = compareMonths(currentNotes, previousNotes)
    }

    if (newNotes.length === 0) {
      return null
    }

    // 6. 按编号排序
    newNotes.sort((a, b) => parseInt(a.number) - parseInt(b.number))

    return {
      repoName,
      repoUrl: `https://github.com/tnotesjs/${repoName}`,
      newNotes,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`❌ [${repoName}] 处理失败: ${message}`)
    return null
  }
}

/**
 * 生成完整的月度更新日志
 */
function generateChangelog(year: string, month: string): void {
  console.log(`\n🚀 开始生成 ${formatMonthKey(year, month)} 更新日志\n`)

  // 1. 读取根配置
  const rootConfig: RootConfig = JSON.parse(
    fs.readFileSync(ROOT_CONFIG_PATH, 'utf8')
  )

  // 2. 收集所有仓库的更新日志
  const changelogs: RepoChangelog[] = []
  let processedCount = 0

  rootConfig.sub_knowledge_list.forEach((repoName) => {
    const repoPath = path.resolve(__dirname, '..', '..', repoName)

    // 检查目录是否存在
    if (!fs.existsSync(repoPath)) {
      console.warn(`⚠️  [${repoName}] 目录不存在，跳过`)
      return
    }

    // 检查是否为 git 仓库
    const gitPath = path.join(repoPath, '.git')
    if (!fs.existsSync(gitPath)) {
      console.warn(`⚠️  [${repoName}] 不是 git 仓库，跳过`)
      return
    }

    processedCount++
    const changelog = generateRepoChangelog(repoName, repoPath, year, month)

    if (changelog) {
      changelogs.push(changelog)
      console.log(`✅ [${repoName}] 新增 ${changelog.newNotes.length} 篇笔记`)
    } else {
      console.log(`   [${repoName}] 无新增笔记`)
    }
  })

  // 3. 按仓库名字母排序
  changelogs.sort((a, b) => a.repoName.localeCompare(b.repoName))

  // 4. 生成 Markdown 内容
  const monthKey = formatMonthKey(year, month)
  let markdown = `# ${monthKey}\n\n`

  changelogs.forEach(({ repoName, repoUrl, newNotes }, repoIndex) => {
    // 标题加上总计数量
    markdown += `## [${repoName}](${repoUrl}) +${newNotes.length}\n\n`

    // 添加表格头
    markdown += `| Index | Title | GitHub | GitHub Pages |\n`
    markdown += `| --- | --- | --- | --- |\n`

    newNotes.forEach((note, index) => {
      // 构建链接：notes/编号. 标题/README.md
      const notePath = `notes/${note.number}. ${note.title}`
      const encodedNotePath = encodeURIComponent(notePath)

      // GitHub 链接
      const githubLink = `https://github.com/tnotesjs/${repoName}/tree/main/${encodedNotePath}/README.md`

      // GitHub Pages 链接
      const githubPagesLink = `https://tnotesjs.github.io/${repoName}/${encodedNotePath}/README`

      markdown += `| ${index + 1} | ${note.number}. ${
        note.title
      } | [link](${githubLink}) | [link](${githubPagesLink}) |\n`
    })

    // 只在不是最后一个仓库时添加空行
    if (repoIndex < changelogs.length - 1) {
      markdown += '\n'
    }
  })

  // 5. 写入文件
  const changelogDir = path.resolve(__dirname, '..', 'changelogs')
  if (!fs.existsSync(changelogDir)) {
    fs.mkdirSync(changelogDir, { recursive: true })
  }

  const outputPath = path.join(changelogDir, `${monthKey}.md`)
  fs.writeFileSync(outputPath, markdown, 'utf8')

  // 6. 输出统计
  console.log('\n📊 生成完成统计:')
  console.log(`   处理仓库: ${processedCount}`)
  console.log(`   有更新: ${changelogs.length}`)
  console.log(
    `   总计新增: ${changelogs.reduce(
      (sum, c) => sum + c.newNotes.length,
      0
    )} 篇笔记`
  )
  console.log(`   输出文件: ${outputPath}`)
  console.log('\n🎉 done ～')
}

/**
 * 交互式命令行界面
 */
async function interactiveMode(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve)
    })
  }

  try {
    console.log('\n📝 月度更新日志生成工具\n')
    console.log('请选择日志生成范围：')
    console.log('  1. 本月更新日志')
    console.log('  2. 上个月更新日志')
    console.log('  3. 所有月份更新日志')
    console.log('  4. 指定年份和月份\n')

    const choice = await question('请输入选项（1-4）：')

    const now = new Date()
    const currentYear = now.getFullYear().toString().slice(-2)
    const currentMonth = (now.getMonth() + 1).toString()

    let year: string
    let month: string

    switch (choice.trim()) {
      case '1':
        // 本月
        year = currentYear
        month = currentMonth
        generateChangelog(year, month)
        break

      case '2':
        // 上个月
        const prev = getPreviousMonth(currentYear, currentMonth)
        year = prev.year
        month = prev.month
        generateChangelog(year, month)
        break

      case '3':
        /**
         * !repo - 创建时间背景说明
         * TNotes 诞生时间：24.08.28
         *
         * 知识库的创建时间：
         *
         * 1. TNotes.electron - 2024 年 9 月 14 日 16:59:17
         * 2. TNotes.typescript - 2024 年 9 月 23 日
         * 3. TNotes.vite - 2024 年 9 月 23 日
         * 4. TNotes.vue - 2024 年 9 月 23 日
         * 5. TNotes.webpack - 2024 年 9 月 24 日
         * 6. 其他知识库都是 2025 年创建的
         *
         * 将 24 年到 25.01 之间的所有日志都视作 25.01 来处理
         */
        console.log('\n⚠️  将生成从 2025.01 至今的所有月份日志\n')
        const startYear = 25
        const startMonth = 1
        const endYear = parseInt(currentYear)
        const endMonth = parseInt(currentMonth)

        for (let y = startYear; y <= endYear; y++) {
          const mStart = y === startYear ? startMonth : 1
          const mEnd = y === endYear ? endMonth : 12

          for (let m = mStart; m <= mEnd; m++) {
            generateChangelog(y.toString(), m.toString())
          }
        }
        break

      case '4':
        // 指定月份
        const inputYear = await question(
          '\n请输入年份（示例 2025、25 表示 2025 年）：'
        )
        const inputMonth = await question(
          '请输入月份（示例 01、12 表示 1 月、12 月）：'
        )

        year = inputYear.trim()
        month = inputMonth.trim()

        if (!year || !month) {
          console.error('❌ 年份和月份不能为空')
          break
        }

        // 验证月份范围
        const minYear = 25
        const minMonth = 1
        const maxYear = parseInt(currentYear)
        const maxMonth = parseInt(currentMonth)

        const inputYearNum = parseInt(year.length === 2 ? year : year.slice(-2))
        const inputMonthNum = parseInt(month)

        // 检查是否小于最小值 (25.01)
        if (
          inputYearNum < minYear ||
          (inputYearNum === minYear && inputMonthNum < minMonth)
        ) {
          console.error(`❌ 输入的月份早于最早日志时间`)
          console.error(`   最早的日志从 25.01 开始，请输入 25.01 或之后的月份`)
          break
        }

        // 检查是否大于当前月份
        if (
          inputYearNum > maxYear ||
          (inputYearNum === maxYear && inputMonthNum > maxMonth)
        ) {
          console.error(`❌ 输入的月份超过当前时间`)
          console.error(
            `   当前时间是 ${formatMonthKey(
              currentYear,
              currentMonth
            )}，请输入不晚于当前月份的时间`
          )
          break
        }

        generateChangelog(year, month)
        break

      default:
        console.error('❌ 无效的选项')
        break
    }
  } finally {
    rl.close()
  }
}

// 执行交互式命令行
interactiveMode().catch((error) => {
  console.error('❌ 执行失败:', error)
  process.exit(1)
})
