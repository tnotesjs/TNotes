import { exec } from 'child_process';
// import notesmeta from './.notesmeta.json' assert { type: 'json' }; // !ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
import fs from 'fs/promises';
import path from 'path';
import { __dirname } from './constants';


const notesmeta = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.notesmeta.json'), 'utf-8'));

const BASE_DIR = path.resolve(__dirname, '..', '..');
const repos = notesmeta.repos.map(name => `https://github.com/Tdahuyou/${name}.git`);

// #region get repos name
// https://github.com/Tdahuyou?tab=repositories
// 获取所有仓库名称的脚本：
// const names = []
// document.querySelectorAll('.wb-break-all').forEach(h3 => {
//     names.push(h3.getElementsByTagName('a')[0].innerText)
// })
// 将脚本复制到控制台，然后使用浏览器控制台执行即可。
// console.log(names)
// [
//     "canvas",
//     "electron",
//     "...",
// ]
// #endregion get repos name

async function cloneRepo(repoUrl) {
  const repoName = path.basename(repoUrl, '.git'); // 获取仓库名称
  const repoPath = path.join(BASE_DIR, repoName); // 构建完整路径

  try {
    // 检查目录是否已存在
    await fs.access(repoPath);
    console.log(`Repository ${repoName} already exists, skipping.`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // 如果目录不存在，则克隆仓库
      console.log(`Cloning ${repoUrl} into ${repoPath}...`);
      exec(`git clone ${repoUrl} ${repoPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error cloning ${repoUrl}:`, error);
          return;
        }
        console.log(stdout);
      });
    } else {
      console.error(`Error checking directory for ${repoName}:`, err);
    }
  }
}

// 克隆所有仓库
(async () => {
  // 遍历每个仓库 URL 并克隆
  for (const repo of repos) {
    await cloneRepo(repo);
  }
})();
