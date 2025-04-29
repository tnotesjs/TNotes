# [0012. 使用 nrm 管理 npm 源](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0012.%20%E4%BD%BF%E7%94%A8%20nrm%20%E7%AE%A1%E7%90%86%20npm%20%E6%BA%90)


<!-- region:toc -->

- [1. 📒 使用 nrm 管理 npm 源](#1--使用-nrm-管理-npm-源)
- [2. 🤖 npm 都有哪些常用的镜像源？](#2--npm-都有哪些常用的镜像源)

<!-- endregion:toc -->

## 1. 📒 使用 nrm 管理 npm 源

为了更方便地切换不同的 npm 源，你可以使用 `nrm` 工具。`nrm` 是一个 npm 源管理工具，可以让你快速切换 npm 的镜像源。

- **安装 nrm**:
```bash
npm install -g nrm
```

- **列出所有可用的源**:
```bash
nrm ls
# 输出内容：
#   npm ---------- https://registry.npmjs.org/
#   yarn --------- https://registry.yarnpkg.com/
#   tencent ------ https://mirrors.cloud.tencent.com/npm/
# * cnpm --------- https://r.cnpmjs.org/
#   taobao ------- https://registry.npmmirror.com/
#   npmMirror ---- https://skimdb.npmjs.com/registry/
#   huawei ------- https://repo.huaweicloud.com/repository/npm/
```

- **切换到某个源**:
```bash
nrm use taobao  # 切换到淘宝镜像
nrm use tencent  # 切换到腾讯镜像
nrm use npm  # 切换回官方源
```

- **添加自定义源**:
```bash
nrm add <name> <url>
```

- **测试源的速度**:
```bash
nrm test <name>
# 示例

# nrm test cnpm
# * cnpm ---- 1819 ms

# nrm test taobao
#   taobao ---- 137 ms

# nrm test tencent
#   tencent ---- 556 ms

# nrm test npm
#   npm ---- timeout (Fetch timeout over 5000 ms)

# nrm test huawei
#   huawei ---- 333 ms
```

通过使用这些镜像源或 `nrm` 工具，你可以根据需要选择最快的 npm 源，从而提高开发效率。如果你遇到某个镜像源的问题，比如证书过期，可以尝试切换到其他镜像源。

## 2. 🤖 npm 都有哪些常用的镜像源？

在中国，由于网络环境的特殊性，访问官方 npm 源（`https://registry.npmjs.org/`）可能会比较慢。因此，很多开发者会选择使用国内的 npm 镜像源来加速包的下载速度。以下是一些常用的 npm 镜像源：

1. **淘宝 npm 镜像** (cnpm):
   - 这是国内最常用的 npm 镜像之一。
   - URL: `https://registry.npm.taobao.org/`
   - 切换命令:
     ```bash
     npm config set registry https://registry.npm.taobao.org/
     ```

2. **腾讯 npm 镜像**:
   - 腾讯提供的 npm 镜像服务。
   - URL: `https://mirrors.cloud.tencent.com/npm/`
   - 切换命令:
     ```bash
     npm config set registry https://mirrors.cloud.tencent.com/npm/
     ```

3. **华为 npm 镜像**:
   - 华为云提供的 npm 镜像服务。
   - URL: `https://repo.huaweicloud.com/repository/npm/`
   - 切换命令:
     ```bash
     npm config set registry https://repo.huaweicloud.com/repository/npm/
     ```

4. **京东 npm 镜像**:
   - 京东提供的 npm 镜像服务。
   - URL: `https://registry.npmmirror.com/`
   - 切换命令:
     ```bash
     npm config set registry https://registry.npmmirror.com/
     ```

5. **苏宁 npm 镜像**:
   - 苏宁提供的 npm 镜像服务。
   - URL: `https://npm.suning.com/`
   - 切换命令:
     ```bash
     npm config set registry https://npm.suning.com/
     ```

6. **阿里云 npm 镜像**:
   - 阿里云提供的 npm 镜像服务。
   - URL: `https://registry.npm.alibaba-inc.com/`
   - 切换命令:
     ```bash
     npm config set registry https://registry.npm.alibaba-inc.com/
     ```

7. **官方 npm 源**:
   - 官方 npm 源是默认的源，但在中国访问可能较慢。
   - URL: `https://registry.npmjs.org/`
   - 切换命令:
     ```bash
     npm config set registry https://registry.npmjs.org/
     ```
