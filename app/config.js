import fs from 'node:fs';

export {config as default, config, Config};

/**
 * Description placeholder
 * @date 1/8/2024 - 12:51:13 AM
 * @author @almaceleste https://almaceleste.github.io
 *
 * @class Config
 * @typedef {Config}
 */
class Config {
  #configFile = './config/config.json';

  port = 8000;
  /**
   * Configuration parameters
   * @date 1/8/2024 - 3:46:50 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @typedef {object} configs
   * @property {number} [port] - application port
   */
  #defaultConfig = {
    port: this.port,
  };
  /**
   * Config options
   * @date 1/8/2024 - 1:07:27 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @typedef {object} options
   * @property {string} [configFile] - path to config (json) file
   * @property {string} [secretPathFile] - path to secret-path file
   */
  #options = {
    configFile: this.#configFile,
  };

  #control = new AbortController();
  #signal = {signal: this.#control.signal};
  /**
   * Assign new parameters to application config
   * @date 1/8/2024 - 3:45:09 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {configs} target
   * @param {configs} source
   * @return {configs}
   */
  #assign = (target, source) => {
    target = target ? target : {};
    return Object.assign(target, source);
  };
  /**
   * Reads parameters from file and pass it into the object
   * @date 1/9/2024 - 2:34:28 AM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {configs} config - target object
   * @param {string} [filename] - path to the reading file
   * @return {configs}
   */
  #readConfig = (config, filename) => {
    const params = fs.readFileSync(filename, {encoding: 'utf8'});
    return this.#assign(config, JSON.parse(params));
  };
  /**
   * Sets Config options
   * @date 1/8/2024 - 3:19:36 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {options} options - new options
   */
  #setOptions = (options) => {
    options = Object.assign(this.#options, options);
    this.#configFile = options.configFile;
  };

  /**
   * Watches for changes in the config file and call readConfig
   * @date 1/9/2024 - 2:38:32 AM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {configs} config - target object
   * @param {string} [filename] - path to the reading file
   */
  #watchConfig = (config, filename) => {
    fs.watch(filename, this.#signal,
        (event, file) => {
          if (event === 'change') {
            app.config = this.#readConfig(config, filename);
          }
        });
  };

  close = () => {
    this.#control.abort();
  };

  /**
   * Initiates an instance of Config.
   * @date 1/8/2024 - 1:05:21 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {options} [options]
   */
  init = (options = this.#options) => {
    this.#setOptions(options);
    app.config = this.#assign(app.config, this.#defaultConfig);
    if (fs.existsSync(this.#configFile)) {
      app.config = this.#readConfig(app.config, this.#configFile);
      this.#watchConfig(app.config, this.#configFile);
    }
  };

  /**
   * Creates an instance of Config.
   * @date 1/8/2024 - 1:44:34 AM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @constructor
   * @param {options} [options] - options with paths
   */
  constructor(options = this.#options) {
    this.#setOptions(options);
  }
}

const config = new Config();
// config.init();
