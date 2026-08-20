export const SAMPLE_MARKDOWN = `# 读书笔记：《原则》

- 生活原则
  - 拥抱现实，应对现实
  - 五步流程实现人生目标
    - 明确目标
    - 识别问题，不容忍问题
    - 诊断问题，找到根源
    - 规划方案
    - 坚定执行
  - 做到极度求真、极度透明
- 工作原则
  - 创意择优
    - 可信度加权
    - 极度求真与极度透明
  - [桥水官网](https://www.bridgewater.com)
  - [《原则》豆瓣页](https://book.douban.com/subject/27608239/)
- 我的实践
  - [ ] 每周复盘一次决策
  - [x] 建立问题记录习惯
  - 参考资料
    - ![示例头像|200](https://avatars.githubusercontent.com/u/83686346?v=4)
`

/** 生成约 count 个节点的压力测试脑图 */
export function generateStressMarkdown(count: number): string {
  const lines: string[] = [`# 压力测试（${count} 节点）`, '']
  const branches = 12
  const perBranch = Math.max(1, Math.floor((count - 1) / branches))
  for (let b = 0; b < branches; b++) {
    lines.push(`- 分支 ${b + 1}`)
    let quota = perBranch
    let topic = 0
    while (quota > 0) {
      topic++
      lines.push(`  - 主题 ${b + 1}.${topic}`)
      quota--
      const leaves = Math.min(quota, 12)
      for (let j = 1; j <= leaves; j++) {
        lines.push(`    - 节点 ${b + 1}.${topic}.${j}`)
        quota--
        if (j % 4 === 0 && quota > 0) {
          lines.push(`      - 叶子 ${b + 1}.${topic}.${j}.1`)
          quota--
        }
      }
    }
  }
  return lines.join('\n') + '\n'
}
