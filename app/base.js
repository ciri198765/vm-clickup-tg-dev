export {base as default, base, Base};

/**
 * Base for chat and task IDs
 * @author @almaceleste https://almaceleste.github.io
 *
 * @class Base
 * @typedef {Base}
 */
class Base {
  // stub driver
  #driver = {
    /**
     * Load records from the driver
     * @author @almaceleste https://almaceleste.github.io
     * @return {Promise<record[]>}
     */
    load: () => Promise.resolve(),
    /**
     * Save records to the driver
     * @author @almaceleste https://almaceleste.github.io
     * @param {record[]} data - array of records
     * @return {Promise<boolean>}
     */
    save: (data) => Promise.resolve(),
  };
  #base = {
    data: {},
    chat: {},
    task: {},
  };
  /**
   * @author @almaceleste https://almaceleste.github.io
   * @type {Object<string, record>}
   */
  chats = {};
  /**
   * @author @almaceleste https://almaceleste.github.io
   * @type {Object<string, record>}
   */
  tasks = {};
  /**
   * Get base size
   * @date 2/7/2024 - 4:27:16 AM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @readonly
   * @type {number}
   */
  get size() {
    return Object.keys(this.#base.data).length;
  };

  /**
   * Create index table for the base field
   * @date 2/7/2024 - 4:29:15 AM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {string} field - field name
   * @return {ProxyHandler<Object<string, record>>}
   */
  #createIndex = (field) => new Proxy(this.#base, {
    get: (target, prop) => target.data[target[field][prop]],
    set: (target, prop, value) => {
      const index = prop in target[field] ?
          target[field][prop] : this.size;
      target.data[index] = value;
      const record = target.data[index];
      target.chat[record.chat] = index;
      target.task[record.task] = index;
      this.save();
      return true;
    },
    deleteProperty: (target, prop) => {
      const index = target[field][prop];
      const record = target.data[index];
      delete target.data[index];
      delete target.chat[record.chat];
      delete target.task[record.task];
      this.save();
      return true;
    },
    getOwnPropertyDescriptor: () => ({enumerable: true, configurable: true}),
    has: (target, prop) => Object.keys(target[field]).includes(prop),
    ownKeys: (target) => Object.keys(target[field]),
  });

  clear = () => {
    this.#base.data = {};
    this.#base.chat = {};
    this.#base.task = {};
  };
  /**
   * Initiates an instance of Base: sets database driver
   * @date 1/18/2024 - 12:41:00 AM
   * @author @almaceleste https://almaceleste.github.io
   *
   * @param {object} options - database options
   * @param {object} options.driver - database driver object
   */
  init = (options) => {
    this.#driver = options.driver ? options.driver : this.#driver;
  };
  /**
   * Load records from the driver
   * @author @almaceleste https://almaceleste.github.io
   */
  load = async () => {
    const records = await this.#driver.load();
    const result = {data: {}, chat: {}, task: {}};
    await Promise.all(records.map((record, index) => {
      result.data[index] = record;
      result.chat[record.chat] = index;
      result.task[record.task] = index;
      return true;
    }));
    this.#base.data = result.data;
    this.#base.chat = result.chat;
    this.#base.task = result.task;
  };
  /**
   * Save records to the driver
   * @author @almaceleste https://almaceleste.github.io
   */
  save = async () => await this.#driver.save(Object.values(this.#base.data));
  /**
   * Creates an instance of Base.
   * @author @almaceleste https://almaceleste.github.io
   *
   * @constructor
   */
  constructor() {
    this.chats = this.#createIndex('chat');
    this.tasks = this.#createIndex('task');
  }
}

const base = new Base();

/**
 * @author @almaceleste https://almaceleste.github.io
 *
 * @typedef {object} record
 * @property {string} [chat] - telegram chat id
 * @property {string} [task] - clickup task id
 * @property {string} [account] - telegram account
 */
