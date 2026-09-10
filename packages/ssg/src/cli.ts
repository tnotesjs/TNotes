import process from "node:process";

import { buildSite, createDevServer, previewSite } from "./site";

const [command = "dev", rootArg] = process.argv.slice(2);
const root = rootArg || process.cwd();

/**
 * Print URLs ourselves: the servers run with logLevel "warn", which silences
 * Vite's info-level printUrls and leaves the CLI looking hung.
 */
function printUrls(server: {
  resolvedUrls: { local: string[]; network: string[] } | null;
}) {
  const urls = server.resolvedUrls;
  if (!urls) return;
  for (const url of urls.local) console.log(`  ➜ Local:   ${url}`);
  for (const url of urls.network) console.log(`  ➜ Network: ${url}`);
}

async function main() {
  if (command === "build") {
    const result = await buildSite(root);
    console.log(
      `TNotes SSG built ${result.pageCount} pages into ${result.config.outDir}`,
    );
    return;
  }
  if (command === "preview") {
    const server = await previewSite(root);
    printUrls(server);
    return;
  }
  if (command === "dev") {
    console.log("TNotes SSG dev server starting…");
    const server = await createDevServer(root);
    printUrls(server);
    return;
  }
  throw new Error(`Unknown command: ${command}. Use dev, build, or preview.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
