export {clickup as default, clickup, ClickUp};

/**
 * ClickUp app
 * @author @almaceleste  https://almaceleste.github.io
 *
 * @class ClickUp
 * @typedef {ClickUp}
 */
class ClickUp {
  #prefix = '/tg';
  /**
   * Check if text is command, contained preferred prefix
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {string} text
   * @return {boolean}
   */
  #isCommand = (text) => text.startsWith(this.#prefix) &&
      !(text.trim() === this.#prefix);
  /**
   * Get comment item properties from the array of the history items
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {historyItem[]} items
   * @return {commentItem[]|undefined}
   */
  #getComments = (items) => items.filter((item) => item.comment)
      .map(({comment}) => {
        const lines = comment.comment;
        const text = comment.text_content;
        return {lines, text};
      });
  /**
   * Get base record by the task
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {string} task
   * @return {record|undefined}
   */
  #getRecord = (task) => app.base.tasks[task];
  /**
   * Handle comment: send text as message and attachment as document
   * @author @almaceleste https://almaceleste.github.io
   * @param {payload} payload
   */
  #handleComment = async (payload) => {
    const record = this.#getRecord(payload.task_id);
    const chatId = record.chat;
    const items = payload.history_items;
    const comments = this.#getComments(items);
    await Promise.all(comments.map(async ({lines, text}) => {
      if (!this.#isCommand(text)) return;

      const attachments = lines.filter((line) => line.attachment)
          .map(({attachment}) => {
            const filename = attachment.title;
            const url = attachment.url;
            text = text.replace(filename, '');

            return {filename, url};
          });

      text = text.replace(this.#prefix, '').trim();
      if (text) await app.telegramApi.sendMessage({chat_id: chatId, text});

      await Promise.all(attachments.map(async ({filename, url}) => {
        const response = await fetch(url);
        const blob = await response.blob();
        await app.telegramApi.sendDocument(chatId, {blob, filename});
      }));
    }));
  };
  /**
   * Handle deleted task: remove corresponded record from the base
   * @author @almaceleste https://almaceleste.github.io
   * @param {payload} payload
   * @return {void}
   */
  #handleTask = (payload) => delete app.base.tasks[payload.task_id];
  /**
   * ClickUp update router
   * @author @almaceleste  https://almaceleste.github.io
   * @type {Object<string, action>}
   */
  #updateRouter = {
    taskCommentPosted: this.#handleComment,
    taskDeleted: this.#handleTask,
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
    const event = update.event;
    const handler = this.#updateRouter[event];
    // TODO: add a return data to the handlers and use it in logic
    // to call response methods
    await handler(update);
    response.writeHead(200);
    response.end('ok');
    return response;
  };
}

const clickup = new ClickUp();

/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {import('node:http').ServerResponse} ServerResponse
 * @typedef {import('./clickup-api.js').commentItem} commentItem
 * @typedef {import('./clickup-api.js').clickupApi} clickupApi
 * @typedef {import('./telegram-api.js').fileDocument} fileDocument
 * @typedef {import('./clickup-api.js').historyItem} historyItem
 * @typedef {import('./telegram-api.js').message} message
 * @typedef {import('./telegram-api.js').messageOptions} messageOptions
 * @typedef {import('./base.js').record} record
 * @typedef {import('./telegram-api.js').telegramApi} telegramApi
 * @typedef {import('./clickup-api.js').payload} payload
 */

/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {object} updateRequestProps
 * @property {() => Promise<payload>} json
 * @typedef {updateRequestProps & Request} updateRequest
 *
 * @callback action
 * @param {payload} payload - clickup payload object
 * @return {Promise<void>}
 */
