# [0033. 解决文件、目录发生变化时，vscode 卡死的问题](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0033.%20%E8%A7%A3%E5%86%B3%E6%96%87%E4%BB%B6%E3%80%81%E7%9B%AE%E5%BD%95%E5%8F%91%E7%94%9F%E5%8F%98%E5%8C%96%E6%97%B6%EF%BC%8Cvscode%20%E5%8D%A1%E6%AD%BB%E7%9A%84%E9%97%AE%E9%A2%98)

<!-- region:toc -->

- [1. 📒 文件重命名卡死的解决方案 - 将 Files Participants Timeout 配置为 0 即可](#1--文件重命名卡死的解决方案---将-files-participants-timeout-配置为-0-即可)
- [2. 📒 目录重命名卡死的解决方案 - Unlock with File Locksmith](#2--目录重命名卡死的解决方案---unlock-with-file-locksmith)

<!-- endregion:toc -->

## 1. 📒 文件重命名卡死的解决方案 - 将 Files Participants Timeout 配置为 0 即可

- 解决 vscode 重命名之后卡顿，提示正在运行“文件重命名“参与者。
- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-01-17-13-49-44.png)

## 2. 📒 目录重命名卡死的解决方案 - Unlock with File Locksmith

- 可以借助一个开源工具 [PowerToys](https://learn.microsoft.com/en-us/windows/powertoys/) 的 File Locksmith 来释放文件的锁。
  - 安装好 PowerToys 之后，将 File Locksmith 启用即可。
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-01-17-13-56-22.png)
- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-01-17-13-54-12.png)
