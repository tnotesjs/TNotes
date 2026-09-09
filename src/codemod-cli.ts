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
    console.log(`  资源重命名（已加笔记索引）：`);
    for (const [from, to] of renamed) console.log(`    ${from} → ${to}`);
  }
  if (report.config) {
    console.log(`  tnotes.json：`);
    for (const line of JSON.stringify(report.config, null, 2).split("\n")) {
      console.log(`    ${line}`);
    }
  } else {
    console.log("  tnotes.json：已存在，未覆盖");
  }
  if (report.scaffolded.length > 0) {
    console.log(`  工程文件：${report.scaffolded.join("、")}`);
  }
  if (report.preservedScripts.length > 0) {
    console.log(`  保留的自定义 scripts：${report.preservedScripts.join("、")}`);
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
