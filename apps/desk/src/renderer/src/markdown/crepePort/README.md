# crepePort —— 从 `@milkdown/crepe` 移植过来的编辑器特性

上游：**`@milkdown/crepe@7.22.1`**（MIT）。本目录的文件来自下面列出的具体上游路径，用来在
**不依赖 crepe** 的前提下保留原有的 UI 行为、图标与 DOM 类名。

改动原则（每个文件头部也写了）：

- 去掉 Crepe 自己的 `FeaturesCtx` / `CrepeCtx` 两个 slice 与 `crepeFeatureConfig()` —— 那只
  用于 Crepe 的 feature 开关登记，我们用自己的装配参数表达；
- 把「只读」等从 Crepe 实例上读的状态改为回调参数（如 `placeholder`）；
- **其余（图标常量、文案默认值、配置键、插件实现）原样保留**，避免视觉/行为漂移；
- 补上 TypeScript 类型（配置类型直接复用 `@milkdown/kit/component/*` 导出的 `*Config`）。

## 上游来源映射

不能拿整目录去和 `src/feature` 统一比对 —— 不同批次取自不同产物：

| 本目录 | 上游路径 | 形态 |
| --- | --- | --- |
| `codemirror.ts` `cursor.ts` `listitem.ts` `table.ts` `linktooltip.ts` `placeholder.ts` | `lib/esm/feature/{code-mirror,cursor,list-item,table,link-tooltip,placeholder}/index.js` | **编译产物**转写为 TS（补类型 + 去 feature 登记），行级 diff 不适用 |
| `latex/**` | `src/feature/latex/**` | TS 源码。`index.ts` 去 feature 登记；`inline-tooltip/component.tsx` → `component.ts`（用 `h()` 重写） |
| `blockEdit/**` | `src/feature/block-edit/**` | TS 源码。`features.ts` 用显式参数取代 Crepe 的 `useCrepeFeatures`；`menu/constrain.ts` 是 Desk 新增 |
| `toolbar/**` | `src/feature/toolbar/**` | TS 源码。`features.ts` 用 `{ latex, ai }`，Desk 默认 `ai: false`（「Ask AI」按钮及其依赖一并移除） |
| `utils/**` | `src/utils/**` | 逐字节相同 |
| `icons/**` | `src/icons/**` | 上游 51 个图标里取了 22 个，逐字节相同；`icons/index.ts` 是 Desk 自己写的 barrel（只导出这 22 个，上游那个导出 50 个） |
| `theme/common/**` | `lib/theme/common/**` | 逐字节相同；`style.css` 是 Desk 改写过的入口（去掉不要的主题） |

**至此 Crepe 里 Desk 用到的 12 个 feature 全部由本目录覆盖**（ai / top-bar / image-block
按计划未移植），`@milkdown/crepe` 已从依赖中移除。

## 归属边界（59 个 `.ts` / `.tsx`）

按「这个文件还是不是上游代码」分三类，检查范围就是按这个划的：

| 类别 | 数量 | 说明 |
| --- | --- | --- |
| **逐字节相同** | 30 | 22 个图标（不含 `index.ts`）+ `utils/**` 6 个 + `latex/constants.ts` + `latex/inline-tooltip/tooltip.ts` |
| **搬自上游、已改写、但保留上游写法** | 24 | 见 `apps/desk/eslint.config.mjs` 的 `PORTED_WITH_UPSTREAM_STYLE` |
| **Desk 自己写 / 重写** | 5 | `blockEdit/features.ts`、`blockEdit/menu/constrain.ts`、`latex/confirmIcon.ts`、`latex/inline-tooltip/component.ts`、`toolbar/features.ts` |

## 检查范围

- **tsc**：整个目录都受约束（`tsconfig.web.json`，实际生效 `strict` / `noUnusedLocals` /
  `noUnusedParameters` / `noImplicitReturns`）。
