import util from 'node:util';

export {logger as default, logger, Logger};

/**
 * Logger with colorful messages, painted with colors,
 * differentiated by log levels
 * @date 12/16/2023 - 8:15:21 PM
 * @author @almaceleste https://almaceleste.github.io
 *
 * @class Logger
 * @typedef {Logger}
 */
class Logger {
  #COLORS = {
    reset: '\x1b[0m',
    black: '\x1b[0;30m', blackbold: '\x1b[1;30m',
    red: '\x1b[0;31m', redbold: '\x1b[1;31m',
    green: '\x1b[0;32m', greenbold: '\x1b[1;32m',
    yellow: '\x1b[0;33m', yellowbold: '\x1b[1;33m',
    blue: '\x1b[0;34m', bluebold: '\x1b[1;34m',
    magenta: '\x1b[0;35m', magentabold: '\x1b[1;35m',
    cyan: '\x1b[0;36m', cyanbold: '\x1b[1;36m',
    white: '\x1b[0;37m', whitebold: '\x1b[1;37m',
    gray: '\x1b[0;90m', graybold: '\x1b[1;90m',
  };
  #LEVELS = {
    log: 'gray',
    info: 'blue',
    warn: 'yellow',
    error: 'red',
  };
  #locale = new Intl.DateTimeFormat('mn', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
  #resetColor = this.#COLORS['reset'];
  #dateColor = this.#COLORS['cyan'];
  #levelColor = this.#COLORS['greenbold'];
  /**
   * #color private method
   * @date 12/16/2023 - 8:17:27 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {string} level - log level
   * @return {string} ANSI escape code for given color
   */
  #color(level) {
    return this.#COLORS[this.#LEVELS[level]] || this.#COLORS['reset'];
  }
  /**
   * write message to console with date, log level
   * and color formatting
   * @date 12/16/2023 - 10:10:56 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {string} level - log level
   * @param {object} [options] - *optional* depth for objects
   * @param {string} message - message to be written
   */
  #write(level, options = {depth: 3}, ...messages) {
    const date = this.#locale.format(new Date());
    messages.forEach((m, i, arr) => {
      arr[i] = typeof m === 'object' ?
        util.inspect(m, {depth: options.depth}) : m;
    });
    const messageJoined = messages.join(' ');
    const message =
      `${this.#dateColor}${date}\t` +
      `${this.#levelColor}${level}:\t` +
      `${this.#color(level)}${messageJoined}` +
      `${this.#resetColor}`;
    console.log(message);
    const withoutColor = `${date}\t${level}:\t${messageJoined}`;
    if (app.loggerFs) {
      if (level === 'error' || level === 'warn') {
        app.loggerFs.write(level, withoutColor);
      } else {
        app.loggerFs.write(level, withoutColor);
      }
    }
  }
  /**
   * Creates an instance of Logger and adds to it
   * separate methods for every log level.
   * @date 12/17/2023 - 1:41:55 AM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @constructor
   * @param {object} [levels] - *optional* log levels and their colors
   * @param {object} [options] - *optional* depth for objects
   * @example
   * ```
   *  new Logger(
   *    {log: 'gray', info: 'blue', warn: 'yellow', error: 'red'},
   *    {depth: 3}
   *  )
   * ```
   */
  constructor(levels = this.#LEVELS, options = {depth: 3}) {
    this.#LEVELS = levels;
    // loop methods, described in the #LEVELS field
    for (const key in levels) {
      // check if the Logger class has no yet this method
      // and the #LEVELS field has key as its own property
      // (latter for eslint guard-for-in rule)
      if (!Object.hasOwn(this, key) &&
          Object.hasOwn(this.#LEVELS, key)) {
        this[key] = (...data) => {
          this.#write(key, {depth: options.depth}, ...data);
        };
      }
    }
  }
}

const logger = new Logger();
