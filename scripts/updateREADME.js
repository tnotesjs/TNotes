/**
 * - 更新 home README 目录
 * - 更新 note README 目录
 * - 目录编号自动更新
 * - 读取笔记头部信息，更新 home README
 * - 自动将 notes 推送到 TNotes 中
 */
import fs from 'fs';
import path, { dirname } from 'path';

// !ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
// import notesmeta from './.notesmeta.json' assert { type: 'json' };

import GithubSlugger from 'github-slugger'; // doc: https://www.npmjs.com/package/github-slugger
import { __dirname } from './constants.js';

const notesmeta = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.notesmeta.json'), 'utf-8'));

const slugger = new GithubSlugger();

class ReadmeUpdater {
  constructor({repoName, baseDir, ignoreDirs, doneNoteIds, bilibiliMap}) {
    this.repoName = repoName;
    this.baseDir = baseDir;
    // fs.readdirSync(path.resolve(this.baseDir, 'notes.mata.json'), { encoding: 'utf8' });
    
    this.githubUsername = notesmeta.github_username;
    this.ignoreDirs = ignoreDirs || [];
    this.doneNoteIds = doneNoteIds || [];
    this.bilibiliMap = bilibiliMap || {};
    this.bilibiliVideoBaseUrl = "https://www.bilibili.com/video/";
    this.repoUrl = `https://github.com/${this.githubUsername}/${repoName}/tree/main`;
    this.repoBolbUrl = `https://raw.githubusercontent.com/${this.githubUsername}/${repoName}/main`; // for renderer img

    this.notes = {
      map: {}, // key 是笔记 ID，值是笔记的头部信息。
      ids: new Set(), // 笔记目录中存在的笔记的 id 列表。
      dirNameList: this.getNoteDirNameList(), // 需要处理的笔记目录名称列表。
    };

    const __vitepressBasedir = path.normalize(path.resolve(__dirname, "..", "docs", "src", 'notes'));
    this.vitepress = {
      baseDir: __vitepressBasedir,
      homeReadmePath: path.normalize(path.resolve(__vitepressBasedir, this.repoName, `README.md`)),
      githubPageUrl: `https://tdahuyou.github.io/notes/notes/${this.repoName}`
    }

    this.homeReadme = {
      path: path.normalize(path.resolve(this.baseDir, "README.md")),
      contents: "",
      lines: [],
      titles: [], // [ '# svg', '## 1. 词库', '## 2. svg 在线免费教程', '## 3. svg 起步', ... ]
      titlesNotesCount: [], // [ 0, 1, 0, 10, ... ]
      // sidebarJson: {
      //   text: this.repoName,
      //   link: `/notes/${this.repoName}/README`,
      //   collapsed: true,
      //   items: [],
      // },
      noteTitleReg: /(\s*-\s*\[\s*x?\s*\]\s*)(\[?)(\d{4})(.*)/,
      ids: new Set(), // 存在于 Home Readme 中的笔记 id 集合。（去重）
      idList: [], // 存在于 Home Readme 中的笔记 id 集合。（未去重，id 按照出现的先后次序排序。）
    };

    this.toc = {
      startTag: "<!-- region:toc -->",
      endTag: "<!-- endregion:toc -->",
    };

    this.EOL = "\n";
  }

  /**
   * 获取笔记目录列表
   * 笔记目录的判定逻辑 - 确保是目录，并且目录名称开头的 4 个字符是数字。
   * @returns {Array} 笔记目录列表
   */
  getNoteDirNameList() {
    const noteDirList = [];
    const dirNameList = fs.readdirSync(this.baseDir);

    for (let dirName of dirNameList) {
      if (this.ignoreDirs.includes(dirName)) continue;
      const dirPath = path.join(this.baseDir, dirName);
      const stats = fs.lstatSync(dirPath);
      if (stats.isDirectory() && dirName.match(/^\d{4}/))
        noteDirList.push(dirName);
    }

    return noteDirList;
  }

  /**
   * 解析笔记目录下的 README.md 文件
   * - 更新笔记标题。
   * - 更新笔记目录。
   * - 提取笔记的头部信息（也就是目录）。
   * - 将头部信息中的静态资源（比如图片）的路径或者锚点修改为 GitHub 上对应的绝对路径，确保在 home readme 中点击链接能够正常跳转。
   */
  parseNoteContent() {
    const SEPARATOR_LEVEL_2 = "## ";
    for (let noteDirName of this.notes.dirNameList) {
      const noteID = noteDirName.slice(0, 4); // 取前 4 个字符作为笔记 ID
      const notePath = path.resolve(this.baseDir, noteDirName, "README.md");
      const noteTitle = `# [${noteDirName}](${this.repoUrl}/${encodeURIComponent(noteDirName)})`;
      if (!fs.existsSync(notePath)) {
        fs.writeFileSync(notePath, this.genDefaultNoteTemp(noteTitle), "utf8");
      };
      const lines = fs.readFileSync(notePath, "utf8").split(this.EOL);

      // 更新笔记标题。
      lines[0] = noteTitle;

      // 更新笔记目录。
      this.updateNoteToc(noteID, lines);
      fs.writeFileSync(notePath, lines.join(this.EOL), "utf8");

      let firstHeading2Index = -1;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].startsWith(SEPARATOR_LEVEL_2)) {
          firstHeading2Index = i;
          break;
        }
      }
      let topInfoLines =
        firstHeading2Index > 0
          ? lines.slice(1, firstHeading2Index)
          : lines.slice(1);

