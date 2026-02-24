/**
 * batch-add-notify.ts
 *
 * 为所有子知识库的 deploy.yml 添加 notify job
 * 用于通知根仓库收集元数据
 *
 * 用法：
 *   pnpm tsx scripts/batch-add-notify.ts          # 预览模式
 *   pnpm tsx scripts/batch-add-notify.ts --apply   # 实际写入
 */
import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import { __dirname, ROOT_CONFIG_PATH } from './constants'

const REPOS_ROOT = path.resolve(__dirname, '..', '..')

/** 需要追加的 notify job 块 */
const NOTIFY_BLOCK = `
  # 通知根仓库收集元数据
  notify:
    needs: deploy
    runs-on: ubuntu-latest
    name: Notify TNotes
    steps:
      - name: Trigger root repo collect
        run: |
          curl -s -X POST \\
            -H "Accept: application/vnd.github.v3+json" \\
            -H "Authorization: token \${{ secrets.TNOTES_DISPATCH_TOKEN }}" \\
            https://api.github.com/repos/tnotesjs/TNotes/dispatches \\
            -d '{"event_type":"sub_repo_updated","client_payload":{"repo":"\${{ github.event.repository.name }}"}}'
`

async function main() {
  const args = minimist(process.argv.slice(2))
  const apply = !!args.apply

  // 读取根配置获取子仓库列表
  const rootConfig = JSON.parse(fs.readFileSync(ROOT_CONFIG_PATH, 'utf8'))
  const repoList: string[] = rootConfig.sub_knowledge_list || []

  console.log(`📋 共 ${repoList.length} 个子知识库\n`)
  if (!apply) {
    console.log('⚠️  预览模式，不会实际写入。加 --apply 参数执行写入。\n')
  }

  let updatedCount = 0
  let skippedCount = 0
  let missingCount = 0

  for (const repoName of repoList) {
    const ymlPath = path.join(
      REPOS_ROOT,
      repoName,
      '.github',
      'workflows',
      'deploy.yml',
    )

    if (!fs.existsSync(ymlPath)) {
      console.log(`  ⚠️  [${repoName}] deploy.yml 不存在，跳过`)
      missingCount++
      continue
    }

    const content = fs.readFileSync(ymlPath, 'utf8')

    // 已有 notify job 则跳过
    if (content.includes('sub_repo_updated')) {
      console.log(`  ✅ [${repoName}] 已有 notify job，跳过`)
      skippedCount++
      continue
    }

    if (apply) {
      // 追加 notify 块
      const newContent = content.trimEnd() + '\n' + NOTIFY_BLOCK
      fs.writeFileSync(ymlPath, newContent, 'utf8')
      console.log(`  📝 [${repoName}] 已添加 notify job`)
    } else {
      console.log(`  🔍 [${repoName}] 将添加 notify job`)
    }
    updatedCount++
  }

  console.log('\n📊 统计:')
  console.log(`   📝 ${apply ? '已更新' : '待更新'}: ${updatedCount}`)
  console.log(`   ✅ 已跳过: ${skippedCount}`)
  console.log(`   ⚠️  缺失: ${missingCount}`)
}

main().catch((err) => {
  console.error('❌ 批量更新失败:', err.message || err)
  process.exit(1)
})
