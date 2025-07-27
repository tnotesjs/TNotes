import fs from 'fs'
import { ROOT_CONFIG_PATH } from '../../../core/constants.js'

export default {
  watch: ['../../../sidebars/**/sidebar.json'],
  load(watchedFiles) {
    const rootData = {
      sidebars: {},
      config: {},
    }
    watchedFiles.map((file) => {
      const repoName = file.split('/')[1]
      const sidebar = JSON.parse(fs.readFileSync(file, 'utf-8'))
      rootData.sidebars[repoName] = sidebar
    })
    rootData.config = JSON.parse(fs.readFileSync(ROOT_CONFIG_PATH, 'utf-8'))
    // console.log('root.data', watchedFiles)
    return rootData
  },
}
