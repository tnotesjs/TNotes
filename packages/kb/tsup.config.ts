import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    clean: true,
    target: "node22",
    platform: "node",
    external: ["gray-matter"],
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    dts: false,
    splitting: false,
    clean: false,
    target: "node22",
    platform: "node",
    banner: { js: "#!/usr/bin/env node" },
    external: ["gray-matter"],
  },
]);