      topInfoLines = topInfoLines.map((line) => {
        return line.replace(/!?\[(.*?)\]\((.*?)\)/g, (match, p1, p2) => {
          // 检查路径是否以 https:// 或者 http:// 开头
          if (/^https?:\/\//.test(p2)) {
            // 外部链接
            return match;
          } else if (/^#.?/.test(p2)) {
            // anchor
            return `[${p1}](${this.repoUrl}/${encodeURIComponent(
              noteDirName
            )}/README.md${p2})`;
          } else {
            // 判断是否是图片引用
            const isImage = match.startsWith("![");
            const prefix = isImage ? "![" : "[";
            const suffix = isImage ? "]" : "]";
            const baseUrl = isImage ? this.repoBolbUrl : this.repoUrl;
            return `${prefix}${p1}${suffix}(${baseUrl}/${encodeURIComponent(
              noteDirName
            )}/${encodeURIComponent(p2)})`;
          }
        });
      });

      // 每一行增加俩空格的缩进
      topInfoLines = topInfoLines.map((line) => `  ${line}`);
      // 删除 toc startTag 和 endTag
      topInfoLines = topInfoLines.filter(
        (line) => !line.includes(this.toc.startTag) && !line.includes(this.toc.endTag)
      );
      // console.log('topInfoLines:', topInfoLines);

