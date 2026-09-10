import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'

export function hashBytes(data: Uint8Array | string): string {
  return createHash('sha256').update(data).digest('hex')
}

export async function hashFile(filePath: string): Promise<string> {
  const hash = createHash('sha256')
  await pipeline(createReadStream(filePath), hash)
  return hash.digest('hex')
}

export async function writeFileStreaming(filePath: string, data: Uint8Array): Promise<string> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const digest = hashBytes(data)
  const staged = `${filePath}.${process.pid}.${Date.now()}.tmp`
  await fs.writeFile(staged, data)
  try {
    const verified = await hashFile(staged)
    if (verified !== digest) {
      throw new Error(`写入校验失败: ${filePath}`)
    }
    await fs.rename(staged, filePath)
    return digest
  } catch (error) {
    await fs.rm(staged, { force: true })
    throw error
  }
}

/** Copy across devices, then verify the destination hash. Does not delete the source. */
export async function copyFileStreaming(fromPath: string, toPath: string): Promise<string> {
  await fs.mkdir(path.dirname(toPath), { recursive: true })
  const hash = createHash('sha256')
  try {
    await pipeline(
      createReadStream(fromPath),
      async function* (source) {
        for await (const chunk of source) {
          hash.update(chunk)
          yield chunk
        }
      },
      createWriteStream(toPath)
    )
    const digest = hash.digest('hex')
    const verified = await hashFile(toPath)
    if (verified !== digest) {
      throw new Error(`复制校验失败: ${fromPath}`)
    }
    return digest
  } catch (error) {
    await fs.rm(toPath, { force: true })
    throw error
  }
}
