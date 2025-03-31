import fs from 'node:fs';

export {secrets as default, secrets, Secrets};

/**
 * Read secrets and pass them to api modules
 * @author @almaceleste  https://almaceleste.github.io
 *
 * @class Secrets
 * @typedef {Secrets}
 */
class Secrets {
  #secretDir = '/tmp/sops/temp';
  #secretFile = 'file';
  /**
   * Return a path to the file contained a path to the secrets
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @readonly
   * @type {string}
   */
  get #secretPath() {
    return `${this.#secretDir}/${this.#secretFile}`;
  }
  /**
   * Wait for a file
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {string} folder - folder path
   * @param {string} file - filename
   * @return {Promise<void>}
   */
  #waitForFile = (folder, file) => new Promise((resolve, reject) => {
    if (fs.existsSync(`${folder}/${file}`)) {
      resolve();
      return;
    }
    const ac = new AbortController;
    fs.watch(folder, {signal: ac.signal}, (event, filename) => {
      if (event !== 'change') return;
      if (filename === file) {
        ac.abort();
        resolve();
      }
    });
  });

  load = async () => {
    await this.#waitForFile(this.#secretDir, this.#secretFile);
    const path = fs.readFileSync(this.#secretPath, {encoding: 'utf8'});
    const content = fs.readFileSync(path, {encoding: 'utf8'});
    const secrets = JSON.parse(content);
    app.clickupApi.secrets = secrets;
    app.telegramApi.secrets = secrets;
    fs.rmSync(this.#secretPath);
  };
}

const secrets = new Secrets();
