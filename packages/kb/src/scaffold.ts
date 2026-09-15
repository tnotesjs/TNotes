/**
 * Engineering-file drafts for a new knowledge base (package.json, deploy.yml, gitignore).
 */

import fs from 'node:fs/promises'
import path from 'node:path'

/** Knowledge-base gitignore. */
export const CANONICAL_GITIGNORE = `node_modules/
.tnotes/dist
.DS_Store
`

/** Line-ending + binary hygiene for note-centric repos. */
export const CANONICAL_GITATTRIBUTES = `# Normalize text; keep notes and config on LF
* text=auto
*.md text eol=lf
*.json text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
.gitignore text eol=lf
.gitattributes text eol=lf

# Do not treat common assets as text
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.webp binary
*.ico binary
*.pdf binary
*.zip binary
`

/** Fresh KBs need this so pnpm can install newly published @tnotesjs packages. */
export const CANONICAL_PNPM_WORKSPACE = `allowBuilds:
  esbuild: true
  '@parcel/watcher': true
minimumReleaseAgeExclude:
  - '@tnotesjs/ui'
  - '@tnotesjs/kb'
  - '@tnotesjs/ssg'
`

export const CANONICAL_NPMRC = `@tnotesjs:registry=https://registry.npmjs.org/
`

export const PACKAGE_JSON_DEPS = {
  kb: '^0.2.1',
  ssg: '^0.1.5'
} as const

export const DEPLOY_WORKFLOW = `# 构建 TNotes SSG 站点并部署到 GitHub Pages
name: Deploy TNotes site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: "0 0 1 * *" # 每月 1 号 UTC 00:00 自动触发 deploy

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          submodules: true
      - uses: pnpm/action-setup@v3
        with:
          version: 11.10.0
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22.22.0
          cache: pnpm
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: pnpm install
      - name: Update stats
        run: pnpm tn:update
      - name: Build with TNotes SSG
        env:
          NODE_OPTIONS: --max-old-space-size=8192
        run: pnpm tn:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .tnotes/dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  notify:
    needs: deploy
    runs-on: ubuntu-latest
    name: Notify TNotes
    steps:
      - name: Trigger root repo collect
        run: |
          curl -sf --max-time 15 -X POST \\
            -H "Accept: application/vnd.github+json" \\
            -H "X-GitHub-Api-Version: 2022-11-28" \\
            -H "Authorization: Bearer \${{ secrets.TNOTES_DISPATCH_TOKEN }}" \\
            https://api.github.com/repos/tnotesjs/TNotes.root/dispatches \\
            -d '{"event_type":"sub_repo_updated","client_payload":{"repo":"\${{ github.event.repository.name }}","sha":"\${{ github.sha }}"}}'
`

export function buildPackageJson(name?: string): Record<string, unknown> {
  const pkg: Record<string, unknown> = {
    private: true,
    type: 'module',
    scripts: {
      'tn:update': 'tnotes-kb update',
      'tn:build': 'tnotes-ssg build',
      'tn:dev': 'tnotes-ssg dev',
      'tn:preview': 'tnotes-ssg preview'
    },
    devDependencies: {
      '@tnotesjs/kb': PACKAGE_JSON_DEPS.kb,
      '@tnotesjs/ssg': PACKAGE_JSON_DEPS.ssg
    },
    packageManager: 'pnpm@11.10.0',
    engines: { node: '>=22' }
  }
  const trimmed = name?.trim()
  if (trimmed) pkg.name = trimmed
  return pkg
}

export function buildRootReadme(title: string, folderName: string): string {
  const heading = title.trim() || folderName
  return `# ${heading}

- ${heading} 笔记。
`
}

export async function writePackageJsonScaffold(rootPath: string, name?: string): Promise<string[]> {
  const written: string[] = []
  await fs.writeFile(
    path.join(rootPath, 'package.json'),
    `${JSON.stringify(buildPackageJson(name), null, 2)}\n`
  )
  written.push('package.json')
  await fs.writeFile(path.join(rootPath, 'pnpm-workspace.yaml'), CANONICAL_PNPM_WORKSPACE)
  written.push('pnpm-workspace.yaml')
  await fs.writeFile(path.join(rootPath, '.npmrc'), CANONICAL_NPMRC)
  written.push('.npmrc')
  return written
}

export async function writeDeployWorkflowScaffold(rootPath: string): Promise<string[]> {
  const workflowPath = path.join(rootPath, '.github', 'workflows', 'deploy.yml')
  await fs.mkdir(path.dirname(workflowPath), { recursive: true })
  await fs.writeFile(workflowPath, DEPLOY_WORKFLOW)
  return ['.github/workflows/deploy.yml']
}