- **eslint**：30 个逐字节文件整体豁免；其余 **29 个全部纳入**。纳入的那些只对三条规则做了
  窄豁免，理由都是「上游就是这么写的，改它等于改写 vendored 代码」：
  - `explicit-function-return-type`：`PORTED_WITH_UPSTREAM_STYLE` 那 24 个文件（上游函数一律
    不标返回类型）；
  - `prefer-const`：`latex/command.ts`（`let _tr` 是上游原句；两个分支各自声明，第二处会被
    重新赋值）；
  - `no-this-alias`：`blockEdit/menu/index.ts`（`const self = this` 是上游原句，上游自己在上一行
    留了 `// oxlint-disable-next-line ts/no-this-alias`，上游用的是 oxlint）。

  **已知取舍**：返回类型豁免是按文件给的，所以那 24 个文件里**新加的** Desk 代码也不受这一条
  约束（其余规则照常生效）。可接受；等某个文件被深度重写到不再是上游代码时，把它从
  `PORTED_WITH_UPSTREAM_STYLE` 移出即可。
- **prettier**：整个目录豁免（含已改写文件）—— 按上游格式保留，改本仓风格会让「本地改动 vs
  上游」的 diff 变难读，不利于重新移植。见 `apps/desk/.prettierignore` 与根 `.prettierignore`
  （CI 跑的是根目录那份）。

## 怎么重新判定边界

`@milkdown/crepe` 已经不是本仓依赖，比对前先取一份上游：

```bash
cd /tmp && npm pack @milkdown/crepe@7.22.1 && tar -xzf milkdown-crepe-7.22.1.tgz   # → /tmp/package
```

```bash
P=apps/desk/src/renderer/src/markdown/crepePort
U=/tmp/package

# 逐字节相同的那批（无输出 = 仍然相同）
for f in "$P"/icons/*.ts; do case "$f" in */index.ts) continue;; esac; diff -q "$f" "$U/src/icons/$(basename "$f")"; done
diff -rq "$P/utils" "$U/src/utils"
diff -q "$P/latex/constants.ts" "$U/src/feature/latex/constants.ts"
diff -q "$P/latex/inline-tooltip/tooltip.ts" "$U/src/feature/latex/inline-tooltip/tooltip.ts"
diff -rq "$P/theme/common" "$U/lib/theme/common"     # style.css 预期有差异

# 改写件：看差异规模（本来就不是逐字节比对）
diff -rq "$P/blockEdit" "$U/src/feature/block-edit"
diff -rq "$P/latex"     "$U/src/feature/latex"
diff -rq "$P/toolbar"   "$U/src/feature/toolbar"

# 6 个根文件：对照编译产物（JS → TS 转写，只能人工读）
diff "$P/codemirror.ts" "$U/lib/esm/feature/code-mirror/index.js"
```

## 维护规则

这是一条**持续维护**的边界，不是一次性名单。**源码归属或改写程度发生变化时**要同步更新：

- 新移植一个上游文件 → 若逐字节相同，加进 `eslint.config.mjs` 的 `VENDORED_VERBATIM`；否则加进
  `PORTED_WITH_UPSTREAM_STYLE`；
- 把某个 ported 文件改写到不再是上游代码 → 从 `PORTED_WITH_UPSTREAM_STYLE` 移出（恢复全规则
  检查），并把它挪进上表的「Desk 自己写」一类；
- 漏更新时的失败方向是**吵闹**的：除整体忽略的 `theme/`、`icons/`、`utils/` 外，新文件默认受检，
  会直接报错要求补返回类型或补名单。**在这三个目录里新增或改写文件时，必须同步调整豁免名单** ——
  它们是被目录通配整体忽略的（`icons/` 里只有 `index.ts` 被取反放行；`theme/` 是 CSS，本来也不进
  eslint），放一个新文件进去不会自动受检。
- 边界速查（用 `eslint.isPathIgnored()` 实测）：`icons/`、`utils/`、`theme/` 下新增 → **被忽略**；
  `blockEdit/`、`latex/`、`toolbar/` 与 crepePort 根下新增 → **受检**。

上游许可：Milkdown / Crepe 均为 MIT。
