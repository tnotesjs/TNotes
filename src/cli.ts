#!/usr/bin/env node
/**
 * tnotes-kb — knowledge-base maintenance CLI.
 *
 * Commands:
 *   update   Refresh stats.completedNotesCount from TOC.md git history
 */

import path from "node:path";

import { createWorkspace } from "./workspace";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const targetArg = args.find((arg, i) => i > 0 && !arg.startsWith("--")) ?? process.cwd();
  const rootPath = path.resolve(targetArg);

  if (!command || command === "--help" || command === "-h") {
    console.log(`用法:
  tnotes-kb update [知识库目录]

说明:
  根据 Git 中 TOC.md 的历史回填 tnotes.json → stats.completedNotesCount。
  需要先在 tnotes.json 中设置 "stats": { "enabled": true }。
  旧库脚本别名示例: "tn:update": "tnotes-kb update"
`);
    process.exit(command ? 0 : 1);
  }

  if (command !== "update") {
    console.error(`未知命令: ${command}`);
    console.error("用法: tnotes-kb update [知识库目录]");
    process.exit(1);
  }

  const ws = createWorkspace({ rootPath });
  const { value } = await ws.stats.update();
  const counts = value.completedNotesCount ?? {};
  const keys = Object.keys(counts).sort();
  const latest = keys[keys.length - 1];
  console.log(
    `完成趋势已更新: ${keys.length} 个月` +
      (latest ? `，当前 ${latest} = ${counts[latest]}` : ""),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
