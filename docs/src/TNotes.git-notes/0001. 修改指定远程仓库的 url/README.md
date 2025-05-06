# [0001. 修改指定远程仓库的 url](https://github.com/Tdahuyou/TNotes.git-notes/tree/main/notes/0001.%20%E4%BF%AE%E6%94%B9%E6%8C%87%E5%AE%9A%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%20url)

<!-- region:toc -->

- [1. 💻 使用 `git remote set-url` 命令](#1--使用-git-remote-set-url-命令)
- [2. 💻 直接编辑 `.git/config` 文件](#2--直接编辑-gitconfig-文件)

<!-- endregion:toc -->
- `git remote set-url origin 新的URL`

## 1. 💻 使用 `git remote set-url` 命令

要修改 Git 仓库中远程 `origin` 的 URL，你可以使用 `git remote set-url` 命令。

```sh
# 可以先查看当前的远程仓库 URL，然后根据需要进行修改
git remote -v # 这将显示所有远程仓库（包括 origin）的 fetch 和 push URL。

# git 修改远程 origin 的 url 的命令是：
git remote set-url origin 新的URL
# 例如，如果新的远程仓库 URL 是 `https://github.com/username/new-repo.git`，那么命令将是：
git remote set-url origin https://github.com/username/new-repo.git

# 修改完毕之后，可以再次查看远程仓库的 URL，确保修改成功。
git remote -v
```

## 2. 💻 直接编辑 `.git/config` 文件

你也可以直接编辑本地仓库的 `.git/config` 文件来更改 `origin` 的 URL。找到 `[remote "origin"]` 部分，修改 `url` 行的内容。这种方法比较适合那些不熟悉命令行的人，但需要小心处理，以免破坏配置文件。

打开 `.git/config` 文件后，你会看到类似下面的内容：

```ini
[remote "origin"]
    url = 旧的URL
    fetch = +refs/heads/*:refs/remotes/origin/*
```

只需将 `url` 的值更改为新的 URL 即可。
