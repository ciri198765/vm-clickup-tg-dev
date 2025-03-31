export {telegram as default, telegram, Telegram};

/**
 * Telegram app
 * @date 2/12/2024 - 1:19:40 PM
 * @author @almaceleste  https://almaceleste.github.io
 *
 * @class Telegram
 * @typedef {Telegram}
 */
class Telegram {
  #callbackRouter = {
    /**
     * @type {Object<string, action>}
     */
    agreement: {
      yes: async (user) => {
        const chatId = user.id;
        const lang = this.#getLanguage(user);
        let record = app.base.chats[chatId];
        if (!record) {
          record = await this.#createRecord(user);
        }
        await app.telegramApi.sendMessage({
          chat_id: chatId,
          text: app.strings[lang].howCanWeHelp,
        });
      },
      no: async (user) => {
        const chatId = user.id;
        const lang = this.#getLanguage(user);
        await app.telegramApi.sendMessage({
          chat_id: chatId,
          text: app.strings[lang].weCannotProceed,
        });
        await this.#command.start(user);
      },
      info: async (user) => {
        const chatId = user.id;
        const lang = this.#getLanguage(user);
        await app.telegramApi.sendMessage({
          chat_id: chatId,
          text: app.strings[lang].agreementInfo,
        });
        await this.#command.start(user);
      },
    },
  };
  /**
   * Telegram commands
   * @author @almaceleste  https://almaceleste.github.io
   * @type {Object<string, action>}
   */
  #command = {
    contacts: async (user) => {
      const chatId = user.id;
      const lang = this.#getLanguage(user);
      await app.telegramApi.sendMessage({
        chat_id: chatId,
        text: app.strings[lang].contacts,
      });
    },
    donate: async (user) => {
      const chatId = user.id;
      const lang = this.#getLanguage(user);
      await app.telegramApi.sendMessage({
        chat_id: chatId,
        text: app.strings[lang].donate,
      });
    },
    feedback: async (user) => {
      const chatId = user.id;
      const lang = this.#getLanguage(user);
      await app.telegramApi.sendMessage({
        chat_id: chatId,
        text: app.strings[lang].feedback,
      });
    },
    start: async (user) => {
      const chatId = user.id;
      const lang = this.#getLanguage(user);
      const strings = app.strings[lang];
      if (chatId in app.base.chats) {
        await app.telegramApi.sendMessage({
          chat_id: chatId,
          text: strings.welcomeBack,
        });
      } else {
        await app.telegramApi.sendMessage({
          chat_id: chatId,
          text: strings.doYouAgree,
          reply_markup: {
            inline_keyboard: [
              [
                {text: strings.yes, callback_data: 'agreement.yes'},
                {text: strings.no, callback_data: 'agreement.no'},
                {text: strings.info, callback_data: 'agreement.info'},
              ],
            ],
          },
        });
      }
    },
  };
  /**
   * Telegram command router
   * @author @almaceleste  https://almaceleste.github.io
   * @type {Object<string, action>}
   */
  #commandRouter = {
    '/contacts': this.#command.contacts,
    '/donate': this.#command.donate,
    '/feedback': this.#command.feedback,
    '/start': this.#command.start,
  };
  #defaultLanguage = 'ru';
  #updateTypes = {
    callback: 'callback',
    command: 'command',
    message: 'message',
  };

  /**
   * Create user record in the base
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @async
   * @param {user} user
   * @return {Promise<record>} record
   */
  #createRecord = async (user) => {
    const chatId = user.id;
    const fullName = `${user.first_name} ${user.last_name}`;
    const username = user.username || '';
    const description = `chat-id: ${chatId}\naccount: ${username}`;
    const fieldName = 'Telegram/Signal';
    const telegramField = await this.#getClickupField(fieldName);
    const task = await app.clickupApi.createTask(app.config.clickup.listId, {
      name: fullName,
      description: description,
      // TODO: fill custom fields
      custom_fields: [{id: telegramField.id, value: username}],
    });
    const record = {
      chat: chatId,
      task: task.id,
      account: username};
    app.base.chats[chatId] = record;
    return record;
  };
  /**
   * Get a custom field object from ClickUp
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {string} name - name of the field
   * @return {Promise<customField>}
   */
  #getClickupField = async (name) => {
    const listId = app.config.clickup.listId;
    const response = await app.clickupApi.getFields(listId);
    const fields = response.fields;
    const field = (await Promise.all(fields.filter((field) =>
      field.name === name))).shift();
    return field;
  };
  /**
   * Get language code from telegram user object
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {user} user
   * @return {string}
   */
  #getLanguage = (user) => user.language_code || this.#defaultLanguage;
  /**
   * Get media information from the message
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {message} message
   * @return {fileDocument|undefined}
   */
  #getMedia = (message) => {
    const attachmentType = message.attachment.type;
    if (attachmentType === 'OtherOrNone') return undefined;
    const mediaType = attachmentType === 'VideoNote' ?
        'video_note' : attachmentType.toLowerCase();
    const media = mediaType === 'photo' ?
        message.photo?.pop() : message[mediaType];
    return media;
  };
  /**
   * Get message from the update
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {update} update
   * @return {message|undefined}
   */
  #getMessage = (update) => update.message || update.edited_message;
  /**
   * Get base record by the chat
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {user} user
   * @return {record|undefined}
   */
  #getRecord = (user) => app.base.chats[user.id];
  /**
   * Get text from the message
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {message} message
   * @return {string|undefined}
   */
  #getText = (message) => message.text || message.caption;
  /**
   * Check if the message contains a bot command.
   * @date 2/11/2024 - 7:49:20 PM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {message} message
   * @return {boolean}
   */
  #isCommand = (message) =>
    (message && message.text &&
      message.text.startsWith('/') &&
        message.entities[0].type === 'bot_command') ?
          true : false;
  /**
   * Handle the callback from inline keyboard
   * @author @almaceleste https://almaceleste.github.io
   * @param {update} update
   */
  #handleCallback = async (update) => {
    const callback = update.callback_query;
    const lang = this.#getLanguage(callback.from);
    await app.telegramApi.answerCallbackQuery({
      callback_query_id: callback.id,
      text: app.strings[lang].thank,
    });
    const [key, value] = callback.data.split('.');
    /**
     * @type {action}
     */
    const action = this.#callbackRouter[key][value];
    await action(callback.from);
  };
  /**
   * Handle the bot command
   * @author @almaceleste https://almaceleste.github.io
   * @param {update} update
   */
  #handleCommand = async (update) => {
    const message = this.#getMessage(update);
    const entity = message.entities[0];
    const command = message.text.substring(entity.offset, entity.length);
    const action = this.#commandRouter[command];
    await action(message.from);
  };
  /**
   * Handle the message
   * @author @almaceleste https://almaceleste.github.io
   * @param {update} update
   */
  #handleMessage = async (update) => {
    const message = this.#getMessage(update);
    const user = message.from;
    const record = this.#getRecord(user);
    if (!record) return this.#callbackRouter.agreement.no(user);
    const text = this.#getText(message);
    const media = this.#getMedia(message);
    if (text) {
      await app.clickupApi
          .createTaskComment(record.task, {comment_text: text});
    }
    if (media) {
      const file = await app.telegramApi.getFile(media);
      const filename = media.file_name ||
          file.result.file_path.split('/').pop() ||
          media.file_unique_id;
      const blob = await app.telegramApi.fetchFile(file.result.file_path);
      await app.clickupApi
          .createTaskAttachment(record.task, {blob, filename});
    }
  };
  /**
   * Get type of the message
   * @author @almaceleste https://almaceleste.github.io
   * @param {update} update
   * @return {string|undefined} type
   */
  #typeOfUpdate = (update) => {
    if (update.callback_query) return this.#updateTypes.callback;
    if (this.#isCommand(update.message)) return this.#updateTypes.command;
    if (this.#getMessage(update)) return this.#updateTypes.message;
    return undefined;
  };
  /**
   * Telegram update router
   * @author @almaceleste  https://almaceleste.github.io
   * @type {Object<string, action>}
   */
  #updateRouter = {
    [this.#updateTypes.callback]: this.#handleCallback,
    [this.#updateTypes.command]: this.#handleCommand,
    [this.#updateTypes.message]: this.#handleMessage,
  };

  /**
   * Handle request and send response
   * @date 1/27/2024 - 4:16:35 PM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {updateRequest} request
   * @param {ServerResponse} response
   * @return {Promise<ServerResponse>}
   */
  handle = async (request, response) => {
    const update = await request.json();
    const type = this.#typeOfUpdate(update);
    const handler = this.#updateRouter[type];
    // TODO: add a return data to the handlers and use it in logic
    // to call response methods
    await handler(update);
    response.writeHead(200);
    response.end('ok');
    return response;
  };
  // TODO: finish `init` method
  init = () => {
    app.telegramApi.setWebhook();
  };
};

const telegram = new Telegram();

/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {import('node:http').ServerResponse} ServerResponse
 * @typedef {import('./clickup-api.js').clickupApi} clickupApi
 * @typedef {import('./clickup-api.js').customField} customField
 * @typedef {import('./telegram-api.js').fetchOptions} fetchOptions
 * @typedef {import('./telegram-api.js').fileDocument} fileDocument
 * @typedef {import('./telegram-api.js').message} message
 * @typedef {import('./telegram-api.js').messageOptions} messageOptions
 * @typedef {import('./base.js').record} record
 * @typedef {import('./telegram-api.js').telegramApi} telegramApi
 * @typedef {import('./telegram-api.js').user} user
 * @typedef {import('./telegram-api.js').update} update
 */

/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {object} updateRequestProps
 * @property {() => Promise<update>} json
 * @typedef {updateRequestProps & Request} updateRequest
 *
 * @callback action
 * @param {user} user - telegram user object
 * @return {Promise<void>}
 */
