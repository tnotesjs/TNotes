import { describe, expect, it } from 'vitest'
import sharp from 'sharp'

import { EncodeManager } from './encodeManager'

async function samplePng(): Promise<Uint8Array> {
  return new Uint8Array(
    await sharp({
      create: { width: 32, height: 32, channels: 3, background: { r: 18, g: 52, b: 86 } }
    })
      .png()
      .toBuffer()
  )
}

describe('EncodeManager', () => {
  // Under vitest there is no built `encodeWorker.js` next to this file, so the
  // worker cannot boot. The manager must not strand the caller: it has to fall
  // back in-process and still resolve.
  it('resolves a request even when the worker cannot boot', async () => {
    const manager = new EncodeManager()
    const data = await samplePng()
    const result = await manager.encode(data, 'in.png', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'webp'
    })
    expect(result.skipped).toBeUndefined()
    expect(result.outputExt).toBe('.webp')
    await manager.dispose()
  })

  it('settles in-flight work after dispose instead of hanging', async () => {
    const manager = new EncodeManager()
    const data = await samplePng()
    const pending = manager.encode(data, 'in.png', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'webp'
    })
    await manager.dispose()
    const settled = await Promise.race([
      pending.then(
        () => 'settled',
        () => 'settled'
      ),
      new Promise<string>((resolve) => setTimeout(() => resolve('hung'), 3000))
    ])
    expect(settled).toBe('settled')
  })
})
