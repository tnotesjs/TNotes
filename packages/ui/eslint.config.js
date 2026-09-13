import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  // e0-spike/.e0-dist 是 E0 可行性验证的构建产物（见 .gitignore、根 .prettierignore）
  { ignores: ['dist/', 'node_modules/', 'coverage/', '**/.e0-dist/'] },
  // TODO(lint-triage): 以下文件在本包首次启用 eslint 时即有 findings，与思维导图 UI 收敛无关，
  // 修它们会改到 Desk / SSG 共用的组件行为，超出本次范围。逐文件列出而不是整目录忽略，
  // 保证新增代码仍然受门禁约束；后续单独一轮清理后再逐行删掉。
  {
    ignores: [
      'e0-spike/main.js',
      'src/code/highlight.ts',
      'src/components/CodeBlock/CodeBlock.vue',
      'src/components/CodeGroup/CodeGroup.vue',
      'src/components/Mermaid/Mermaid.vue',
      'src/components/WordList/RightClickMenu.vue',
      'src/components/WordList/WordList.vue'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module'
      }
    }
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
)
