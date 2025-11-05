import fs from 'fs'
import { ROOT_CONFIG_PATH } from '../../scripts/constants.ts'

export default {
  watch: ['../../sidebars/**/sidebar.json'],
  load(watchedFiles) {
    const rootData = {
      sidebars: {},
      config: {},
    }
    watchedFiles.map((file) => {
      const repoName = file.split('/')[1]
      let sidebar = JSON.parse(fs.readFileSync(file, 'utf-8'))

      // 递归处理 sidebar 中的链接，处理空格问题
      const processSidebarItems = (items) => {
        if (!items || !Array.isArray(items)) return items

        return items.map((item) => {
          // 处理当前项目的链接
          if (item.link && typeof item.link === 'string') {
            // 将链接中的空格替换为 %20
            item.link = item.link.replace(/ /g, '%20')
          }

          // 递归处理子项目
          if (item.items && Array.isArray(item.items)) {
            item.items = processSidebarItems(item.items)
          }

          return item
        })
      }

      // 处理整个 sidebar 数据
      sidebar = sidebar.map((section) => {
        if (section.items && Array.isArray(section.items)) {
          section.items = processSidebarItems(section.items)
        }
        return section
      })

      rootData.sidebars[repoName] = sidebar
    })
    rootData.config = JSON.parse(fs.readFileSync(ROOT_CONFIG_PATH, 'utf-8'))
    return rootData
  },
}
