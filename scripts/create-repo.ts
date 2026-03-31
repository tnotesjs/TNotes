/**
 * create-repo.ts
 *
 * 创建新的 TNotes.xxx 知识库
 *
 * 用法：
 *   pnpm tn:create-repo --name markdown
 *   pnpm tn:create-repo              # 交互式输入
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { createInterface } from 'readline'
import { randomUUID } from 'crypto'
import minimist from 'minimist'
import { __dirname, ROOT_CONFIG_PATH } from './constants'

// ================================================================
// #region - 常量
// ================================================================

/** 出生日期（用于计算 days_since_birth），1999-06-29 作为第 1 天 */
const BIRTH_DATE = new Date('1999-06-29T00:00:00+08:00').getTime()

/** 一天的毫秒数 */
const MS_PER_DAY = 1000 * 60 * 60 * 24

/** 所有知识库的上级目录 */
const REPOS_ROOT = path.resolve(__dirname, '..', '..')

/** 模板来源仓库（使用 TNotes.c 作为模板基准） */
const TEMPLATE_REPO = path.join(REPOS_ROOT, 'TNotes.c')

// #endregion

// ================================================================
// #region - 工具函数
// ================================================================

/**
 * 计算距离 1999-06-29 的天数 +1
 */
function getDaysSinceBirth(timestamp: number = Date.now()): number {
  return Math.floor((timestamp - BIRTH_DATE) / MS_PER_DAY) + 1
}

/**
 * 交互式读取用户输入
 */
function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

/**
 * 执行 shell 命令
 */
function run(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, encoding: 'utf-8', stdio: 'pipe' }).trim()
}

/**
 * 复制文件（自动创建目标目录）
 */
function copyFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

/**
 * 写入文本文件（UTF-8 无 BOM）
 */
function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
}

/**
 * 读取 JSON 文件（支持 JSONC 格式）
 */
function readJSON(filePath: string): any {
  const raw = fs.readFileSync(filePath, 'utf-8')
  // 移除 JSONC 注释（仅移除行首或行首空白后的 // 注释，避免误伤 URL 中的 //）
  const cleaned = raw
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
  return JSON.parse(cleaned)
}

/**
 * 写入 JSON 文件（无 BOM）
 */
function writeJSON(filePath: string, data: any): void {
  writeFile(filePath, JSON.stringify(data, null, 2) + '\n')
}

// #endregion

// ================================================================
// #region - 模板生成
// ================================================================

/** socialLinks 中的语雀 SVG 图标 */
const YUQUE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.28 2.955c2.97.203 3.756 2.342 3.84 2.597l1.297.096c.13 0 .169.18.054.236c-1.323.716-1.727 2.17-1.49 3.118c.09.358.254.69.412 1.02c.307.642.651 1.418.707 2.981c.117 3.24-2.51 6.175-5.789 6.593c1.17-1.187 1.815-2.444 2.12-3.375c.606-1.846.508-3.316.055-4.44a4.46 4.46 0 0 0-1.782-2.141c-1.683-1.02-3.22-1.09-4.444-.762c.465-.594.876-1.201 1.2-1.864c.584-1.65-.102-2.848-.704-3.519c-.192-.246-.061-.655.305-.655c1.41 0 2.813.02 4.22.115M3.32 19.107c1.924-2.202 4.712-5.394 7.162-8.15c.559-.63 2.769-2.338 5.748-.533c.878.532 2.43 2.165 1.332 5.51c-.803 2.446-4.408 7.796-15.76 5.844c-.227-.039-.511-.354-.218-.687z"/></svg>`

