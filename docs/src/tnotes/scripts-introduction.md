# ⚙️ TNotes 核心脚本功能简介

:::danger 2025 年 1 月 14 日 22:33:56
- 文中提到的内容是早期版本的处理逻辑。
- 目前对脚本做了不小的改动，为了方便查阅，现已将各笔记仓库中的文章合并到了 tnotes 中，或许还不太稳定，计划先用一段时间测试下看看效果，再对脚本做一些优化处理。
:::

- notes 仓库用于统一管理其它的学习笔记，其中的 scripts 目录中存放笔记的一些批处理脚本。
  - `scripts/updateREADME.js` 暴露一个 ReadmeUpdater 类，根据传入的 repoName 更新 home README.md 和每篇笔记的 README.md，对应笔记仓库中的 `npm run update` 命令。
  - `scripts/notes-merge-distribute.js` 暴露两个函数：mergeReadme、distributeReadme，分别负责收集笔记和分发笔记，对应笔记仓库中的 `npm run merge`、`npm run distribute` 命令。
  - `scripts/utils.js` 中的 `syncLocalAndRemote` 方法，根据传入的 repoName，完成本地和远程仓库的内容同步。
- 为了更方便地在笔记中使用上述脚本的功能，可以在当前的 notes 目录中执行 `npm link` 形成软链接，然后在每个笔记仓库中执行一遍 `npm link tnotes`，相当于在每个笔记仓库中安装了上述脚本。

> ⏰ 这些脚本后续可以抽离出来，不必附着于 notes 仓库，比如可以考虑封装为 VSCode 插件、或者 npm 包的形式来安装，具体如何实现，可以找空闲时间测试一下，看看怎么整更方便。

## 💻 以 javascript 笔记管理流程为例

- 是先准备好俩文件 `javascript/package.json`。
- 下面是 javascript/package.json 中的内容，主要存放一些脚本。
  - 其中 merge、distribute 通常在初期处理格式问题的时候才需要用到。

```json
{
  "scripts": {
    "merge": "      node ./node_modules/tnotes   --mergeREADME         --repoName=javascript",
    "update": "     node ./node_modules/tnotes   --updateREADME        --repoName=javascript",
    "distribute": " node ./node_modules/tnotes   --distributeREADME    --repoName=javascript",
    "sync": "       node ./node_modules/tnotes   --syncREADME          --repoName=javascript"
  },
  "tnotesConfig": {
    "ignoreDirs": [
      "0000",
      ".git",
      ".vscode",
      "9999. template"
    ]
  }
}
```
- 命令作用简介：
  - `npm run merge`
    - 将所有笔记 `javascript/****` 合并到 `javascript/MERGED_README.md` 文件中，所有内容合并到一个文件中方便快速地查找替换，主要用于处理一些格式上的问题，以免在多个文件中反复切换。
  - `npm run distribute`
    - 和 merge 对应，merge 命令负责收集笔记，distribute 负责在修改完收集的笔记内容后，将修改后的内容下发到每一篇笔记。
  - `npm run update`
    - 更新 README 文件，包括首页的 README.md 和每个笔记的 README.md。主要处理每篇笔记的目录结构，并将笔记的目录信息提取到 home README 中，形成一个有效的目录结构。
  - `npm run sync`
    - 保持本地和 GitHub 远程仓库内容同步，相当于执行了 `git pull`、`git add .`、`git commit -m "update"`、`git push`。
- tnotesConfig 配置中的内容是 tnotes 脚本的配置数据。
  - ignoreDirs，用于配置忽略一些不需要处理的目录。
