import path from 'path';
import minimist from 'minimist';

import ReadmeUpdater from './updateREADME.js';
import { mergeReadme, distributeReadme } from './notes-merge-distribute.js';
import { syncLocalAndRemote, initPkg, parseTnotesConfig } from './utils.js';
// import notesmeta from './.notesmeta.json' assert { type: 'json' };
import { __dirname } from './constants.js';
import fs from 'fs';

const notesmeta = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.notesmeta.json'), 'utf-8'));

(async () => {
  const args = minimist(process.argv.slice(2), {
    string: ['repoName']
  });
  console.log('args', args);
  
  const repoName = args.repoName;

  if (!notesmeta.repos.includes(repoName)) {
    console.error(`❌ invalid repoName: ${repoName}.\nvalid repos: ${notesmeta.repos}`);
    process.exit(1);
  }

  const baseDir = path.resolve(__dirname, "..", "..", repoName);
  const pkg = await initPkg(baseDir, repoName) || {};
  if (!pkg.tnotesConfig) throw new Error(`❌ repoName: tnotesConfig is required, ${repoName} has no tnotesConfig field in package.json`);
  let {
    ignoreDirs,
    doneNoteIds,
    bilibiliMap
  } = parseTnotesConfig(pkg);
  console.log('ignoreDirs', ignoreDirs)
  console.log('doneNoteIds', doneNoteIds)
  console.log('bilibiliMap', bilibiliMap)

  ignoreDirs = [...ignoreDirs, ...notesmeta.common_ignore_dirs];

  if (args.updateREADME || args.update) {
    const updater = new ReadmeUpdater({
      repoName,
      baseDir,
      ignoreDirs,
      doneNoteIds,
      bilibiliMap
    });
    updater.updateReadme();
    await syncLocalAndRemote(baseDir);
  }

  if (args.syncREADME || args.sync) {
    await syncLocalAndRemote(baseDir);
  }

  if (args.mergeREADME || args.merge) {
    mergeReadme(baseDir, ignoreDirs);
  }

  if (args.distributeREADME || args.distribute) {
    distributeReadme(baseDir);
  }
})();
