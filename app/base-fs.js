import fs from 'node:fs';
import readline from 'node:readline';

export {baseFs as default, baseFs, BaseFs};

/**
 * FS driver for the Base to load data from and save it to local file
 * @author @almaceleste https://almaceleste.github.io
 *
 * @class BaseFs
 * @typedef {BaseFs}
 */
class BaseFs {
  #delimiter = '\t';
  #path = './db/database.tsv';
  /**
   * Options for BaseFs instance
   * @date 1/16/2024 - 9:47:50 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @typedef {object} options
   * @property {string} [path] - path to database file
   * @property {string} [delimiter] - delimiter to separate line to fields
   */
  #options = {
    path: this.#path,
    delimiter: this.#delimiter,
  };

  /**
   * Set options of the BaseFs instance.
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {options} [options] options for BaseFs instance
   */
  #setOptions = (options) => {
    options = Object.assign(this.#options, options);
    this.#path = options.path;
    this.#delimiter = options.delimiter;
    return;
  };

  /**
   * Load records from the local file database
   * @author @almaceleste https://almaceleste.github.io
   * @return {Promise<record[]>}
   */
  load = () => new Promise((resolve, reject) => {
    const records = [];
    const rs = fs.createReadStream(this.#path, {encoding: 'utf8'});
    const rl = readline.createInterface({
      input: rs,
      crlfDelay: Infinity,
    });
    let header = [];
    let isHeader = true;
    rl.on('line', (line) => {
      if (isHeader) {
        header = line.split(this.#delimiter);
        isHeader = false;
        return;
      }
      const fields = line.split(this.#delimiter);
      if (fields.length > 1) {
        const record = {};
        fields.forEach((value, index) => record[header[index]] = value);
        records.push(record);
      }
    });
    rl.once('close', () => {
      rs.close();
      rl.close();
      resolve(records);
    });
  });
  /**
   * Save records to the local file database
   * @author @almaceleste https://almaceleste.github.io
   * @param {record[]} data - array of records
   * @return {Promise<boolean>}
   */
  save = (data) => new Promise(async (resolve, reject) => {
    if (data.length === 0) resolve(false);
    const ws = fs.createWriteStream(this.#path);
    const header = Object.keys(data[0]);
    ws.write(`${header.join(this.#delimiter)}\n`);
    await Promise.all(data.map((record) =>
      ws.write(`${Object.values(record).join(this.#delimiter)}\n`)));
    ws.end('\n', () => resolve(true));
    ws.close();
  });

  /**
   * Initiates an instance of BaseFs.
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {options} [options] options for BaseFs instance
   * @return {void}
   */
  init = (options = this.#options) => this.#setOptions(options);

  /**
   * Creates an instance of BaseFs.
   * @date 1/15/2024 - 2:22:29 PM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @constructor
   * @param {options} [options] options for BaseFs instance
   */
  constructor(options = this.#options) {
    this.#setOptions(options);
  }
}

const baseFs = new BaseFs();

/**
 * @author @almaceleste https://almaceleste.github.io
 *
 * @typedef {import('./base.js').record} record
 */
