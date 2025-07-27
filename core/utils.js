import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

async function runCommand(command, dir) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: dir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`处理 ${dir} 时出错：${stderr}`);
        reject(error);
      } else {
        // console.log(stdout.trim());
        resolve(stdout.trim());
      }
    });
  });
}

async function syncLocalAndRemote(dir) {
  try {
    // 确保是 Git 仓库
    const isGitRepo = await runCommand("git rev-parse --is-inside-work-tree", dir).catch(() => false);
    if (!isGitRepo) {
      throw new Error(`${dir} 不是一个有效的 Git 仓库。`);
    }

    // #region pull 之前的预处理 - 策略一 stash
    // 处理未暂存更改
    const statusOutput = await runCommand("git status --porcelain", dir);
    if (statusOutput) {
      console.log(`${dir} 存在未暂存的更改，先 stash...`);
      await runCommand("git stash", dir);
    }
    
    // 拉取远程更新
    await runCommand("git pull --rebase", dir);
    
    // 恢复 stash 的更改
    if (statusOutput) {
      console.log(`${dir} 取回之前的更改`);
      await runCommand("git stash pop", dir);
    }
    // #endregion pull 之前的预处理 - 策略一 stash

    
    
    // #region pull 之前的预处理 - 策略二 commit
    // 在 git pull 之前先暂存并提交未提交的更改
    // 弊端：每次一旦有变更，都会预先 commit 一次。策略一则是先 stash，git stash 不会创建新的提交记录，只是临时保存更改，适用你不想立即提交更改的情况。
    // await runCommand("git add .", dir);
    // await runCommand('git commit -m "auto commit before pull"', dir);
    // await runCommand("git pull --rebase", dir);
    // #region pull 之前的预处理 - 策略二 commit


    // 再次检查是否有未提交的更改
    const newStatus = await runCommand("git status --porcelain", dir);
    if (!newStatus) {
      console.log(`${dir} 没有新的更改，跳过提交`);
      return;
    }

    // 提交并推送
    await runCommand("git add .", dir);
    const changedFiles = newStatus.split("\n").length;
    await runCommand(`git commit -m "update: ${changedFiles} files modified"`, dir);
    await runCommand("git push", dir);

    // 获取远程 URL
    const url = await runCommand("git remote -v", dir);
    const remoteMatch = url.match(/https:\/\/[^\s]+|git@[^:\s]+:[^\s]+/);
    console.log(`✅ 笔记同步完成 ${remoteMatch ? remoteMatch[0] : "（无法解析远程 URL）"}`);
  } catch (error) {
    console.error(`处理 ${dir} 时出错：${error.message}`);
  }
}

async function initPkg(baseDir, repoName) {
  // 检查 package.json 是否存在
  const pkgPath = path.resolve(baseDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkgContent = fs.readFileSync(pkgPath, { encoding: "utf8" });
      let pkg = JSON.parse(pkgContent);
      pkg = sortObjectKeys(pkg);
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      return pkg;
    } catch (error) {
      console.error(`❌ Error reading or parsing package.json: ${error.message}`);
      return {};
    }
  }

  // 将默认配置写入 package.json
  const defaultPkg = {
      "scripts": {
          "sync": `            node ./node_modules/tnotes   --syncREADME          --repoName=${repoName}`,
          "update": `          node ./node_modules/tnotes   --updateREADME        --repoName=${repoName}`,
          "merge": `           node ./node_modules/tnotes   --mergeREADME         --repoName=${repoName}`,
          "distribute": `      node ./node_modules/tnotes   --distributeREADME    --repoName=${repoName}`,
          "docs:publish": `    node ./node_modules/tnotes/scripts/docs-publish.js`
      },
      "tnotesConfig": {
        "dirList": {}
      }
  };
  fs.writeFileSync(pkgPath, JSON.stringify(defaultPkg, null, 2));
  await runCommand("npm link tnotes", baseDir); // 链接 tnotes 库到当前笔记目录
  return defaultPkg;
}

function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) return obj.map(sortObjectKeys);

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj = {};
  for (const key of sortedKeys) sortedObj[key] = sortObjectKeys(obj[key]);

  return sortedObj;
}

function parseTnotesConfig(pkg) {
  const dirListEntries = Object.entries(pkg.tnotesConfig.dirList || {});
  const ignoreDirs = dirListEntries.map(([ID, config]) => config.ignore ? ID : '').filter(id => !!id);
  const doneNoteIds = dirListEntries.map(([ID, config]) => config.done ? ID : '').filter(id => !!id);
  const bilibiliMap = dirListEntries.map(([ID, config]) => {
    if (config.bilibili && config.bilibili.length > 0) {
      return { id: ID, bilibili: config.bilibili }
    } else {
      return null;
    }
  }).filter(item => !!item);

  return {
    ignoreDirs,
    doneNoteIds,
    bilibiliMap
  }
}

export {
    syncLocalAndRemote,
    initPkg,
    parseTnotesConfig
};