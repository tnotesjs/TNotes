import { migrateKnowledgeBase } from "./codemod";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const target = args.find((arg) => !arg.startsWith("--"));
  if (!target) {
    console.error("用法: tnotes-kb-migrate <知识库目录> [--dry-run]");
    process.exit(1);
  }

  const report = await migrateKnowledgeBase(target, { dryRun });
  const prefix = dryRun ? "[dry-run] " : "";
  console.log(`${prefix}迁移完成：${report.notesMigrated} 篇笔记`);
  console.log(`  内联 <<< 引用：${report.includesInlined} 处`);
  console.log(`  迁移 assets：${report.assetsMoved} 个文件`);
  const renamed = Object.entries(report.assetsRenamed);
  if (renamed.length > 0) {
    console.log(`  重命名（重名冲突）：`);
    for (const [from, to] of renamed) console.log(`    ${from} → ${to}`);
  }
  if (report.includeFailures.length > 0) {
    console.log(`  ⚠️ 引用失败（保留原行）：`);
    for (const failure of report.includeFailures) console.log(`    ${failure}`);
  }
  if (report.leftovers.length > 0) {
    console.log(`  旧版残留（未自动删除，请确认后手动清理）：`);
    for (const leftover of report.leftovers) console.log(`    ${leftover}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
