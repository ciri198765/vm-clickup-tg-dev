import fs from 'node:fs';

export {loggerFs as default, loggerFs, LoggerFS};

/**
 * creates streams to write error and output logs
 * @date 1/3/2024 - 8:45:01 AM
 * @author @almaceleste https://almaceleste.github.io
 *
 * @class LoggerFS
 * @typedef {LoggerFS}
 */
class LoggerFS {
  #extension = '.log';
  #locale = new Intl.DateTimeFormat('lt');
  #folder = './logs';
  #error = 'error';
  #output = 'output';
  #oneDay = 86400000; // one day in ms
  #rotation = undefined;
  #timeout = undefined;
  #errorInterval = undefined;
  #outputInterval = undefined;
  #options = {
    extension: this.#extension,
    locale: this.#locale,
    folder: this.#folder,
    error: this.#error,
    output: this.#output,
    period: 1,
  };
  #errorLog;
  #outputLog;

  /**
   * catches error and pass it to logger
   * @date 1/3/2024 - 10:16:55 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {*} err - error
   */
  #catch = (err) => {
    if (err) app.logger.error(err);
  };

  /**
   * resolve or reject promise of fsWriteStreams creation
   * @date 1/5/2024 - 2:22:53 AM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {function} resolve - resolve callback
   * @param {function} reject - reject callback
   */
  #promiseWriteStreams = (resolve, reject) => {
    const streams = {error: false, output: false};
    Object.seal(streams);
    const check = () => {
      const resolved = Object.values(streams).every(
          (value, i, a) => value === true);
      if (resolved) resolve(resolved);
    };
    [this.#errorLog, this.#outputLog].forEach((stream, index) => {
      stream.once('ready', () => {
        const key = Object.keys(streams)[index];
        streams[key] = true;
        check();
      });
      stream.once('error', (err) => {
        err = new Error(`Cannot create fs.WriteStreams for log files: ${err}`);
        reject(err);
      });
    });
  };

  /**
   * Description placeholder
   * @date 1/6/2024 - 5:27:11 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {Stream} stream - log file stream
   * @param {string} file - log filename
   * @return {Stream}
   */
  #rotate = (stream, file) => {
    const yesterday = this.#locale.format(Date.now() - this.#oneDay);
    const oldname = `${this.#folder}/${file}${this.#extension}`;
    const newname = `${this.#folder}/${file}.${yesterday}${this.#extension}`;
    stream.cork();
    fs.renameSync(oldname, newname);
    stream = fs.createWriteStream(oldname, {flags: 'a'});
    stream.uncork();
    return stream;
  };

  #timeToMidnight = () => this.#oneDay - Date.now() % this.#oneDay;

  #scheduler = () => {
    this.#timeout = setTimeout(() => {
      this.#errorLog = this.#rotate(this.#errorLog, this.#error);
      this.#outputLog = this.#rotate(this.#outputLog, this.#output);
      this.#errorInterval = setInterval(() => this.#errorLog =
          this.#rotate(this.#errorLog, this.#error), this.#rotation);
      this.#outputInterval = setInterval(() => this.#outputLog =
          this.#rotate(this.#outputLog, this.#output), this.#rotation);
    }, this.#timeToMidnight());
  };
  /**
   * initiate LoggerFS instance: create logs folder, log files and
   * fs.WriteStream objects to write into these files
   * @date 1/4/2024 - 3:46:28 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @return {Promise<Stream>}
   */
  init = () => {
    // create logs folder; {recursive: true} used to ignore existing
    fs.mkdirSync(this.#folder, {recursive: true});
    const append = {flags: 'a'};
    this.#errorLog = fs.createWriteStream(
        `${this.#folder}/${this.#error}${this.#extension}`, append);
    this.#outputLog = fs.createWriteStream(
        `${this.#folder}/${this.#output}${this.#extension}`, append);
    const promise = new Promise(this.#promiseWriteStreams);
    this.#scheduler();

    return promise;
  };

  /**
   * writes message into the log file
   * @date 1/3/2024 - 10:04:53 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {string} level - message level (log, info, warn, error, etc)
   * @param {string} message - message to write
   * @param {function} [callback] - callback function
   */
  write = (level, message, callback = this.#catch) => {
    message += '\n';
    if (level === 'error' || level === 'warn') {
      if (this.#errorLog.writable) this.#errorLog.write(message, callback);
      else app.logger.error('logger-fs: Cannot write into error.log');
    } else {
      if (this.#outputLog.writable) this.#outputLog.write(message, callback);
      else app.logger.error('logger-fs: Cannot write into output.log');
    }
  };

  /**
   * closes LoggerFS instance
   * @date 1/3/2024 - 10:08:59 PM
   * @author @almaceleste https://almaceleste.github.io
   */
  close = () => {
    this.#outputLog.close();
    this.#errorLog.close();
    clearTimeout(this.#timeout);
    clearInterval(this.#errorInterval);
    clearInterval(this.#outputInterval);
  };

  /**
   * creates LoggerFS instance.
   * @date 1/3/2024 - 8:56:56 AM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @constructor
   * @param {object} [options] - LoggerFS options object
   * @param {string} [options.extension] - log file extension
   * @param {Intl.DateTimeFormat} [options.locale] - date format for suffix
   * @param {string} [options.folder] - logs folder path
   * @param {string} [options.error] - log name for errors and warnings
   * @param {string} [options.output] - log name for other messages
   * @param {number} [options.period] - log rotation period in days
   * @default
   *  {
   *    extension: '.log',
   *    locale: new Intl.DateTimeFormat('lt'), // yyyy-mm-dd
   *    folder: './logs',
   *    error: 'error',
   *    output: 'output',
   *    period: 1,
   *  }
   */
  constructor(options = this.#options) {
    options = Object.assign(this.#options, options);
    this.#extension = options.extension;
    this.#locale = options.locale;
    this.#folder = options.folder;
    this.#error = options.error;
    this.#output = options.output;
    this.#rotation = options.period * this.#oneDay;
  }
}

const loggerFs = new LoggerFS();
// await loggerFs.init();
