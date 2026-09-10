/**
 * 验收自测用的 fixture：在任意临时目录里造出一个可复现的知识库与一套素材，
 * 不依赖任何本机路径，也不触碰真实 kbs/。
 *
 * 覆盖：大图/已压小 JPEG/透明 PNG/GIF/SVG/excalidraw、同笔记同字节重复、
 * 跨笔记同字节、无引用资源、断链、mindmap fence、URL 编码的边界文件名、
 * 未入 TOC 的笔记、仅出现在代码围栏里的引用。
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { randomBytes, randomUUID } from 'node:crypto'
import { join } from 'node:path'

import sharp from 'sharp'

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)

const gradientSvg = (width, height) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#1f6feb"/><stop offset="55%" stop-color="#4ec9b0"/>
    <stop offset="100%" stop-color="#dcdcaa"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="${width * 0.3}" cy="${height * 0.6}" r="${height * 0.22}" fill="#ffffff" opacity="0.65"/>
  <rect x="${width * 0.55}" y="${height * 0.2}" width="${width * 0.3}" height="${height * 0.3}" fill="#1e1e1e" opacity="0.7"/>
</svg>`
  )

const alphaSvg = (width, height) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="none"/>
  <circle cx="${width / 2}" cy="${height / 2}" r="${height * 0.4}" fill="#ff5d5d"/>
  <rect x="10" y="10" width="${width * 0.25}" height="${height * 0.25}" fill="#4dabf7"/>
</svg>`
  )

const EXCALIDRAW = JSON.stringify(
  {
    type: 'excalidraw',
    version: 2,
    source: 'desk-acceptance-fixture',
    elements: [
      {
        id: 'rect-1',
        type: 'rectangle',
        x: 100,
        y: 80,
        width: 240,
        height: 140,
        angle: 0,
        strokeColor: '#1e1e1e',
        backgroundColor: 'transparent',
        fillStyle: 'hachure',
        strokeWidth: 2,
        roughness: 1,
        opacity: 100,
        seed: 1,
        version: 1,
        versionNonce: 1,
        isDeleted: false,
        boundElements: null,
        updated: 1,
        link: null,
        locked: false
      }
    ],
    appState: { gridSize: null, viewBackgroundColor: '#ffffff' },
    files: {}
  },
  null,
  2
)

/** 真正不可压的噪声大图，压缩收益明显且稳定。 */
export async function noisyPng(width = 1200, height = 800) {
  const raw = randomBytes(width * height * 3)
  return new Uint8Array(
    await sharp(raw, { raw: { width, height, channels: 3 } })
      .png()
      .toBuffer()
  )
}

/** 拖进 Desk 用的素材目录。 */
export async function writeAcceptanceMaterials(dir) {
  mkdirSync(dir, { recursive: true })
  const big = await noisyPng()
  writeFileSync(join(dir, 'big.png'), big)

  const smallJpg = await sharp(gradientSvg(640, 360))
    .jpeg({ quality: 55, mozjpeg: true })
    .toBuffer()
  writeFileSync(join(dir, 'small.jpg'), smallJpg)

  writeFileSync(join(dir, 'alpha.png'), await sharp(alphaSvg(800, 600)).png().toBuffer())
  writeFileSync(join(dir, 'gif.gif'), await sharp(gradientSvg(320, 200)).gif().toBuffer())
  writeFileSync(join(dir, 'vector.svg'), gradientSvg(320, 200))
  writeFileSync(join(dir, 'drawing.excalidraw'), `${EXCALIDRAW}\n`)
  writeFileSync(join(dir, '中文 空格 (1).png'), await sharp(gradientSvg(300, 200)).png().toBuffer())
  return dir
}

/**
 * 验收知识库。文件名前缀决定归属：0002 的同字节重复可合并，0003 的同字节
 * 只能统计；0004 制造断链与不确定引用；0005 故意不写进 TOC。
 */
