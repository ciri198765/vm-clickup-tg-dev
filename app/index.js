import fs from 'node:fs';
import url from 'node:url';
import util from 'node:util';
import loader from './loader.js';

export {index as default, index};

const index = {};
index.catchError = (err) => {
  console.dir(err);
  const filepath = url.fileURLToPath(import.meta.url);
  const dirpath = `${import.meta.dirname ||
    filepath.substring(0, filepath.lastIndexOf('/'))}/logs`;
  const filename = `${dirpath}/exceptions.${Date.now()}`;
  if (!fs.existsSync(dirpath)) fs.mkdirSync(dirpath);
  fs.writeFileSync(filename, util.inspect(err));
};
index.close = () => process.emit('beforeExit', 0);

process.on('uncaughtException', (err) => {
  index.catchError(err);
});
process.on('unhandledRejection', (reason) => {
  index.catchError(reason);
});
process.on('beforeExit', () => {
  loader.close();
  app.loggerFs.close();
});

loader.watch();
