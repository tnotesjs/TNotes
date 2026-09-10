import { context, build as esbuild } from 'esbuild'
import { build as viteBuild } from 'vite'

const watch = process.argv.includes('--watch')
const extensionOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.cjs',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  logLevel: 'info'
}

if (watch) {
  const extension = await context(extensionOptions)
  await extension.watch()
  await viteBuild({ mode: 'development', build: { watch: {} } })
} else {
  await esbuild(extensionOptions)
  await viteBuild()
}
