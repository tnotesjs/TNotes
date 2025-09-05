import path from 'path'
import { fileURLToPath } from 'url'

/**
 * 当前 core/xxx.js 文件所在位置
 */
export const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 根知识库配置文件 .tnotes.json 所在位置
 */
export const ROOT_CONFIG_PATH = path.resolve(__dirname, '..', '.tnotes.json')

export const EOL = '\n'
export const MERGED_README_FILENAME = 'MERGED_README.md'
export const SEPERATOR = `<!-- !======> SEPERATOR <====== -->`