export async function writeAcceptanceKb(root) {
  const assets = join(root, 'assets')
  const notes = join(root, 'notes')
  mkdirSync(assets, { recursive: true })
  mkdirSync(notes, { recursive: true })

  // 侧栏显示 tnotes.json 的 title，与目录名保持一致，脚本才能按名字点开
  writeFileSync(
    join(root, 'tnotes.json'),
    JSON.stringify({ name: 'acceptance-kb', title: 'acceptance-kb' }, null, 2) + '\n'
  )
  writeFileSync(
    join(root, 'TOC.md'),
    [
      '- [ ] 0001. 开始使用',
      '- [ ] 0002. 重复与合并',
      '- [ ] 0003. 跨笔记',
      '- [ ] 0004. 边界与断链'
    ].join('\n') + '\n'
  )
  writeFileSync(join(root, '.gitignore'), 'node_modules/\n.tnotes/dist\n.DS_Store\n')

  const big = await noisyPng()
  const smallJpg = await sharp(gradientSvg(640, 360))
    .jpeg({ quality: 55, mozjpeg: true })
    .toBuffer()
  const alpha = await sharp(alphaSvg(800, 600)).png().toBuffer()
  const gif = await sharp(gradientSvg(320, 200)).gif().toBuffer()
  const boundary = await sharp(gradientSvg(300, 200)).png().toBuffer()
  const dupSource = await sharp(gradientSvg(900, 600)).png().toBuffer()
  const dupSource2 = await sharp(alphaSvg(900, 600)).png().toBuffer()

  // 0001：一篇被引用的 webp + 一个已无人引用的旧 webp（疑似闲置）
  const referenced = await sharp(gradientSvg(400, 300)).webp({ quality: 80 }).toBuffer()
  const orphan = await sharp(gradientSvg(420, 320)).webp({ quality: 80 }).toBuffer()
  writeFileSync(join(assets, '0001-26-09-10-23-42-18.webp'), referenced)
  writeFileSync(join(assets, '0001-26-09-10-22-51-41.webp'), orphan)
  writeFileSync(
    join(notes, '0001. 开始使用.md'),
    [
      '---',
      `id: ${randomUUID()}`,
      '---',
      '',
      '# 开始使用',
      '',
      '这是一个 TNotes 知识库。',
      '',
      '完整说明请查看 [TNotes.docs](https://tnotesjs.github.io/TNotes.docs/)。',
      '',
      '![测试](../assets/0001-26-09-10-23-42-18.webp) {w=528px}',
      ''
    ].join('\n')
  )

  writeFileSync(join(assets, '0002-big.png'), big)
  writeFileSync(join(assets, '0002-small.jpg'), smallJpg)
  writeFileSync(join(assets, '0002-alpha.png'), alpha)
  writeFileSync(join(assets, '0002-gif.gif'), gif)
  writeFileSync(join(assets, '0002-vector.svg'), gradientSvg(320, 200))
  writeFileSync(join(assets, '0002-mind.png'), await sharp(gradientSvg(400, 300)).png().toBuffer())
  writeFileSync(join(assets, '0002-dup-a.png'), dupSource)
  writeFileSync(join(assets, '0002-dup-b.png'), dupSource)
  writeFileSync(join(assets, '0003-dup-c.png'), dupSource)
  writeFileSync(join(assets, '0005-untoc.png'), dupSource2)
  writeFileSync(join(assets, '0004-drawing.excalidraw'), `${EXCALIDRAW}\n`)
  writeFileSync(
    join(assets, '0004-fenced-only.png'),
    await sharp(gradientSvg(120, 80)).png().toBuffer()
  )
  writeFileSync(join(assets, 'idle.png'), await sharp(gradientSvg(150, 100)).png().toBuffer())
  writeFileSync(join(assets, '中文 空格 (1).png'), boundary)

  const note = (name, body) =>
    writeFileSync(
      join(notes, name),
      `---\nid: ${randomUUID()}\n---\n\n# ${name.replace(/^\d+\.\s*/, '').replace(/\.md$/, '')}\n\n${body}\n`
    )

  note(
    '0002. 重复与合并.md',
    [
      '![大图](../assets/0002-big.png)',
      '',
      '[下载原图](../assets/0002-big.png?download=1#frag)',
      '',
      '![已压小 JPEG](../assets/0002-small.jpg)',
      '',
      '![透明 PNG](../assets/0002-alpha.png)',
      '',
      '![同字节 A](../assets/0002-dup-a.png)',
      '',
      '![同字节 B](../assets/0002-dup-b.png)',
      '',
      '![GIF](../assets/0002-gif.gif)',
      '',
      '![SVG](../assets/0002-vector.svg)',
      '',
      '```mindmap [图]',
      '# root',
      '',
      '- ![脑图里的图](./assets/0002-mind.png)',
      '```',
      ''
    ].join('\n')
  )
  note(
    '0003. 跨笔记.md',
    '![跨笔记同内容](../assets/0003-dup-c.png)\n\n![再引用一次](../assets/0003-dup-c.png)'
  )
  note(
    '0004. 边界与断链.md',
    [
      '![编码中文路径](../assets/%E4%B8%AD%E6%96%87%20%E7%A9%BA%E6%A0%BC%20(1).png?w=100#frag)',
      '',
      '![断链](../assets/0004-missing.png)',
      '',
      '![画布](../assets/0004-drawing.excalidraw)',
      '',
      '```txt',
      '示例代码里的路径不应被改写：../assets/0004-fenced-only.png',
      '```',
      ''
    ].join('\n')
  )
  note('0005. 未入 TOC.md', '![未入 TOC 的图](../assets/0005-untoc.png)')
  return root
}

/** fixture 的断言基线（与 packages/kb 的扫描结果一致）。 */
export const ACCEPTANCE_EXPECTED = {
  assetCount: 16,
  determinedReferences: 17,
  uncertainReferences: 1,
  mergeableDuplicateGroups: 1,
  crossNoteDuplicates: 3,
  idle: ['assets/0001-26-09-10-22-51-41.webp', 'assets/idle.png'],
  uncertain: ['assets/0004-fenced-only.png'],
  protectedAsset: 'assets/0004-drawing.excalidraw',
  brokenLinkLine: 9
}

export { PNG_1X1 }
