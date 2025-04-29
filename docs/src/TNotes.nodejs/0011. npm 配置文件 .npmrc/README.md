# [0011. npm 配置文件 .npmrc](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0011.%20npm%20%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%20.npmrc)


<!-- region:toc -->

- [1. 📝 npmrc 全称](#1--npmrc-全称)
- [2. 🤖 请介绍一下 .npmrc 文件](#2--请介绍一下-npmrc-文件)
  - [2.1. 常见配置项](#21-常见配置项)
  - [2.2. 示例](#22-示例)
    - [2.2.1. 项目级别的 `.npmrc`](#221-项目级别的-npmrc)
    - [2.2.2. 用户级别的 `.npmrc`](#222-用户级别的-npmrc)
    - [2.2.3. 全局级别的 `.npmrc`](#223-全局级别的-npmrc)
  - [2.3. 优先级](#23-优先级)
  - [2.4. 查看当前配置](#24-查看当前配置)
  - [2.5. 总结](#25-总结)
- [3. 🤖 rc 是什么单词的缩写？](#3--rc-是什么单词的缩写)
  - [3.1. 常见的 `.rc` 文件](#31-常见的-rc-文件)
  - [3.2. 用途](#32-用途)
  - [3.3. 具体到 `.npmrc`](#33-具体到-npmrc)
  - [3.4. 总结](#34-总结)

<!-- endregion:toc -->

## 1. 📝 npmrc 全称

npmrc 全称 node package manager runtime configuration file。

.npmrc 文件，表示 node 包管理器的运行时配置文件。

## 2. 🤖 请介绍一下 .npmrc 文件

`.npmrc` 文件是 npm 的配置文件，用于存储 npm 的各种配置选项。这个文件可以存在于多个位置，每个位置的优先级不同，具体如下：

1. **项目级别的 `.npmrc`**:
   - 位于项目的根目录下。
   - 只对当前项目有效。
   - 通常用于设置特定于项目的配置，例如私有仓库的认证信息、代理设置等。

2. **用户级别的 `.npmrc`**:
   - 位于用户的主目录下（例如 `C:\Users\DELL\.npmrc` 或 `~/.npmrc`）。
   - 对该用户的所有 npm 操作生效。
   - 通常用于设置全局的 npm 配置，例如 registry、代理设置等。

3. **全局级别的 `.npmrc`**:
   - 位于 npm 的全局配置目录下（例如 `C:\Users\DELL\AppData\Roaming\npm\etc\npmrc` 或 `/usr/local/etc/npmrc`）。
   - 对所有用户和所有项目生效。
   - 通常由系统管理员设置，用于管理全局的 npm 配置。

### 2.1. 常见配置项

以下是一些常见的 `.npmrc` 配置项及其用途：

- **registry**:
  - 设置 npm 包的注册表地址。
  - 例如：`registry=https://registry.npmjs.org/`

- **proxy** 和 **https-proxy**:
  - 设置 HTTP 和 HTTPS 代理服务器。
  - 例如：
    ```ini
    proxy=http://your-proxy-url:port
    https-proxy=http://your-proxy-url:port
    ```

- **strict-ssl**:
  - 控制是否强制使用 SSL 证书进行验证。
  - 例如：`strict-ssl=false`

- **save-exact**:
  - 控制 `npm install --save` 是否保存精确的版本号。
  - 例如：`save-exact=true`

- **engine-strict**:
  - 控制是否严格检查 Node.js 版本。
  - 例如：`engine-strict=true`

- **auth** 和 **_authToken**:
  - 用于设置私有仓库的认证信息。
  - 例如：
    ```ini
    //registry.npmjs.org/:_authToken=your-auth-token
    ```

- **always-auth**:
  - 控制是否总是发送认证信息。
  - 例如：`always-auth=true`

- **cache**:
  - 设置 npm 缓存目录的位置。
  - 例如：`cache=C:\path\to\custom\cache`

### 2.2. 示例

#### 2.2.1. 项目级别的 `.npmrc`
假设你在项目根目录下有一个 `.npmrc` 文件，内容如下：

```ini
# 使用淘宝镜像
registry=https://registry.npm.taobao.org/

# 设置代理
proxy=http://your-proxy-url:port
https-proxy=http://your-proxy-url:port

# 不强制使用 SSL 证书
strict-ssl=false
```

#### 2.2.2. 用户级别的 `.npmrc`
假设在你的用户主目录下有一个 `.npmrc` 文件，内容如下：

```ini
# 全局使用淘宝镜像
registry=https://registry.npm.taobao.org/

# 设置全局代理
proxy=http://your-proxy-url:port
https-proxy=http://your-proxy-url:port

# 保存精确的版本号
save-exact=true
```

#### 2.2.3. 全局级别的 `.npmrc`
假设在全局配置目录下有一个 `.npmrc` 文件，内容如下：

```ini
# 全局使用默认的 npm 注册表
registry=https://registry.npmjs.org/

# 设置全局代理
proxy=http://your-proxy-url:port
https-proxy=http://your-proxy-url:port

# 严格检查 Node.js 版本
engine-strict=true
```

### 2.3. 优先级

配置项的优先级从高到低依次为：

1. 命令行参数
2. 环境变量
3. 项目级别的 `.npmrc`
4. 用户级别的 `.npmrc`
5. 全局级别的 `.npmrc`
6. npm 内置的默认值

### 2.4. 查看当前配置

你可以使用以下命令来查看当前的 npm 配置：

```sh
npm config list
```

这将列出所有当前生效的配置项及其来源。

### 2.5. 总结

`.npmrc` 文件是一个非常强大的工具，可以帮助你自定义和管理 npm 的行为。通过正确配置 `.npmrc` 文件，你可以优化开发环境，解决网络问题，并提高开发效率。如果你遇到配置问题，可以通过检查这些文件来找到并解决问题。

## 3. 🤖 rc 是什么单词的缩写？

`rc` 是 "run commands" 或 "runtime configuration" 的缩写，通常用于表示配置文件。在 Unix 和类 Unix 系统（如 Linux 和 macOS）中，许多应用程序使用以 `.rc` 结尾的文件来存储配置信息。这种命名约定已经广泛应用于各种工具和软件中。

### 3.1. 常见的 `.rc` 文件
- **.bashrc**：Bash shell 的配置文件。
- **.vimrc**：Vim 文本编辑器的配置文件。
- **.npmrc**：npm 的配置文件。
- **.gitconfig** 或 `.gitrc`：Git 的配置文件。
- **.zshrc**：Zsh shell 的配置文件。

### 3.2. 用途
这些配置文件通常包含启动时需要执行的命令、环境变量设置、别名定义等。例如：

- **.bashrc** 可能包含用户自定义的 shell 别名、函数和环境变量。
- **.vimrc** 可能包含 Vim 的插件配置、快捷键映射和编辑器设置。
- **.npmrc** 包含 npm 的注册表地址、代理设置、认证信息等。

### 3.3. 具体到 `.npmrc`
对于 `.npmrc` 文件，`rc` 代表 "runtime configuration"，即运行时配置。这个文件用于存储 npm 的各种配置选项，以便自定义 npm 的行为，如设置注册表地址、代理服务器、认证信息等。

### 3.4. 总结
`rc` 是 "run commands" 或 "runtime configuration" 的缩写，通常用于表示配置文件。`.npmrc` 文件是 npm 的配置文件，用于存储和管理 npm 的各种配置选项。
