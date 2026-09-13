/**
 * 打包配置（JS 而非 YAML 的原因见下）。
 *
 * 背景：`@esbuild/*`、`sass-embedded-*`、`@rollup/rollup-*`、`@parcel/watcher-*`、
 * `@napi-rs/lzma-*` 都是一个平台一个包，而 electron-builder 会把整棵 production 依赖树
 * 都带进应用。它们只在运行时按当前平台解析（vite→esbuild、SSG 预览→sass），其余平台
 * 的分支纯属死重量。未裁剪时实测（macOS arm64）：
 *
 *   app.asar.unpacked 429MB
 *     @esbuild                 212MB（26 个平台）
 *     sass-embedded-*          ~170MB（17 个平台）
 *     @rollup                   48MB（25 个平台）
 *     @parcel + @napi-rs        ~7MB
 *     @img（sharp 的 libvips）  17.6MB  ← 必须保留
 *
 * 为什么不用 YAML：实测 electron-builder 只采信**顶层** `files`，平台级 `mac.files` /
 * `win.files` 的排除项完全不生效；而顶层 `files` 又没法表达「除本次目标平台之外」。
 * 所以这里在加载配置时按本次目标平台把排除项算出来：
 *   1. 从 CLI 参数推断目标平台（--mac/--win/--linux，缺省取当前系统）；
 *   2. 扫描 pnpm store 里所有「一平台一包」的原生包（新平台包会自动被覆盖）；
 *   3. 把不属于目标平台的整目录排除。
 */
const fs = require('node:fs')
const path = require('node:path')

/** 目录名里出现这些 token 就说明它是平台专属包 */
const PLATFORM_TOKENS = [
  'aix',
  'android',
  'darwin',
  'freebsd',
  'linux',
  'netbsd',
  'openbsd',
  'openharmony',
  'sunos',
  'win32'
]

/** 一平台一包的家族，以及各平台该保留的目录名前缀 */
const PLATFORM_FAMILIES = [
  { scope: '@esbuild', keep: { darwin: ['darwin-'], win32: ['win32-'], linux: ['linux-'] } },
  {
    scope: '@rollup',
    keep: {
      darwin: ['rollup-darwin-'],
      win32: ['rollup-win32-'],
      linux: ['rollup-linux-']
    }
  },
  {
    scope: '@parcel',
    keep: {
      darwin: ['watcher-darwin-'],
      win32: ['watcher-win32-'],
      linux: ['watcher-linux-']
    }
  },
  {
    scope: '@napi-rs',
    keep: { darwin: ['lzma-darwin-'], win32: ['lzma-win32-'], linux: ['lzma-linux-'] }
  },
  {
    scope: null,
    keep: {
      darwin: ['sass-embedded-darwin-'],
      win32: ['sass-embedded-win32-'],
      linux: ['sass-embedded-linux-']
    }
  }
]

function requestedPlatforms() {
  const argv = process.argv.slice(2)
  const platforms = []
  if (argv.includes('--mac') || argv.includes('-m')) platforms.push('darwin')
  if (argv.includes('--win') || argv.includes('-w')) platforms.push('win32')
  if (argv.includes('--linux') || argv.includes('-l')) platforms.push('linux')
  return platforms.length > 0 ? platforms : [process.platform]
}

function pnpmStoreDir() {
  let dir = __dirname
  for (let depth = 0; depth < 4; depth += 1) {
    const store = path.join(dir, 'node_modules', '.pnpm')
    if (fs.existsSync(store)) return store
    dir = path.dirname(dir)
  }
  return null
}

/** 扫 store 得到「包名 → 目录名」，包名即 `@scope/name` 或 `name` */
function installedFamilyPackages(store) {
  const packages = []
  for (const entry of fs.readdirSync(store)) {
    const at = entry.indexOf('@', 1)
    if (at < 0) continue
    const rawName = entry.slice(0, at)
    const name = rawName.replace('+', '/')
    const directoryName = name.includes('/') ? name.split('/')[1] : name
    for (const family of PLATFORM_FAMILIES) {
      if (family.scope ? name.startsWith(`${family.scope}/`) : name.startsWith('sass-embedded-')) {
        packages.push({
          name,
          directoryName,
          keep: family.keep
        })
      }
    }
  }
  return packages
}

