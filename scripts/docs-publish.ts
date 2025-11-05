import path from 'path'
import { __dirname } from './constants.ts'
import { syncLocalAndRemote } from './utils.ts'

;(async () => {
  await syncLocalAndRemote(path.join(__dirname, '..'))
})()
