import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 🧩 常量定义 ------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 根知识库标识符
const ROOT_KNOWLEDGE_KEY = '_'

// JSON 输入路径：根知识库配置文件
const JSON_INPUT_PATH = path.resolve(__dirname, '..', '.tnotes.json')

// Markdown 输出路径
const MD_OUTPUT_PATH = path.resolve(__dirname, '..', 'docs', 'src', 'index.md')

// 排序顺序
const FEATURES_DISPLAY_ORDER = [
  ROOT_KNOWLEDGE_KEY,
  'TNotes.template',
  'TNotes.c-cpp',
  'TNotes.canvas',
  'TNotes.change-log',
  'TNotes.cooking',
  'TNotes.egg',
  'TNotes.electron',
  'TNotes.en-notes',
  // 'TNotes.en-words',
  'TNotes.footprints',
  'TNotes.git-notes',
  'TNotes.html-css-js',
  'TNotes.leetcode',
  'TNotes.miniprogram',
  'TNotes.mysql',
  'TNotes.network',
  'TNotes.nodejs',
  'TNotes.notes',
  'TNotes.react',
  'TNotes.svg',
  'TNotes.typescript',
  'TNotes.vite',
  'TNotes.vitepress',
  'TNotes.vue',
  'TNotes.webpack',
  'TNotes.0',
]

// 不需要统计 completed_notes_count 的 key 列表
const IGNORE_NOTE_COUNT_KEYS = ['TNotes.en-words', 'TNotes.0']

// 所有子知识库的配置文件路径
const SUB_KNOWLEDGE_TNOTES_CONFIG_PATHS = FEATURES_DISPLAY_ORDER.map((key) =>
  path.resolve(__dirname, '..', '..', key, '.tnotes.json')
)

const SUB_CONFIG_KEY = 'home.features.item'

// 📁 工具函数 ------------------------------------------------------------------

function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.warn(`⚠️ 无法读取或解析文件: ${filePath}`)
    return null
  }
}

function writeMarkdownFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ Markdown 文件已生成: ${filePath}`)
}

function serialize(obj, indent = 0) {
  let result = ''
  const spaces = '  '.repeat(indent)

  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        result += `${spaces}- ${serialize(item, indent + 1).trimStart()}\n`
      } else {
        result += `${spaces}- ${item}\n`
      }
    })
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      const value = obj[key]
      if (typeof value === 'object' && value !== null) {
        result += `${spaces}${key}:\n`
        result += serialize(value, indent + 1)
      } else {
        result += `${spaces}${key}: ${value}\n`
      }
    }
  }

  return result
}

function calculateTotalNoteCount(features) {
  const entries = Object.entries(features).filter(
    ([key]) =>
      key !== ROOT_KNOWLEDGE_KEY && !IGNORE_NOTE_COUNT_KEYS.includes(key)
  )
  return entries.reduce((sum, [_, feature]) => {
    const count = parseInt(feature.completed_notes_count || '0', 10)
    return sum + count
  }, 0)
}

function sortFeaturesByOrder(features) {
  return FEATURES_DISPLAY_ORDER.map((key) => features[key]).filter(Boolean)
}

function processFeatures(featuresArray) {
  return featuresArray.map((feature) => {
    const newFeature = { ...feature }

    const shouldIgnore = IGNORE_NOTE_COUNT_KEYS.some((key) =>
      feature.title.toLowerCase().includes(key.split('.').pop())
    )

    if (!shouldIgnore && newFeature.completed_notes_count !== undefined) {
      newFeature.title = `${newFeature.title}（${newFeature.completed_notes_count}）`
      delete newFeature.completed_notes_count
    }

    return newFeature
  })
}

// 🔄 主逻辑：加载子知识库配置并合并到根配置中 ------------------------------------------------------------------

function main() {
  // 1️⃣ 读取根知识库配置
  const rootConfig = readJsonFile(JSON_INPUT_PATH)
  const rootFeatures = rootConfig.home.features

  // 2️⃣ 遍历所有子知识库配置文件
  const mergedFeatures = { ...rootFeatures }

  SUB_KNOWLEDGE_TNOTES_CONFIG_PATHS.forEach((configPath) => {
    if (!fs.existsSync(configPath)) {
      console.warn(`⚠️ 配置文件不存在，跳过: ${configPath}`)
      return
    }

    const folderName = path.basename(path.dirname(configPath))
    if (!FEATURES_DISPLAY_ORDER.includes(folderName)) return

    const subConfig = readJsonFile(configPath)
    if (!subConfig[SUB_CONFIG_KEY]) return

    const overrideItem = subConfig[SUB_CONFIG_KEY]
    mergedFeatures[folderName] = {
      ...mergedFeatures[folderName],
      ...overrideItem,
    }
  })

  // 3️⃣ 构建最终数据
  const totalNotes = calculateTotalNoteCount(mergedFeatures)
  mergedFeatures[ROOT_KNOWLEDGE_KEY].completed_notes_count =
    totalNotes.toString()

  const orderedFeatures = sortFeaturesByOrder(mergedFeatures)
  const processedFeatures = processFeatures(orderedFeatures)

  const finalData = {
    layout: rootConfig.home.layout,
    hero: rootConfig.home.hero,
    features: processedFeatures,
  }

  // 4️⃣ 生成 Markdown 文件
  let markdown = '---\n'
  markdown += serialize(finalData)
  markdown = markdown.trimEnd()
  markdown += '\n---'

  writeMarkdownFile(MD_OUTPUT_PATH, markdown)

  // 🔁 将合并后的 features 写回根配置文件
  rootConfig.home.features = mergedFeatures
  fs.writeFileSync(JSON_INPUT_PATH, JSON.stringify(rootConfig, null, 2), 'utf8')
  console.log(`✅ 根知识库配置已更新: ${JSON_INPUT_PATH}`)
}

// ----------------------
// ▶️ 启动脚本
// ----------------------

main()
