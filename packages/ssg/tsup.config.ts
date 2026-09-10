import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    splitting: true,
    clean: true,
    external: ["vue", "@tnotesjs/ui"],
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    dts: false,
    banner: { js: "#!/usr/bin/env node" },
    external: ["vue", "@tnotesjs/ui"],
  },
]);
