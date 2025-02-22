# [0004. 处理每次使用 SSH 密钥进行身份验证时都需要输入密码短语（passphrase）的问题](https://github.com/Tdahuyou/git/tree/main/0004.%20%E5%A4%84%E7%90%86%E6%AF%8F%E6%AC%A1%E4%BD%BF%E7%94%A8%20SSH%20%E5%AF%86%E9%92%A5%E8%BF%9B%E8%A1%8C%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81%E6%97%B6%E9%83%BD%E9%9C%80%E8%A6%81%E8%BE%93%E5%85%A5%E5%AF%86%E7%A0%81%E7%9F%AD%E8%AF%AD%EF%BC%88passphrase%EF%BC%89%E7%9A%84%E9%97%AE%E9%A2%98)

<!-- region:toc -->
- [1. 📒 问题分析](#1--问题分析)
- [2. 💻 使用 `ssh-agent` 守护进程](#2--使用-ssh-agent-守护进程)
- [3. 💻 使用无密码短语的密钥](#3--使用无密码短语的密钥)
<!-- endregion:toc -->

## 1. 📒 问题分析

当你每次使用 SSH 密钥进行身份验证时都需要输入密码短语（passphrase），这是因为你的私钥被保护了，以增加安全性。如果你希望避免每次都输入密码短语，可以考虑以下几种方法：

- 使用 `ssh-agent`
- 使用无密码短语的密钥

请注意，虽然这些方法提高了便利性，但可能会降低一定的安全性。确保你了解这些风险，并根据你的安全需求做出适当的选择。

## 2. 💻 使用 `ssh-agent` 守护进程

`ssh-agent` 是一个守护进程，用于管理你的 SSH 密钥和密码短语。你可以将密钥添加到 `ssh-agent` 中，并在会话期间自动处理认证过程。

```bash
# 启动 `ssh-agent` 并添加密钥
# 首先，确保 `ssh-agent` 正在运行。你可以在终端中启动它：
eval "$(ssh-agent -s)"

# 然后，将你的私钥添加到 `ssh-agent` 中：

ssh-add -K ~/.ssh/id_rsa
# 如果你使用的是 ed25519 密钥，则为
ssh-add -K ~/.ssh/id_ed25519
# `-K` 参数会将密码短语保存到 macOS 的 Keychain 中，这样在重启后你也不需要重新输入密码短语。

# 自动启动 `ssh-agent`
# 为了确保 `ssh-agent` 在每次打开终端时都能自动启动，你可以将上面的命令添加到你的 shell 配置文件中（例如 `.bashrc`, `.zshrc` 或者 `.profile`）。
```

## 3. 💻 使用无密码短语的密钥

如果你不介意稍微降低安全性，可以选择生成一个新的没有密码短语的 SSH 密钥。这将允许你在没有任何提示的情况下使用该密钥。

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -N ""
# -N "" 表示不设置密码短语
```

然后将这个新的公钥添加到你的 GitHub 账户中，并更新本地 Git 配置来使用这个新密钥。

