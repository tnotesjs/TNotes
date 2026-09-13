import { defineConfig } from 'eslint/config'
import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default defineConfig(
  {
    // electron-builder 的配置必须是 CJS（它用 require 加载），满足不了 TS 规则的
    // 「禁止 require / 必须写返回类型」，所以交给 prettier 管格式、不进 eslint。
    //
    // crepePort/ 是从 @milkdown/crepe（MIT）移植的源码：**刻意保持与上游一致**，
    // 便于日后 diff / 重新移植，因此不按本仓风格改写（仍受 tsc 与 prettier 约束）。
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/out',
      'playground/**',
      'electron-builder.cjs',
      'src/renderer/src/markdown/crepePort/**'
    ]
  },
  tseslint.configs.recommended,
  eslintPluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser
      }
    }
  },
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts'
          }
        }
      ]
    }
  },
  {
    // Shared draft object is intentionally mutated by section panels (same as pre-split SettingsPanel).
    files: ['src/renderer/src/components/settings/**/*.vue'],
    rules: {
      'vue/no-mutating-props': 'off'
    }
  },
  {
    // Store/domain factory helpers return large method bags; annotate via usage sites instead.
    files: [
      'src/renderer/src/stores/workspace/**/*.ts',
      'src/renderer/src/markdown/createDeskRawBlockView.ts'
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  {
    files: ['**/*.{test,spec}.{ts,mts,tsx}', 'scripts/**/*.{js,mjs,cjs}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  eslintConfigPrettier
)
