import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      // 添加 quotes 规则，确保只使用单引号
      'quotes': ['error', 'single'],
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];