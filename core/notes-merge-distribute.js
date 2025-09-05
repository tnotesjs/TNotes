import fs from 'fs'
import path from 'path'

import {
  EOL,
  MERGED_README_FILENAME,
  SEPERATOR
} from './constants.js'

function mergeReadme(baseDir, ignoreDirs) {
  const mergedReadmePath = path.resolve(baseDir, MERGED_README_FILENAME);
  
  const dirMap = {};
  const dirNameList = fs.readdirSync(baseDir);
  for (let dirName of dirNameList) {
    if (ignoreDirs.includes(dirName)) continue;
    const file_path = path.join(baseDir, dirName);
    const stats = fs.lstatSync(file_path);

    if (stats.isDirectory()) {
      const key = path.resolve(baseDir, dirName, 'README.md'); // key 是 readme 的绝对路径。
      const val = `# [README.md](./${dirName.replaceAll(' ', '%20')}/README.md)${SEPERATOR}`; // val 是本地 readme 的相对路径，也作为分隔符使用。
      dirMap[key] = val;
    }
  }

  let fileInfos = [];
  
  for (const key in dirMap) {
    try {
      let readmeContent = fs.readFileSync(key, 'utf8');
      fileInfos.push(`${dirMap[key]}${EOL}${readmeContent}${EOL}`);
    } catch (err) {
      console.error(`Failed to read or process ${key}:`, err);
    }
  }

  fs.writeFileSync(mergedReadmePath, fileInfos.join(EOL), 'utf8');
  console.log(`✅ ${mergedReadmePath} Generated successfully.`);
}

function distributeReadme(baseDir) {
  const mergedReadmePath = path.resolve(baseDir, MERGED_README_FILENAME);
  const mergedReadmeContent = fs.readFileSync(mergedReadmePath, 'utf8');
  const mergedReadmeSections = mergedReadmeContent.split(new RegExp(`.*${SEPERATOR}$`, 'gm')); // 按照分隔符切割为多个部分

  // console.log('mergedReadmeSections', mergedReadmeSections.slice(0, 3))

  mergedReadmeSections.filter(section => section !== '' && section !== EOL).forEach((section) => {
    // console.log('section =>', section);

    let lines = section.split(EOL);
    const titleLineIndex = lines.findIndex(line => line.startsWith('# '));
    
    const linkMatch = lines[titleLineIndex].match(/\[(.*?)\]\((.*?)\)/);
    if (!linkMatch) {
      console.error(`Invalid section: ${titleLine}`);
      return;
    }

    const readmePath = path.resolve(baseDir, linkMatch[1], 'README.md');
    // console.log(linkMatch[1], readmePath)
    // linkMatch[1] 是笔记的标题，也是某篇笔记所属的目录的名称。

    // 写入更新后的内容
    try {
      fs.writeFileSync(readmePath, lines.splice(titleLineIndex).join(EOL), 'utf8');
      console.log(`"✅ ${readmePath}" updated successfully.`);
    } catch (err) {
      console.error(`"❌ ${readmePath}" failed to write:`, err);
    }
  });

  console.log('✅ All README.md files have been updated.');
}

export {
  mergeReadme,
  distributeReadme,
};
