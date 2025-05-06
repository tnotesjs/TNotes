# [0007. 一个项目多个 .gitignore 文件](https://github.com/Tdahuyou/TNotes.git-notes/tree/main/notes/0007.%20%E4%B8%80%E4%B8%AA%E9%A1%B9%E7%9B%AE%E5%A4%9A%E4%B8%AA%20.gitignore%20%E6%96%87%E4%BB%B6)

<!-- region:toc -->

- [1. 📒 在一个项目中可以有多个 .gitignore 文件](#1--在一个项目中可以有多个-gitignore-文件)

<!-- endregion:toc -->
- 一个项目中可以有多个 `.gitignore` 文件，但通常只需要一个位于根目录下就足够了。如果有特殊情况需要更细粒度地控制不同目录下的忽略规则，那么可以在相应的子目录下添加 `.gitignore` 文件。

## 1. 📒 在一个项目中可以有多个 .gitignore 文件

- 在一个 Git 项目中，通常在项目的根目录会有一个 `.gitignore` 文件，用来指定哪些文件或目录不应该被 Git 跟踪。然而，**Git 也支持在子目录中使用额外的 `.gitignore` 文件。**
- 当你在子目录中创建一个新的 `.gitignore` 文件时，它将应用于该子目录及其所有子目录中的文件。也就是说，**Git 会检查从工作树的根到每个文件路径上的每一个目录，并应用沿途遇到的所有 `.gitignore` 文件中的模式。因此，一个项目可以有多个 `.gitignore` 文件，它们共同决定哪些文件应该被忽略。**
- 不过需要注意的是，全局的 `.gitignore` 文件（如果有的话）和 `.git/info/exclude` 文件也会对整个仓库生效。这些文件用于定义对所有仓库用户都适用的忽略规则，而不需要将这些规则提交到仓库中。