function isPlatformSpecific(directoryName) {
  return PLATFORM_TOKENS.some((token) => directoryName.split('-').includes(token))
}

function platformPrunePatterns() {
  const store = pnpmStoreDir()
  if (!store) {
    console.warn('  • 平台裁剪：未找到 pnpm store，跳过')
    return []
  }
  const platforms = requestedPlatforms()
  const patterns = []
  for (const pkg of installedFamilyPackages(store)) {
    if (!isPlatformSpecific(pkg.directoryName)) continue
    const kept = platforms.some((platform) =>
      (pkg.keep[platform] ?? []).some((prefix) => pkg.directoryName.startsWith(prefix))
    )
    if (kept) continue
    patterns.push(`!**/node_modules/${pkg.name}`, `!**/node_modules/${pkg.name}/**`)
  }
  console.log(
    `  • 平台裁剪：目标平台 ${platforms.join('+')}，排除 ${patterns.length / 2} 个非本平台原生包`
  )
  return patterns
}

module.exports = {
  appId: 'com.tnotesjs.desk',
  productName: 'TNotes Desk',
  publish: null,
  directories: {
    buildResources: 'build'
  },
  files: [
    '!playground/**',
    // 打包产物目录必须排除：第二次打包时 dist/ 里已经躺着上一次的 dmg/zip，
    // 不排除就会被塞进 app.asar（实测 asar 从 356MB 涨到 1.5GB）。
    '!dist/**',
    '!**/.vscode/*',
    '!src/*',
    '!electron.vite.config.{js,ts,mjs,cjs}',
    '!{.eslintcache,eslint.config.mjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
    '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}',
    ...platformPrunePatterns()
  ],
  // asar 必须关：SSG 的预览/构建在进程内跑 Vite，SSR 侧用 ESM `import()` 加载模块，
  // 而 ESM 解析读不了 `app.asar` 里的路径。重打包实测（0.5.0 的旧包同样复现）：
  //   asar 开着 → 预览必定 500：先是 `spawn ENOTDIR`（esbuild 从 asar 里 spawn 自己的
  //   二进制），把这两个包 unpack 出来后又变成 `Cannot find module 'vue/server-renderer'`
  //   —— 路径字符串里仍带 app.asar，ESM 就是找不到。
  //   asar 关掉 → 预览 200、页面正常渲染，esbuild/sass 都在真实路径上跑。
  // 代价：应用代码不再打成一个归档文件（体积基本不变，启动略慢一点）。
  asar: false,
  mac: {
    icon: 'build/icon.icns',
    target: [
      { target: 'dmg', arch: ['arm64'] },
      { target: 'zip', arch: ['arm64'] }
    ],
    // Ad-hoc sign when no Developer ID cert is present. Unsigned+quarantined
    // downloads show "is damaged" with no bypass; ad-hoc becomes "unidentified
    // developer" (right-click → Open). Not a substitute for Apple notarization.
    identity: '-',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
    // 原 YAML 把这两项写成了「单键对象的数组」，进 Info.plist 会变成数组而不是键；
    // 这里按 electron-builder 文档的对象形态写（语义相同、结果才是正确的 plist 键）。
    extendInfo: {
      NSDocumentsFolderUsageDescription:
        'Application requests access to the user\u2019s Documents folder.',
      NSDownloadsFolderUsageDescription:
        'Application requests access to the user\u2019s Downloads folder.'
    },
    notarize: false
  },
  win: {
    icon: 'build/icon.ico',
    executableName: 'TNotes Desk'
  },
  nsis: {
    artifactName: '${name}-${version}-setup.${ext}',
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: 'always'
  },
  dmg: {
    artifactName: '${name}-${version}.${ext}'
  },
  linux: {
    icon: 'build/icon.png',
    target: ['AppImage', 'deb'],
    maintainer: 'tnotesjs',
    category: 'Utility'
  },
  appImage: {
    artifactName: '${name}-${version}.${ext}'
  },
  npmRebuild: false
}