      // 以 notes ID 作为 key，初始化 notes map，value 为笔记头部信息。
      this.notes.map[noteID] = `[${noteDirName}](${
        this.repoUrl
      }/${encodeURIComponent(
        noteDirName
      )}/README.md) <!-- [locale](./${encodeURIComponent(
        noteDirName
      )}/README.md) -->${topInfoLines.join(this.EOL)}${this.EOL}`;
      this.notes.ids.add(noteID); // 初始化未匹配集合
    }
  }

  /**
   * 当某篇笔记目录下没有 README.md 文件时，按照模板构建一个默认的 README.md 文件。
   * @param {string} noteTitle 笔记标题行
   * @returns 构建的默认笔记模板
   */
  genDefaultNoteTemp(noteTitle) {
    return `${noteTitle}${this.EOL}${this.EOL}${this.toc.startTag}${this.EOL}${this.EOL}${this.toc.endTag}${this.EOL}${this.EOL}## ⏰`;
  }

  removeHomeTopInfos() {
    const lines = this.homeReadme.contents.split(this.EOL);
    let result = [];

    let deleteMode = false;

    const headers = ["# ", "## ", "### ", "#### ", "##### ", "###### "];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(this.homeReadme.noteTitleReg)) {
        // 遇到笔记标题，进入删除模式。
        deleteMode = true;
        result.push(line);
        continue;
      }

      if (headers.some((header) => line.startsWith(header))) {
        // 遇到非笔记标题，停止删除。
        deleteMode = false;
        result.push(line);
        continue;
      }

      if (!deleteMode) result.push(line);
    }

    return result;
  }

  setHomeTopInfos() {
    // console.log('this.notes.map:', this.notes.map);
    this.homeReadme.lines.forEach((line, index) => {
      const match = line.match(this.homeReadme.noteTitleReg);
      if (match) {
        const noteID = match[3];
        this.homeReadme.ids.add(noteID);
        this.homeReadme.idList.push(noteID);
        if (noteID in this.notes.map) {
          let prefixSymbol = match[1];
          if (this.doneNoteIds.includes(noteID)) {
            prefixSymbol = prefixSymbol.replace('[ ]', '[x]');
          } else {
            prefixSymbol = prefixSymbol.replace('[x]', '[ ]');
          }
          this.homeReadme.lines[index] = `${prefixSymbol}${this.notes.map[noteID]}`;
        }
      }
    });
  }

  /**
   * 打印不存在的笔记 ID
   * 存在于首页 README 中的笔记 ID 但是不存在与实际仓库中的笔记 ID。
   */
  printMissingNotes() {
    const missingNoteIds = [...this.homeReadme.ids].filter(
      (noteID) => !this.notes.ids.has(noteID)
    );
    missingNoteIds.forEach((noteID) => {
      console.log(`${this.repoName}.${noteID} - 笔记不存在`);
    });
  }

  /**
   * - 处理未分配到首页 README 中的笔记
   * - 打印存在于实际仓库中的笔记 ID 但是不存在于首页 README 中的笔记 ID，并将其追加到首页 README 的末尾。
   */
  handleUnassignedNotes() {
    const unassignedNoteIds = [...this.notes.ids].filter(
      (noteID) => !this.homeReadme.ids.has(noteID)
    );

    if (unassignedNoteIds.length > 0) {
      console.log(
        `${this.repoName} 存在未分组的笔记：${[...unassignedNoteIds].join(
          ", "
        )}`
      );
      const unassignedNotesSection =
        "\n\n## ⏰ 待分组\n\n" +
        [...unassignedNoteIds]
          .map((noteId) => `- [ ] ${this.notes.map[noteId]}`)
          .join(this.EOL);
      this.homeReadme.lines.push(unassignedNotesSection);
    }
  }

  updateNoteToc(id = '', contents = '') {
    this.updateToc({ id, lines: contents });
  }

  updateHomeToc(contents = '') {
    this.updateToc({ lines: contents, isHome: true });
  }

  updateToc({
    id = '', // 如果是处理非 homeReadme，则需要具体的笔记 id。
    lines = '', // required
    isHome = false, // 是否是处理 homeReadme
  }) {
    let startLineIdx = -1,
      endLineIdx = -1;
    lines.forEach((line, idx) => {
      if (line.startsWith(this.toc.startTag)) startLineIdx = idx;
      if (line.startsWith(this.toc.endTag)) endLineIdx = idx;
    });
    if (startLineIdx === -1 || endLineIdx === -1) return;

    // 收集标题，并更新编号。
    const titles = isHome ? this.homeReadme.titles : [];
    const headers = ["## ", "### ", "#### ", "##### ", "###### "]; // 2~6 级标题，忽略 1 级标题。
    if (isHome) headers.push("# "); // homeReadme 处理标题范围 1~6；非 homeReadme 处理标题范围 2~6。
    const titleNumbers = Array(7).fill(0); // 用于存储每个级别的编号
    let notesCount = 0; // 统计每个标题下的直属笔记数量
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isHeader = headers.some((header) => line.startsWith(header));
      const match = line.match(this.homeReadme.noteTitleReg);
      if (isHeader) {
        if (isHome) {
          this.homeReadme.titlesNotesCount.push(notesCount);
          notesCount = 0;
        }
        const [numberedTitle, plainTitle] = addNumberToTitle(
          line,
          titleNumbers
        );
        titles.push(numberedTitle);
        lines[i] = numberedTitle; // 更新原行内容
        // console.log('lines[i] =>', numberedTitle)
      } else if (isHome && match) {
        // const noteID = match[3];
        notesCount++;
      }
    }
    if (isHome) {
      this.homeReadme.titlesNotesCount.push(notesCount);
      notesCount = 0;
      this.homeReadme.titlesNotesCount.splice(0, 1);
    }

    const toc = generateToc(titles, this.EOL);
    // console.log('toc =>', toc);

    let bilibiliUrl = '';
    // let BilibiliOutsidePlayerCompStr = '';
    if (!isHome) {
      const bilibiliTarget = this.bilibiliMap.find(item => item.id === id);
      // console.log('bilibiliTarget =>', bilibiliTarget);
      if (bilibiliTarget) {
        bilibiliUrl = bilibiliTarget.bilibili.map((bvid, i) => `[bilibili.${this.repoName}.${id}.${i + 1}](${this.bilibiliVideoBaseUrl + bvid})`).join('、');
        bilibiliUrl = `- ${bilibiliUrl}`;
        // BilibiliOutsidePlayerCompStr = bilibiliTarget.bilibili.map((bvid, i) => `<BilibiliOutsidePlayer id="${bvid}" />`).join(this.EOL);
      }
    }
    // console.log('bilibiliUrl =>', bilibiliUrl);

    if (bilibiliUrl) {
      lines.splice(
        startLineIdx + 1,
        endLineIdx - startLineIdx - 1,
        // BilibiliOutsidePlayerCompStr,
        this.EOL,
        bilibiliUrl,
        ...toc.split(this.EOL)
      );
    } else {
      lines.splice(
        startLineIdx + 1,
        endLineIdx - startLineIdx - 1,
        ...toc.split(this.EOL)
      );
    }
  

    // 生成 toc
    function generateToc(titles, EOL) {
      const toc = titles
        .map((title) => {
          const level = title.indexOf(" ");
          const text = title.slice(level).trim();
          const anchor = generateAnchor(text);
          const baseLevel = isHome ? 1 : 2;
          return (
            " ".repeat((level - baseLevel) * 2) + `- [${text}](#${anchor})`
          );
        })
        .join(EOL);

      // !NOTE anchor 点击后会刷新页面。
      // const tocUrl = titles.map(title => {
      //   const level = title.indexOf(' ');
      //   const text = title.slice(level).trim();
      //   const anchor = text.toLowerCase().replace(/\s/g, '-');
      //   return ' '.repeat((level - 1) * 2) + `- [${text}](${this.repoUrl}/README.md#${anchor})`;
      // }).join(this.EOL);

      return toc;
    }

    function addNumberToTitle(title, titleNumbers) {
      // console.log(title, title.endsWith('\r')); // !NOTE windows 环境下，读到的 title 结尾会带有一个 /r，在正则匹配的时候，不要记上结尾 $
      const match = title.match(/^(\#+)\s*((\d+(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?(\.\d*)?)\.\s*)?(.*)/);
      const plainTitle = match ? match[9].trim() : title.trim();

      const level = title.indexOf(" ");
      const baseLevel = 2; // 基础级别为2

      // 一级标题
      if (level === 1) return [title, plainTitle];

      // 重置当前级别以上的编号
      for (let i = level + 1; i < titleNumbers.length; i++) titleNumbers[i] = 0;

      // 增加当前级别的编号
      titleNumbers[level] += 1;

      // 生成新的编号
      const newNumber = titleNumbers.slice(baseLevel, level + 1).join(".");

      // 构建新的标题
      const headerSymbol = title.slice(0, level).trim(); // 获取原有的 # 符号
      const newTitle = `${headerSymbol} ${newNumber}. ${plainTitle}`;
      // console.log('newTitle:', newTitle);

      return [newTitle, plainTitle];
    }

    // !NOTE 需要跟和 \docs\.vitepress\config.mts 中的 markdown.anchor.slugify 的锚点要保持一致。
    function generateAnchor(label) {
      slugger.reset();
      return slugger.slug(label);
    }
  }

  updateVitepressDocs() {
    if (!notesmeta.repos_vitepress.includes(this.repoName)) return;

    const initDirs = () => {
      this.notes.dirNameList.forEach((dirName) => {
        const vpNoteRepoDirPath = path.join(this.vitepress.baseDir, this.repoName); // docs/src/notes/repoName

        if (!fs.existsSync(vpNoteRepoDirPath)) fs.mkdirSync(vpNoteRepoDirPath);

        const vpNoteDirPath = path.join(this.vitepress.baseDir, this.repoName, dirName); // docs/src/notes/repoName/xxxx. note-title
        if (!fs.existsSync(vpNoteDirPath)) fs.mkdirSync(vpNoteDirPath);
        
        const noteDirPath = path.join(this.baseDir, dirName);
        const noteDirAssetsPath = path.join(noteDirPath, 'assets');
        const noteDirMdImgsPath = path.join(noteDirPath, 'md-imgs');
        const noteDirReadmePath = path.join(noteDirPath, 'README.md');

        // 如果 noteDirAssetsPath 存在，则将 noteDirAssetsPath 复制到 vpNoteDirPath 中。
        if (fs.existsSync(noteDirAssetsPath)) {
          const vpNoteDirAssetsPath = path.join(vpNoteDirPath, 'assets');
          if (!fs.existsSync(vpNoteDirAssetsPath)) fs.mkdirSync(vpNoteDirAssetsPath);
          // 复制 noteDirAssetsPath 中的文件到 vpNoteDirAssetsPath 中。
          fs.readdirSync(noteDirAssetsPath).forEach((file) => {
            fs.copyFileSync(path.join(noteDirAssetsPath, file), path.join(vpNoteDirAssetsPath, file));
          })
        }

        // 如果 noteDirMdImgsPath 存在，则将 noteDirMdImgsPath 复制到 vpNoteDirPath 中。
        if (fs.existsSync(noteDirMdImgsPath)) {
          const vpNoteDirAssetsPath = path.join(vpNoteDirPath, 'md-imgs');
          if (!fs.existsSync(vpNoteDirAssetsPath)) fs.mkdirSync(vpNoteDirAssetsPath);
          // 复制 noteDirMdImgsPath 中的文件到 vpNoteDirAssetsPath 中。
          fs.readdirSync(noteDirMdImgsPath).forEach((file) => {
            fs.copyFileSync(path.join(noteDirMdImgsPath, file), path.join(vpNoteDirAssetsPath, file));
          })
        }

        // 如果 noteDirReadmePath 存在，则将 noteDirReadmePath 复制到 vpNoteDirPath 中。
        if (fs.existsSync(noteDirReadmePath)) {
          fs.copyFileSync(noteDirReadmePath, path.join(vpNoteDirPath, 'README.md'));
        }
      });
    }

    const updateHomeReadme = () => {
      let tocStartIdx = this.homeReadme.lines.indexOf(this.toc.startTag);
      tocStartIdx = tocStartIdx === -1 ? this.homeReadme.lines.indexOf(this.toc.startTag + '\r') : tocStartIdx;
      let tocEndIdx = this.homeReadme.lines.indexOf(this.toc.endTag);
      tocEndIdx = tocEndIdx === -1 ? this.homeReadme.lines.indexOf(this.toc.endTag + '\r') : tocEndIdx;
  
      // console.log(this.homeReadme.lines)
      // console.log('tocStartIdx', tocStartIdx)
      // console.log('tocEndIdx', tocEndIdx)

      // 尝试处理 vitepress 渲染复选框异常的问题。
      // const lines = this.homeReadme.lines.map(line => line.replaceAll('- [ ]', '[ ]').replaceAll('- [x]', '[x]'))

      // 处理路径问题
      const lines = this.homeReadme.lines.map(line => line.replaceAll(this.repoUrl, this.vitepress.githubPageUrl).replaceAll('README.md', 'README.html'));
      
      if (tocStartIdx !== -1 && tocEndIdx !== -1) {
        // 将 tocStartIdx 到 tocEndIdx 之间的内容给删除后再写入。
        fs.writeFileSync(
          this.vitepress.homeReadmePath,
          lines
            .slice(0, tocStartIdx)
            .concat(lines.slice(tocEndIdx + 1))
            .join(this.EOL)
        );
      } else {
        fs.writeFileSync(
          this.vitepress.homeReadmePath,
          lines.join(this.EOL)
        );
      }
    }

    const initSidebarJSON = () => {
      const dirNameList = [];
      this.homeReadme.idList.forEach(id => {
        const dirName = this.notes.dirNameList.find((dirName) => dirName.startsWith(id));
        if (dirName) {
          const done = this.doneNoteIds.includes(id) ? true : false;
          dirNameList.push({
            dirName,
            done
          });
        }
      });
    
      // Prepare note items
      const items_ = dirNameList.map(({ dirName, done }) => ({
        text: (done ? '✅ ' : '⏰ ') + dirName,
        link: `/notes/${this.repoName}/${dirName}/README`
      }));
    
      console.log('this.homeReadme.titles', this.homeReadme.titles);
      // console.log('this.homeReadme.titlesNotesCount', this.homeReadme.titlesNotesCount);
    
      // Helper function to parse titles into hierarchical structure
      const parseTitles = (titles, notesCount) => {
        const stack = [];
        const root = [];
    
        titles.forEach((title, i) => {
          const level = title.match(/^#+/)[0].length; // Get the level from the number of `#`
          const text = title.replace(/^#+\s*/, ''); // Remove the `#` and leading spaces
          const noteItems = items_.splice(0, notesCount[i]); // Get corresponding notes
    
          const node = {
            text,
            collapsed: true,
            items: noteItems.length > 0 ? noteItems : []
          };
    
          // Ignore the first H1 (most outer title)
          if (i === 0 && level === 1) return; // Skip the top-level title
    
          while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop(); // Pop until the correct parent level
          }
    
          if (stack.length === 0) {
            root.push(node); // Top-level node
          } else {
            const parent = stack[stack.length - 1].node;
            if (!parent.items) parent.items = [];
            parent.items.push(node); // Add as child to the parent
          }
    
          stack.push({ level, node });
        });
    
        return root;
      };
    
      const hierarchicalItems = parseTitles(this.homeReadme.titles, this.homeReadme.titlesNotesCount);
    
      // Write the final JSON to file
      fs.writeFileSync(
        path.join(this.vitepress.baseDir, this.repoName, 'sidebar.json'),
        JSON.stringify({
          text: `${this.repoName} (${this.doneNoteIds.length}/${this.notes.ids.size})`,
          link: `/notes/${this.repoName}/README`,
          collapsed: true,
          items: hierarchicalItems
        })
      );
    };
    

//     const initSidebarJSON = () => {
// /* eg.
// {
//   "text": "react",
//   "link": "/notes/react/README",
//   "collapsed": true,
//   "items": [
//     {
//       "text": "0001. 第一个 react v19 程序 - 通过 CDN 引入 react、react-dom 在页面上渲染出 Hello World",
//       "link": "/notes/react/0001. 第一个 react v19 程序 - 通过 CDN 引入 react、react-dom 在页面上渲染出 Hello World/README"
//     }
//   ]
// }
// */ 
//       const dirNameList = []; // [ { dirName: '...', done: false } ]
//       this.homeReadme.idList.forEach(id => {
//         const dirName = this.notes.dirNameList.find((dirName) => dirName.startsWith(id));
//         if (dirName) {
//           const done = this.doneNoteIds.includes(id) ? true : false;
//           dirNameList.push({
//             dirName,
//             done
//           });
//         }
//       })
//       const items_ = dirNameList.map(({ dirName, done }) => ({
//         text: (done ? '✅ ' : '⏰ ') + dirName,
//         link: `/notes/${this.repoName}/${dirName}/README`
//       }));
//       console.log('this.homeReadme.titles', this.homeReadme.titles)
//       console.log('this.homeReadme.titlesNotesCount', this.homeReadme.titlesNotesCount)
//       const items = this.homeReadme.titles.map((title, i) => ({ text: title.replace(/#+ /, ''), collapsed: true, items: items_.splice(0, this.homeReadme.titlesNotesCount[i]) }))
//       fs.writeFileSync(
//         path.join(this.vitepress.baseDir, this.repoName, 'sidebar.json'),
//         JSON.stringify({
//           // text: `${this.repoName} ${this.doneNoteIds.length}/${this.notes.ids.size}`,
//           text: `${this.repoName} (${this.doneNoteIds.length}/${this.notes.ids.size})`,
//           link: `/notes/${this.repoName}/README`,
//           collapsed: true,
//           items
//         })
//       );
//     }

    initDirs();
    updateHomeReadme();
    initSidebarJSON();
  }

  updateReadme() {
    this.parseNoteContent();
    this.homeReadme.contents = fs.readFileSync(this.homeReadme.path, "utf8");
    this.homeReadme.lines = this.removeHomeTopInfos();
    this.setHomeTopInfos();

    // console.log(this.notes.ids, this.homeReadme.ids);

    this.printMissingNotes();
    this.handleUnassignedNotes();
    this.updateHomeToc(this.homeReadme.lines);
    fs.writeFileSync(
      this.homeReadme.path,
      this.homeReadme.lines.join(this.EOL)
    );
    this.updateVitepressDocs();
    
    console.log(`✅ ${this.repoName} \t README.md updated.`);
  }
}

export default ReadmeUpdater;