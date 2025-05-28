# [0043. 在 macOS 上通过 brew 安装 mysql](https://github.com/Tdahuyou/TNotes.mysql/tree/main/notes/0043.%20%E5%9C%A8%20macOS%20%E4%B8%8A%E9%80%9A%E8%BF%87%20brew%20%E5%AE%89%E8%A3%85%20mysql)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📝 概述

- `brew install mysql`
- 如果是 `macOS 15.x.x` 那么可能会出现如下错误：
  - `Error: unknown or unsupported macOS version: :dunno`
  - 因为 `macOS 15.x.x` 是一个预览版本，，而 Homebrew 尚未正式支持这个版本。

```bash
$ brew install mysql
# Warning: You are using macOS 15.
# We do not provide support for this pre-release version.
# It is expected behaviour that some formulae will fail to build in this pre-release version.
# It is expected behaviour that Homebrew will be buggy and slow.
# Do not create any issues about this on Homebrew's GitHub repositories.
# Do not create any issues even if you think this message is unrelated.
# Any opened issues will be immediately closed without response.
# Do not ask for help from Homebrew or its maintainers on social media.
# You may ask for help in Homebrew's discussions but are unlikely to receive a response.
# Try to figure out the problem yourself and submit a fix as a pull request.
# We will review it but may or may not accept it.
#
# Error: unknown or unsupported macOS version: :dunno
```
