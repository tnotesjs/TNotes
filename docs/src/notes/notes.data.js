import fs from 'node:fs'

export default {
  watch: ['./*/README.md'],
  load(watchedFiles) {
    // watchFiles 是一个所匹配文件的绝对路径的数组。
    // 生成一个博客文章元数据数组
    // 可用于在主题布局中呈现列表。
    const notesData = {}
    watchedFiles.forEach((file) => {
      // console.log('file:', file)
      // file: docs/src/notes/canvas/README.md
      // file: docs/src/notes/electron/README.md
      // ...

      const title = file.split('/')[3] // notes title
      const fileContent = fs.readFileSync(file, 'utf-8')

      const allNotesID = getAllNotesID(fileContent)
      const allNotesLen = allNotesID.length

      const doneNotesID = getDoneNotesID(fileContent)
      const doneNotesLen = doneNotesID.length

      const pendingNotesID = getPendingNotesID(fileContent)
      const pendingNotesLen = pendingNotesID.length

      notesData[title] = {
        fileContent,
        allNotesID,
        allNotesLen,
        doneNotesID,
        doneNotesLen,
        pendingNotesID,
        pendingNotesLen,
      }
    })
    return notesData
  },
}

const NOTES_ID_TYPE = {
  PENDING: 'PENDING',
  DONE: 'DONE',
  ALL: 'ALL',
}

function getNotesID(type = NOTES_ID_TYPE.ALL, notesData) {
  if (type === NOTES_ID_TYPE.ALL) {
    const matches = notesData.match(/\b(\d{4})\./g)
    return matches
      ? [...new Set(matches.map((match) => match.replace('.', '')))]
      : []
  } else if (type === NOTES_ID_TYPE.DONE) {
    const matches = notesData.match(/- \[x\]\s\[(\d{4})\./g)
    return matches
      ? [...new Set(matches.map((match) => match.slice(-5, -1)))]
      : []
  } else if (type === NOTES_ID_TYPE.PENDING) {
    const matches = notesData.match(/- \[\s\]\s\[(\d{4})\./g)
    return matches
      ? [...new Set(matches.map((match) => match.slice(-5, -1)))]
      : []
  }
}

function getAllNotesID(notesData) {
  return getNotesID(NOTES_ID_TYPE.ALL, notesData)
}

function getPendingNotesID(notesData) {
  return getNotesID(NOTES_ID_TYPE.PENDING, notesData)
}

function getDoneNotesID(notesData) {
  return getNotesID(NOTES_ID_TYPE.DONE, notesData)
}