/** socialLinks 中的 B 站 SVG 图标 */
const BILIBILI_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><g fill="currentColor"><path d="M310.134 596.45c-7.999-4.463-16.498-8.43-24.997-11.9a274 274 0 0 0-26.996-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c.999.992 1.999 1.488 2.999.496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c1.5-1.487 0-2.479.5-2.975m323.96-11.9a274 274 0 0 0-26.997-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c1 .992 2 1.488 3 .496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c2-1.487.5-2.479.5-2.975c-7.5-4.463-16.498-8.43-24.997-11.9"/><path d="M741.496 112H283c-94.501 0-171 76.5-171 171.5v458c.5 94 77 170.5 170.999 170.5h457.997c94.5 0 171.002-76.5 171.002-170.5v-458c.497-95-76.002-171.5-170.502-171.5m95 343.5h15.5v48h-15.5zm-95.5-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 1.5l-6.5-47.5h17zm-230.498 1.5h15v48h-15zm-96-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 2l-6-47.5zm-3.5 149C343.498 668.5 216 662.5 204.5 660.5C195.5 499 181.5 464 170 385l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 47c.5 3 0 6-1.5 8.5m20.5 35.5l-23.5-124h35.5l13 123zm44.5-8l-27-235l33.5-1.5l21 236H429zm34-175h17.5v48H467zm41 190h-26.5l-9.5-126h36zm209.998-43C693.496 668 565.997 662 554.497 660c-9-161-23-196-34.5-275l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 46.5c.5 3 0 6-1.5 8.5m19.5 36l-23-124h35.5l13 123zm45.5-8l-27.5-235l33.5-1.5l21 236h-27zm33.5-175h17.5v48h-13zm41 190h-26.5l-9.5-126h36z"/></g></svg>`

/**
 * 生成 .tnotes.json 配置
 */
function generateTnotesConfig(name: string): object {
  const repoName = `TNotes.${name}`
  const now = Date.now()
  const daysSinceBirth = getDaysSinceBirth(now)
  const nowDate = new Date(now)
  const ymKey = `${String(nowDate.getFullYear()).slice(2)}.${String(nowDate.getMonth() + 1).padStart(2, '0')}`

  return {
    author: 'tnotesjs',
    repoName,
    keywords: [repoName],
    ignore_dirs: [
      '.vscode',
      '0000',
      'assets',
      'node_modules',
      'hidden',
      'assets',
    ],
    rootSidebarDir: '../TNotes/sidebars',
    root_item: {
      icon: {
        src: `https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/assets/icon--${name}.svg`,
      },
      title: name,
      completed_notes_count: {
        [ymKey]: 0,
      },
      details: `${name} 笔记`,
      link: `https://tnotesjs.github.io/${repoName}/`,
      created_at: now,
      updated_at: now,
      days_since_birth: daysSinceBirth,
    },
    port: daysSinceBirth,
    menuItems: [
      { text: '🏠 Home', link: '/' },
      { text: '⚙️ Settings', link: '/Settings' },
      { text: '📒 TNotes', link: 'https://tnotesjs.github.io/TNotes' },
      {
        text: '📂 TNotes.yuque',
        link: 'https://www.yuque.com/tdahuyou/tnotes.yuque',
      },
    ],
    socialLinks: [
      {
        ariaLabel: 'Tdahuyou 语雀主页链接',
        link: 'https://www.yuque.com/tdahuyou',
        icon: { svg: YUQUE_SVG },
      },
      {
        ariaLabel: 'Tdahuyou B 站主页链接',
        link: 'https://space.bilibili.com/407241004',
        icon: { svg: BILIBILI_SVG },
      },
      {
        ariaLabel: `${repoName} github 仓库链接`,
        link: `https://github.com/tnotesjs/${repoName}`,
        icon: 'github',
      },
    ],
    id: randomUUID(),
    sidebarShowNoteId: true,
  }
}

/**
 * 生成 index.md
 */
function generateIndexMd(name: string): string {
  return `---
layout: home

hero:
  name: '${name} 笔记'
  image:
    src: /logo.png
    alt: TNotes logo
---

<SidebarCard />
`
}

/**
 * 生成 README.md
 */
function generateReadmeMd(name: string): string {
  return `# ${name}

<!-- region:toc -->

<!-- endregion:toc -->
`
}

// #endregion

// ================================================================
// #region - 主流程
// ================================================================

