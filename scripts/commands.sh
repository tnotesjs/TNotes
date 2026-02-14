#!/bin/bash

# ================================================================
# TNotes 批量命令配置文件
# ----------------------------------------------------------------
# 说明:
# 此文件用于配置需要在所有子知识库中批量执行的命令
# ----------------------------------------------------------------
# 使用方式:
# 
#   方式一: 直接执行此文件中的命令（适合复杂命令）
#     pnpm tn:cmd
#  
#   方式二: 通过命令行参数传入命令（适合简单命令）
#     pnpm tn:cmd --cmd "git status"
#     pnpm tn:cmd -c "pnpm install"
# ================================================================

# ================================================================
# 常用命令列表：
# ================================================================

# 确保远程是最新的：强制读取远程版本覆盖本地版本
# git fetch origin && git reset --hard origin/main && git clean -fd

# 确保本地是最新的：强制推送本地版本覆盖远程版本
# git add . && git commit -m "update" && git push origin main --force

# 彻底恢复仓库状态
# git reset --hard HEAD && git clean -fd

# 恢复仓库状态
# git restore .

# 拉取最新代码
# git pull

# 安装依赖
# pnpm install

# 知识库更新
# pnpm tn:update

# 知识库推送
# pnpm tn:push

# 移除所有 .vitepress-pid 模块
# git rm --cached .vitepress-pid && git commit -m "chore: 停止跟踪 .vitepress-pid 文件" && git push
