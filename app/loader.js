import fs from 'node:fs';
import {createRequire} from 'node:module';

export {loader as default, loader};

const loader = {};

// create array to collect modules data for watching changes
// fill it with already loaded modules
loader.app = [
  // yet have no idea how to reload index.js
  // ['index', './index.js', 'default'],
  ['loader', './loader.js', 'default'],
];
globalThis.app = {};
app.base = await import('./base.js').then((m) => m.base)
    .then(loader.app.push(['base', './base.js', 'base']));
app.BaseFs = await import('./base-fs.js').then((m) => m.BaseFs)
    .then(loader.app.push(['BaseFs', './base-fs.js', 'BaseFs']));
app.clickup = await import('./clickup.js').then((m) => m.clickup);
app.clickupApi = await import('./clickup-api.js').then((m) => m.clickupApi);
app.config = await import('./config.js').then((m) => m.default);
app.logger = await import('./logger.js').then((m) => m.default)
    .then(loader.app.push(['logger', './logger.js', 'default']));
app.loggerFs = await import('./logger-fs.js').then((m) => m.default)
    .then(loader.app.push(['loggerFs', './logger-fs.js', 'default']));
app.run = await import('./app.js').then((m) => m.run)
    .then(loader.app.push(['run', './app.js', 'run']));
app.stop = await import('./app.js').then((m) => m.stop)
    .then(loader.app.push(['stop', './app.js', 'stop']));
app.strings = await import('./strings.js').then((m) => m.strings)
    .then(loader.app.push(['strings', './strings.js', 'strings']));
app.telegram = await import('./telegram.js').then((m) => m.telegram);
app.telegramApi = await import('./telegram-api.js').then((m) => m.telegramApi);
app.router = await import('./router.js').then((m) => m.router);
app.server = await import('./server.js').then((m) => m.server);

const control = new AbortController();
const {signal} = control;
loader.close = () => control.abort();
loader.resolve = createRequire(import.meta.url).resolve;
loader.watch = () => {
  for (const api of ['app']) {
    for (const [prop, name, value] of loader[api]) {
      const path = loader.resolve(name);
      fs.watch(path, {signal: signal}, async () => {
        // if (prop == 'index') process.emit('beforeExit', 0);
        globalThis[api][prop] = await import(`${name}?${Date.now()}`)
            .then((m) => m[value]);
      });
    }
  }
};
// loader.watch();