async function main() {
  const args = minimist(process.argv.slice(2))

  // 1. 获取仓库名
  let name: string = args.name || args.n || ''
  if (!name) {
    name = await prompt('请输入知识库名称（如 markdown）：')
  }

  // 2. 校验
  if (!name) {
    console.error('❌ 知识库名称不能为空')
    process.exit(1)
  }
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error('❌ 知识库名称只能包含小写字母、数字和连字符，且以字母开头')
    process.exit(1)
  }

  const repoName = `TNotes.${name}`
  const repoDir = path.join(REPOS_ROOT, repoName)

  if (fs.existsSync(repoDir)) {
    console.error(`❌ 目录已存在：${repoDir}`)
    process.exit(1)
  }

  if (!fs.existsSync(TEMPLATE_REPO)) {
    console.error(`❌ 模板仓库不存在：${TEMPLATE_REPO}`)
    process.exit(1)
  }

  const now = Date.now()
  const daysSinceBirth = getDaysSinceBirth(now)

  console.log('')
  console.log(`📦 正在创建知识库：${repoName}`)
  console.log(`📁 目录：${repoDir}`)
  console.log(`🔢 端口号：${daysSinceBirth}`)
  console.log('')

  // 3. 创建目录
  fs.mkdirSync(repoDir, { recursive: true })

  // 4. 复制固定模板文件
  console.log('📋 复制模板文件...')

  const fixedFiles = [
    '.gitattributes',
    '.gitignore',
    'tsconfig.json',
    'Loading.md',
    'Settings.md',
    '.vitepress/config.mts',
    '.vitepress/theme/index.ts',
    '.vitepress/env.d.ts',
    '.github/workflows/deploy.yml',
    '.vscode/tasks.json',
    '.vscode/settings.json',
    'public/favicon.ico',
    'public/logo.png',
  ]

  for (const file of fixedFiles) {
    const src = path.join(TEMPLATE_REPO, file)
    const dest = path.join(repoDir, file)
    if (fs.existsSync(src)) {
      copyFile(src, dest)
    } else {
      console.warn(`  ⚠️  模板文件不存在，跳过：${file}`)
    }
  }

  // 5. 生成定制文件
  console.log('✏️  生成配置文件...')

  // .tnotes.json
  writeJSON(path.join(repoDir, '.tnotes.json'), generateTnotesConfig(name))

  // package.json（从模板复制内容一致的 package.json）
  const templatePkg = readJSON(path.join(TEMPLATE_REPO, 'package.json'))
  writeJSON(path.join(repoDir, 'package.json'), templatePkg)

  // index.md
  writeFile(path.join(repoDir, 'index.md'), generateIndexMd(name))

  // README.md
  writeFile(path.join(repoDir, 'README.md'), generateReadmeMd(name))

  // References.md
  writeFile(path.join(repoDir, 'References.md'), '')

  // Words.md
  writeFile(
    path.join(repoDir, 'Words.md'),
    `<E
  needSort
  :words="[
    'vocabulary',
]" />
`,
  )

  // sidebar.json
  writeFile(path.join(repoDir, 'sidebar.json'), '[]\n')

  // notes/ 目录
  writeFile(path.join(repoDir, 'notes', '.gitkeep'), '')

  // 6. 初始化 git 仓库
  console.log('🔧 初始化 Git 仓库...')
  run('git init -b main', repoDir)

  // 安装依赖
  console.log('📥 安装 NPM 依赖...')
  run('pnpm install', repoDir)

  // 首次提交
  console.log('💾 创建首次提交...')
  run('git add .', repoDir)
  run(`git commit -m "chore: init ${repoName}"`, repoDir)

  // 7. 注册到根仓库
  console.log('📝 注册到根仓库...')
  const rootConfig = readJSON(ROOT_CONFIG_PATH)
  const list: string[] = rootConfig.sub_knowledge_list || []

  if (!list.includes(repoName)) {
    list.push(repoName)
    list.sort((a: string, b: string) => {
      // TNotes.introduction 始终排第一
      if (a === 'TNotes.introduction') return -1
      if (b === 'TNotes.introduction') return 1
      return a.localeCompare(b)
    })
    rootConfig.sub_knowledge_list = list
    writeJSON(ROOT_CONFIG_PATH, rootConfig)
    console.log(`  ✅ 已添加 ${repoName} 到 sub_knowledge_list`)
  } else {
    console.log(`  ℹ️  ${repoName} 已在 sub_knowledge_list 中`)
  }

  // 8. 完成提示
  console.log('')
  console.log('═'.repeat(60))
  console.log(`✅ ${repoName} 创建成功！`)
  console.log('═'.repeat(60))
  console.log('')
  console.log('后续步骤：')
  console.log('')
  console.log(`  1. 在 GitHub tnotesjs 组织中创建仓库 ${repoName}`)
  console.log(`     https://github.com/organizations/tnotesjs/repositories/new`)
  console.log('')
  console.log(`  2. 关联远程仓库并推送：`)
  console.log(`     cd ${repoDir}`)
  console.log(
    `     git remote add origin https://github.com/tnotesjs/${repoName}.git`,
  )
  console.log(`     git push -u origin main`)
  console.log('')
  console.log(`  3. 安装依赖并启动：`)
  console.log(`     cd ${repoDir}`)
  console.log(`     pnpm install`)
  console.log(`     pnpm tn:dev`)
  console.log('')
  console.log(`  4. （可选）为知识库创建专属图标：`)
  console.log(
    `     上传 icon--${name}.svg 到 tnotesjs/imgs 仓库的 assets/ 目录`,
  )
  console.log('')
}

main().catch((err) => {
  console.error('❌ 创建失败：', err.message || err)
  process.exit(1)
})

// #endregion
