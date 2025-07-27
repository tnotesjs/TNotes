import { syncLocalAndRemote } from './utils.js';
import path from 'path';
import { __dirname } from './constants.js';

(async () => {
    await syncLocalAndRemote(path.join(__dirname, '..'));
})();
