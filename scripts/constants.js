import { fileURLToPath } from "url"
import path from "path"

export const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const EOL = '\n'
export const MERGED_README_FILENAME = 'MERGED_README.md'
export const SEPERATOR = `<!-- !======> SEPERATOR <====== -->`