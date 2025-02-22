# 💻 处理笨重的 git log 问题

[[toc]]

## 1. 📒 概述

- 随着 TNotes 的不断迭代，commit 会不断递增，如果不打算保留历史的 commit，可通过重写 git log 来清理 commit。
- **清理的目的**
  - 1️⃣ 减少 clone 的时间，早期的 commit 记录的版本并不重要，基本也不会再去回退，留着这些内容反而导致拉取项目的时候时间增加。
  - 2️⃣ 早期的 commit 中可能推了一些不希望公开的内容，现在希望将这些 commit 都丢弃掉。

## 2. 💻 如何完成 TNotes 的 git log 清理

- **最终效果**：
  - 清理前：150 次 commit 历史……
    - <img width="1061" alt="image" src="https://github.com/user-attachments/assets/27d38958-8d79-42a4-aa4c-138a5fb6afee" />
  - 清理后：1 次最新的 commit 历史……
    - <img width="1061" alt="image" src="https://github.com/user-attachments/assets/d106d1b8-7ede-496b-bb79-acc6f0c66b8f" />

---

- **实现步骤**：

::: code-group

```bash [1. 克隆一个裸仓库]
# 首先克隆一个“裸仓库”，即没有工作目录的 Git 仓库。
git clone --bare https://github.com/username/repo.git
cd repo.git
```

```bash [2. 清理历史记录]
# 重新创建一个空的 Git 历史，只保留当前版本。
git init --bare
cd ../
git clone repo.git repo-temp
cd repo-temp
rm -rf .git
git init
git add .
git commit -m "Initial commit with current state"
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -f origin main
```

:::

- 本地旧版的 old-repo 可以作为参考版本，如果这些历史的 commit 都不重要的话，直接删除即可。
- 后续如果还要清理的话，按照这篇笔记中记录的流程再走一遍即可。

---

**🤔 这种做法会影响到仓库中已有的 Discussions 和 Issues 吗？**

- 刚才（ 现在时间 - 2025 年 1 月 24 日 00:05:02）拿 TNotes 实测了一波，上述记录的 Git 的 **历史清理操作** 主要影响的是代码仓库的 **提交历史（commits）** 和 **分支**。它不会影响 **Discussions**、**Issues**、**Pull Requests** 等数据。
- **以下这些数据都不会有影响**：
  - Discussions 是独立于 Git 代码历史的，它们存储在 GitHub 的数据库中，不会因为代码仓库历史的清理而丢失。
  - Issues 也是独立的，与提交历史无关。即使你删除了整个仓库的提交历史，Issues 仍会保留。
  - Pull Requests 的讨论和评论会保留，但由于历史的清理，旧的 Pull Request 的代码差异可能会变得无法显示，因为底层的提交记录已经不复存在。
  - 仓库的 Star 数和 Fork 数不会受影响。
- **会有影响的数据**：
  - 旧的 PR
  - 早期的 commit 历史
  - 分支


