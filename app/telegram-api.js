import crypto from 'node:crypto';

export {telegramApi as default, telegramApi, TelegramApi};

/**
 * Telegram API
 * @date 1/25/2024 - 1:49:53 AM
 * @author @almaceleste https://almaceleste.github.io
 *
 * @class TelegramApi
 * @typedef {TelegramApi}
 */
class TelegramApi {
  #token = undefined;
  #apiUrl = undefined;
  #secretToken = '';
  #webhookUrl = undefined;
  /**
   * Set Telegram secrets
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {object} secrets
   */
  set secrets({telegramToken}) {
    this.#token = telegramToken;
  }

  #generateToken = () => crypto.randomUUID();
  /**
   * Connects to the network resource
   * @date 1/23/2024 - 12:30:11 AM
   * @author @almaceleste https://almaceleste.github.io
   * @param {string} url - network resource url
   * @param {fetchOptions} [options] - request options
   * @return {Promise<object>}
   */
  #fetch = (url, options) => new Promise(async (resolve, reject) => {
    const response = await fetch(url, options)
        .catch((reason) => reject(reason));
    const data = await response.json();
    resolve(data);
  });
  #setApiUrl = () => this.#apiUrl = `https://api.telegram.org/bot${this.#token}`;
  /**
   * Set secret token
   * @date 1/29/2024 - 2:33:48 AM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {string} secretToken - a secret token to be sent in
   * a header `X-Telegram-Bot-Api-Secret-Token` in every webhook request, 1-256
   * characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header
   * is useful to ensure that the request comes from a webhook set by you.
   * @return {string} secret token
   */
  #setSecretToken = (secretToken) => {
    secretToken = secretToken ? secretToken : this.#secretToken;
    secretToken = secretToken.length > 256 ?
        secretToken.slice(0, 256) : secretToken;
    this.#secretToken = secretToken;
    return secretToken;
  };

  /**
   * Answer to callback from inline keyboard
   * Use this method to send answers to callback queries sent from
   * inline keyboards. The answer will be displayed to the user as
   * a notification at the top of the chat screen or as an alert.
   * On success, True is returned.
   * >Alternatively, the user can be redirected to the specified
   * Game URL. For this option to work, you must first create a
   * game for your bot via \@BotFather and accept the terms.
   * Otherwise, you may use links like t.me/your_bot?start=XXXX
   * that open your bot with a parameter.
   * @link https://core.telegram.org/bots/api#answercallbackquery
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {callbackQueryAnswer} answer - answer options
   * @return {Promise<responseMessage>}
   */
  answerCallbackQuery = (answer) => {
    const url = `${this.#apiUrl}/answerCallbackQuery`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answer),
    };
    return this.#fetch(url, options);
  };
  /**
   * Set webhook
   * @date 1/25/2024 - 2:02:44 AM
   * @author @almaceleste https://almaceleste.github.io https://almaceleste.github.io
   * @link https://core.telegram.org/bots/api#setwebhook
   * @param {webhook} [webhook] - webhook parameters
   * @return {Promise<responseWebhook>}
   */
  setWebhook = (webhook) => {
    webhook.url = webhook.url ?
        webhook.url : this.#webhookUrl;
    webhook.secret_token = webhook.secret_token ?
        webhook.secret_token : this.#secretToken;
    // check if max_connections > 0 and <= 100
    webhook.max_connections =
        (Math.abs(webhook.max_connections - 100) < 100) ?
            webhook.max_connections : 40;
    const url = `${this.#apiUrl}/setWebhook`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhook),
    };
    // console.dir(options.method);
    return this.#fetch(url, options);
  };
  /**
   * Get webhook info
   * @date 1/28/2024 - 11:16:32 PM
   * @author @almaceleste  https://almaceleste.github.io
   * @link https://core.telegram.org/bots/api#getwebhookinfo
   * @return {Promise<responseWebhookInfo>}
   */
  getWebhook = () => {
    const url = `${this.#apiUrl}/getWebhookInfo`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'GET',
    };
    return this.#fetch(url, options);
  };
  /**
   * Delete webhook
   * @date 1/28/2024 - 11:23:08 PM
   * @author @almaceleste  https://almaceleste.github.io
   * @link https://core.telegram.org/bots/api#setwebhook
   * @return {Promise<responseWebhook>}
   */
  deleteWebhook = () => {
    const url = `${this.#apiUrl}/setWebhook`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'GET',
    };
    return this.#fetch(url, options);
  };
  /**
   * Fetch a file from the Telegram server
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {string} filePath -
   * @return {Promise<Blob>}
   */
  fetchFile = (filePath) => new Promise(async (resolve, reject) => {
    const url = `https://api.telegram.org/file/bot${this.#token}/${filePath}`;
    const response = await fetch(url)
        .catch((reason) => reject(reason));
    if (!response ||
      response?.status !== 200 ||
      typeof response?.blob !== 'function') resolve(undefined);
    const data = await response.blob();
    resolve(data);
  });
  /**
   * Get basic file information about a file and prepare it for
   * downloading. For the moment, bots can download files of up to
   * 20MB in size. On success, a File object is returned. The file
   * can then be downloaded via the link
   * https://api.telegram.org/file/bot<token>/<file_path>, where
   * <file_path> is taken from the response. It is guaranteed that
   * the link will be valid for at least 1 hour. When the link
   * expires, a new one can be requested by calling getFile again.
   * @link https://core.telegram.org/bots/api#getfile
   * @date 2/3/2024 - 3:16:12 AM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {object} file - file options
   * @param {string} file.file_id - File identifier to get information about
   * @return {Promise<responseFile>}
   */
  getFile = (file) => {
    const url = `${this.#apiUrl}/getFile`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(file),
    };
    return this.#fetch(url, options);
  };
  /**
   * Send a file as a document. On success, the sent Message is
   * returned. Bots can currently send files of any type of up to
   * 50 MB in size, this limit may be changed in the future.
   * @date 2/3/2024 - 7:37:46 PM
   * @author @almaceleste  https://almaceleste.github.io
   * @link https://core.telegram.org/bots/api#senddocument
   *
   * @param {string} chatId - chat id where to send the file
   * @param {object} file - file options
   * @param {Blob} file.blob - file content as blob
   * @param {string} file.filename - file name as it will be
   * indicated in chat
   * @return {Promise<responseMessage>}
   */
  sendDocument = (chatId, file) => {
    const url = `${this.#apiUrl}/sendDocument`;
    const data = new FormData();
    data.append('chat_id', chatId);
    data.append('document', file.blob, file.filename);
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      body: data,
    };
    return this.#fetch(url, options);
  };
  /**
   * Send a message to the chat
   * @date 1/28/2024 - 2:50:56 AM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @param {messageOptions} message - message options
   * @return {Promise<responseMessage>}
   */
  sendMessage = (message) => {
    message.parse_mode = message.parse_mode ? message.parse_mode : 'MarkdownV2';
    message.disable_notification = message.disable_notification ?
        message.disable_notification : false;
    if (message.parse_mode === 'MarkdownV2') {
      const pattern = /([_*[\]()~`>#=|{}.!+-])/g;
      message.text = message.text.replace(pattern, '\\$1');
    }
    const url = `${this.#apiUrl}/sendMessage`;
    /**
     * @type {fetchOptions}
     */
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    };
    return this.#fetch(url, options);
  };

  init = () => {
    this.#secretToken = app.secret.secretToken ?
        app.secret.secretToken : this.#setSecretToken(this.#generateToken());
    this.#token = app.secret.token;
    this.#webhookUrl = app.secret.telegram;
    this.#setApiUrl();
  };

  /**
   * Creates an instance of TelegramApi.
   * @date 1/29/2024 - 1:55:55 AM
   * @author @almaceleste  https://almaceleste.github.io
   *
   * @constructor
   * @param {object} [options] - telegram API parameters
   * @param {string} [options.token] - bot API token
   * @param {string} [options.webhook] - https URL to send updates to.
   * Use an empty string to remove webhook integration
   * @param {string} [options.secretToken] - a secret token to be sent in
   * a header `X-Telegram-Bot-Api-Secret-Token` in every webhook request, 1-256
   * characters. Only characters A-Z, a-z, 0-9, _ and - are allowed. The header
   * is useful to ensure that the request comes from a webhook set by you.
   */
  constructor(options = {}) {
    this.#secretToken = options.secretToken;
    this.#token = options.token;
    this.#webhookUrl = options.webhook;
    this.#setApiUrl();
  }
}

const telegramApi = new TelegramApi();

/**
 * @author @almaceleste https://almaceleste.github.io
 * @typedef {object} fetchOptions
 * @property {Blob|ArrayBuffer|DataView|FormData|URLSearchParams|
 * string|ReadableStream} [body] - body object
 * @property {'default'|'no-store'|'reload'|'no-cache'|
 * 'force-cache'|'only-if-cached'} [cache] - cache mode to use for the request
 * @property {'omit'|'same-origin'|'include'} [credentials] - sent
 * credentials with the request always, never, or only to a same-origin URL
 * @property {object} [headers] - request headers
 * @property {boolean} [integrity] - sub-resource integrity value of
 * the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=)
 * @property {boolean} [keepalive] - indicates whether to make
 * a persistent connection for multiple requests/responses
 * @property {'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|
 * 'OPTIONS'|'TRACE'} [method] - request method; default is 'GET'
 * @property {'cors'|'no-cors'|'same-origin'} [mode] - mode to use
 * for the request, e.g., cors, no-cors, or same-origin.
 * @property {'high'|'low'|'auto'} [priority] - specifies the
 * priority of the fetch request relative to other requests of the same type
 * @property {'follow'|'error'|'manual'} [redirect] - redirect mode
 * to use in request; indicates whether request follows redirects,
 * results in an error upon encountering a redirect, or
 * returns the redirect (in an opaque fashion); default is 'follow'
 * @property {'no-referrer'|'client'|URL} [referrer] - string whose
 * value is a same-origin URL, "about:client", or the empty string,
 * to set request's referrer
 * @property {'no-referrer'|'no-referrer-when-downgrade'|
 * 'same-origin'|'origin'|'strict-origin'|
 * 'origin-when-cross-origin'|'strict-origin-when-cross-origin'|
 * 'unsafe-url'} [referrerPolicy] - string that changes how the
 * referrer header is populated during certain actions (e.g.,
 * fetching sub-resources, prefetching, performing navigation)
 * @property {AbortSignal} [signal] - an AbortSignal object which
 * can be used to communicate with/abort a request
 * @property {null} [window] - can only be null; used to
 * disassociate request from any window
 */
/**
 * @author @almaceleste https://almaceleste.github.io
 * @link https://core.telegram.org/bots/api#setwebhook
 * @typedef {object} account
 * @property {number} id - Unique identifier for this user or
 * bot. This number may have more than 32 significant bits and
 * some programming languages may have difficulty/silent defects
 * in interpreting it. But it has at most 52 significant bits, so
 * a 64-bit integer or double-precision float type are safe for
 * storing this identifier.
 * @property {string} [username] - username
 *
 * @typedef {'message'|'edited_message'|'channel_post'|
 * 'edited_channel_post'|'inline_query'|'chosen_inline_result'|
 * 'callback_query'|'shipping_query'|'pre_checkout_query'|
 * 'poll'|'poll_answer'|'my_chat_member'|'chat_member'|
 * 'chat_join_request'} allowedUpdate
 *
 * @typedef {object} attachment
 * @property {attachmentType} type
 * @property {number} [duration]
 * @property {string} [emoji]
 * @property {string} [file_id]
 * @property {string} [file_name]
 * @property {number} [file_size]
 * @property {string} [file_unique_id]
 * @property {number} [height]
 * @property {boolean} [is_animated]
 * @property {boolean} [is_video]
 * @property {string} [set_name]
 * @property {string} [mime_type]
 * @property {fileThumbnail} [thumb]
 * @property {fileThumbnail} [thumbnail]
 * @property {number} [width]
 *
 * @typedef {'Audio'|'Document'|'OtherOrNone'|'Photo'|'Sticker'|
 * 'Video'|'Voice'|'VideoNote'} attachmentType
 *
 * @link https://core.telegram.org/bots/api#callbackquery
 * @typedef {object} callbackQuery
 * @property {string} id - Unique identifier for this query
 * @property {user} from - Sender
 * @property {messageMaybeInaccessible} [message] - Message sent by
 * the bot with the callback button that originated the query
 * @property {string} [inline_message_id] - Identifier of the
 * message sent via the bot in inline mode, that originated the
 * query.
 * @property {string} chat_instance - Global identifier, uniquely
 * corresponding to the chat to which the message with the callback
 * button was sent. Useful for high scores in games.
 * @property {string} [data] - Data associated with the callback
 * button. Be aware that the message originated the query can
 * contain no callback buttons with this data.
 * @property {string} [game_short_name] - Short name of a Game to be
 * returned, serves as the unique identifier for the game
 *
 * @typedef {object} callbackQueryAnswer
 * @property {string} callback_query_id - Unique identifier for the
 * query to be answered
 * @property {string} [text] - Text of the notification. If not
 * specified, nothing will be shown to the user, 0-200 characters
 * @property {boolean} [show_alert] - If True, an alert will be
 * shown by the client instead of a notification at the top of the
 * chat screen. Defaults to false.
 * @property {string} [url] - URL that will be opened by the user's
 * client. If you have created a Game and accepted the conditions
 * via `@BotFather`, specify the URL that opens your game - note
 * that this will only work if the query comes from a
 * `callback_game` button.
 * Otherwise, you may use links like `t.me/your_bot?start=XXXX` that
 * open your bot with a parameter.
 * @property {number} [cache_time] - The maximum amount of time in
 * seconds that the result of the callback query may be cached
 * client-side. Telegram apps will support caching starting in
 * version 3.14. Defaults to 0.
 *
 * @typedef {fullName & contactProps} contact
 * @typedef {fullName & account} sender
 * @typedef {sender & senderUser} user
 * @typedef {sender & senderChat} chat - Chat the message belonged
 * to
 *
 * @typedef {object} contactProps
 * @property {string} phone_number - Contact's phone number
 * @property {number} [user_id] - Contact's user identifier in
 * Telegram. This number may have more than 32 significant bits
 * and some programming languages may have difficulty/silent
 * defects in interpreting it. But it has at most 52 significant
 * bits, so a 64-bit integer or double-precision float type are
 * safe for storing this identifier.
 * @property {string} [vcard] - data about the contact in the form
 * of a vCard
 *
 * @typedef {object} editDateProps
 * @property {number} [edit_date] - Date the message was last edited
 * in Unix time
 *
 * @typedef {object} entity
 * @property {'mention'|'hashtag'|'cashtag'|'bot_command'|'url'|
 * 'email'|'phone_number'|'bold'|'italic'|'underline'|
 * 'strikethrough'|'spoiler'|'blockquote'|'code'|'pre'|
 * 'text_link'|'text_mention'|'custom_emoji'} type - Type of the
 * entity. Currently, can be `mention` (@username), `hashtag`
 * (#hashtag), `cashtag` ($USD), `bot_command` (/start@jobs_bot),
 * `url` (`https://telegram.org`), `email` (do-not-reply@telegram.
 * org), `phone_number` (+1-212-555-0123), `bold` (bold text),
 * `italic` (italic text), `underline` (underlined text),
 * `strikethrough` (strikethrough text), `spoiler` (spoiler
 * message), `blockquote` (block quotation), `code` (monowidth
 * string), `pre` (monowidth block), `text_link` (for clickable
 * text URLs), `text_mention` (for users without usernames),
 * `custom_emoji` (for inline custom emoji stickers)
 * @property {number} offset - Offset in UTF-16 code units to the
 * start of the entity
 * @property {number} length - Length of the entity in UTF-16 code
 * units
 * @property {string} [url] - For `text_link` only, URL that will
 * be opened after user taps on the text
 * @property {user} [user] - For `text_mention` only, the mentioned
 * user
 * @property {string} [language] - For `pre` only, the
 * programming language of the entity text
 * @property {string} [custom_emoji_id] - For `custom_emoji`
 * only, unique identifier of the custom emoji. Use
 * `getCustomEmojiStickers` to get full information about the
 * sticker
 *
 * @typedef {fileProps & filePathProps} file
 * @typedef {fileMedia & fileSizeProps} fileAnimation
 * @typedef {fileMedia & fileAudioProps} fileAudio
 * @typedef {fileProps & fileDocumentProps} fileDocument
 * @typedef {fileProps & fileDocumentProps & fileDuration} fileMedia
 * @typedef {fileProps & fileSizeProps} filePhotoSize
 * @typedef {fileProps & fileSizeProps & fileStickerProps} fileSticker
 * @typedef {fileMedia & fileSizeProps} fileVideo
 * @typedef {fileProps & fileDuration & fileThumbnail &
 * fileLength} fileVideoNote
 * @typedef {fileProps & fileDuration & fileMimeType} fileVoice
 *
 * @typedef {object} fileAudioProps
 * @property {string} [performer] - Performer of the audio as
 * defined by sender or by audio tags
 * @property {string} [title] - Title of the audio as defined by
 * sender or by audio tags
 *
 * @typedef {object} fileDocumentProps
 * @property {filePhotoSize} [thumbnail] - Animation thumbnail as
 * defined by sender
 * @property {string} [file_name] - Original animation filename
 * as defined by sender
 * @property {string} [mime_type] - MIME type of the file as
 * defined by sender
 *
 * @typedef {object} fileDuration
 * @property {number} duration - Duration of the video in seconds
 * as defined by sender
 *
 * @typedef {object} fileLength
 * @property {number} length - video width and height (diameter of
 * the video
 * message) as defined by sender
 *
 * @typedef {object} fileMimeType
 * @property {string} [mime_type] - MIME type of the file as
 * defined by sender
 *
 * @typedef {object} filePathProps
 * @property {string} [file_path] - File path. Use
 * `https://api.telegram.org/file/bot<token>/<file_path>` to get
 * the file.
 *
 * @typedef {object} fileProps
 * @property {string} file_id - Identifier for this file, which
 * can be used to download or reuse the file
 * @property {string} file_unique_id - Unique identifier for this
 * file, which is supposed to be the same over time and for
 * different bots. Can't be used to download or reuse the file.
 * @property {number} [file_size] - File size in bytes. It can be
 * bigger than 2^31 and some programming languages may have
 * difficulty/silent defects in interpreting it. But it has at
 * most 52 significant bits, so a signed 64-bit integer or
 * double-precision float type are safe for storing this value.
 *
 * @typedef {object} fileSizeProps
 * @property {number} width - width
 * @property {number} height - height
 *
 * @typedef {object} fileStickerProps
 * @property {'regular'|'mask'|'custom_emoji'} type - Type of the
 * sticker, currently one of `regular`, `mask`, `custom_emoji`.
 * The type of the sticker is independent from its format, which
 * is determined by the fields is_animated and is_video.
 * @property {boolean} is_animated - `true`, if the sticker is
 * animated
 * @property {boolean} is_video - `true`, if the sticker is a video
 * sticker
 * @property {filePhotoSize} [thumbnail] - Sticker thumbnail in the
 * .WEBP or .JPG format
 * @property {string} [emoji] - Emoji associated with the sticker
 * @property {string} [set_name] - Name of the sticker set to
 * which the sticker belongs
 * @property {file} [premium_animation] - For premium regular
 * stickers, premium animation for the sticker
 * @property {string} [custom_emoji_id] - For custom emoji
 * stickers, unique identifier of the custom emoji
 * @property {boolean} [needs_repainting] - `true`, if the
 * sticker must be repainted to a text color in messages, the
 * color of the Telegram Premium badge in emoji status, white
 * color on chat photos, or another appropriate color in other
 * places
 *
 * @typedef {null} fileStory - This object represents a message
 * about a forwarded story in the chat. Currently holds no
 * information.
 *
 * @typedef {object} fileThumbnail
 * @property {filePhotoSize} [thumbnail] - Animation thumbnail as
 * defined by sender
 *
 * @typedef {object} fullName
 * @property {string} first_name - first name
 * @property {string} [last_name] - last name
 *
 * @link https://core.telegram.org/bots/api#inlinekeyboardbutton
 * @typedef {object} inlineKeyboardButton
 * @property {string} text - Label text on the button
 * @property {string} [url] - HTTP or tg:// URL to be opened when
 * the button is pressed. Links tg://user?id=<user_id> can be used
 * to mention a user by their identifier without using a username,
 * if this is allowed by their privacy settings.
 * @property {string} [callback_data] - Data to be sent in a
 * callback query to the bot when button is pressed, 1-64 bytes
 *
 * @link https://core.telegram.org/bots/api#inlinekeyboardmarkup
 * @typedef {object} inlineKeyboardMarkup
 * @property {inlineKeyboardButton[][]} inline_keyboard - Array of
 * button rows, each represented by an Array of
 * InlineKeyboardButton objects
 *
 * @link https://core.telegram.org/bots/api#keyboardbutton
 * @typedef {object} keyboardButton
 * @property {string} text - Text of the button. If none of the
 * optional fields are used, it will be sent as a message when the
 * button is pressed
 *
 * @typedef {messageProps & messageNonRepliedProps} message
 *
 * @typedef {message & editDateProps} messageEdited
 *
 * @typedef {object} messageInaccessible - This object describes
 * a message that was deleted or is otherwise inaccessible to the
 * bot.
 * @property {chat} chat - Chat the message belonged to
 * @property {number} message_id - unique message identifier inside
 * the chat
 * @property {0} date - inaccessible message: always 0. The field
 * can be used to differentiate regular and inaccessible messages.
 *
 * @typedef {messageProps & messageInaccessible} messageMaybeInaccessible
 *
 * @typedef {object} messageNonRepliedProps
 * @property {messageProps} [reply_to_message] - For replies in the
 * same chat and message thread, the original message. Note that
 * the Message object in this field will not contain further
 * reply_to_message fields even if it itself is a reply.
 *
 * @typedef {object} messageOptions
 * @property {string|number} chat_id - chat id
 * @property {string} text - message text
 * @property {undefined|'HTML'|'Markdown'|'MarkdownV2'} [parse_mode]
 * - message parse mode
 * @property {boolean} [disable_notification] - send the message
 * silently. Users will receive a notification with no sound.
 * @property {replyMarkup} [reply_markup] - A JSON-serialized
 * object for an inline keyboard, custom reply keyboard,
 * instructions to remove reply keyboard or to force a reply from
 * the user.
 *
 * @typedef {object} messageProps
 * @property {number} message_id - unique message identifier inside
 * the chat
 * @property {number} date - date the message was sent in Unix
 * time. It is always a positive number, representing a valid date.
 * @property {string} [text] - the actual UTF-8 text of the message
 * @property {user} [from] - sender of the message
 * @property {chat} chat - chat the message belonged to
 * @property {origin} [forward_origin] - information about the
 * original message for forwarded messages
 * @property {user} [via_bot] - Bot through which the message was
 * sent
 * @property {boolean} [has_protected_content] - `true`, if the
 * message can't be forwarded
 * @property {string} [media_group_id] - The unique identifier of
 * a media message group this message belongs to
 * @property {string} [author_signature] - Signature of the post
 * author for messages in channels, or the custom title of an
 * anonymous group administrator
 * @property {entity[]} [entities] - For text messages, special
 * entities like usernames, URLs, bot commands, etc. that appear in
 * the text
 * @property {fileAnimation} [animation] - Message is an animation,
 * information about the animation. For backward compatibility,
 * when this field is set, the document field will also be set
 * @property {fileAudio} [audio] - information about an audio file
 * @property {fileDocument} [document] - information about a general
 * file
 * @property {filePhotoSize[]} [photo] - information about a photo,
 * sizes etc.
 * @property {fileSticker} [sticker] - information about a sticker
 * @property {fileStory} [story] - information about a forwarded
 * story
 * @property {fileVideo} [video] - information about a video
 * @property {fileVideoNote} [video_note] - information about a
 * video note
 * @property {fileVoice} [voice] - information about a voice message
 * @property {string} [caption] - Caption for the animation, audio,
 * document, photo, video or voice
 * @property {entity[]} [caption_entities] - For messages with a
 * caption, special entities like usernames, URLs, bot commands,
 * etc. that appear in the caption
 * @property {contact} [contact] - information about a contact
 * @property {message & inaccessibleMessage} [pinned_message] -
 * Specified message was pinned. Note that the Message object in
 * this field will not contain further reply_to_message fields
 * even if it itself is a reply.
 * @property {attachment} attachment - information about an attached media
 *
 * @typedef {originProps & originUserProps} originUser
 * @typedef {originProps & originHiddenUserProps} originHiddenUser
 * @typedef {originProps & originChatProps} originChat
 * @typedef {originProps & originChannelProps} originChannel
 * @typedef {originUser & originHiddenUser & originChat &
 * originChannel} origin
 *
 * @typedef {object} originChannelProps
 * @property {chat} chat - Channel chat to which the message was
 * originally sent
 * @property {number} message_id - Unique message identifier inside
 * the chat
 * @property {string} [author_signature] - Signature of the
 * original post author
 *
 * @typedef {object} originChatProps
 * @property {chat} sender_chat - Chat that sent the message
 * originally
 * @property {string} [author_signature] - For messages
 * originally sent by an anonymous chat administrator, original
 * message author signature
 *
 * @typedef {object} originHiddenUserProps
 * @property {string} sender_user_name - Name of the user that
 * sent the message originally
 *
 * @typedef {object} originProps
 * @property {'user'|'hidden_user'|'chat'|'channel'} type - Type
 * of the message origin
 * @property {number} date - Date the message was sent originally
 * in Unix time
 *
 * @typedef {object} originUserProps
 * @property {user} sender_user - User that sent the message
 * originally
 *
 * @typedef {object} replyForce
 * @property {true} force_reply - Shows reply interface to the user,
 * as if they manually selected the bot's message and tapped 'Reply'
 *
 * @link https://core.telegram.org/bots/api#replykeyboardmarkup
 * @typedef {object} replyKeyboardMarkup
 * @property {keyboardButton[][]} keyboard - Array of button rows,
 * each represented by an Array of KeyboardButton objects
 * @property {boolean} [is_persistent] - Requests clients to always
 * show the keyboard when the regular keyboard is hidden. Defaults
 * to false, in which case the custom keyboard can be hidden and
 * opened with a keyboard icon.
 * @property {boolean} [resize_keyboard] - Requests clients to
 * resize the keyboard vertically for optimal fit (e.g., make the
 * keyboard smaller if there are just two rows of buttons).
 * Defaults to false, in which case the custom keyboard is always
 * of the same height as the app's standard keyboard.
 * @property {boolean} [one_time_keyboard] - Requests clients to
 * hide the keyboard as soon as it's been used. The keyboard will
 * still be available, but clients will automatically display the
 * usual letter-keyboard in the chat - the user can press a special
 * button in the input field to see the custom keyboard again.
 * Defaults to false.
 * @property {string} [input_field_placeholder] - The placeholder to
 * be shown in the input field when the keyboard is active; 1-64
 * characters
 *
 * @link https://core.telegram.org/bots/api#replykeyboardremove
 * @typedef {object} replyKeyboardRemove
 * @property {boolean} remove_keyboard - Requests clients to remove
 * the custom keyboard (user will not be able to summon this
 * keyboard; if you want to hide the keyboard from sight but keep
 * it accessible, use one_time_keyboard in ReplyKeyboardMarkup)
 *
 * @typedef {inlineKeyboardMarkup & replyKeyboardMarkup &
 * replyKeyboardRemove & replyForce} replyMarkup
 *
 * @typedef {object} responseWebhook
 * @property {boolean} ok
 * @property {boolean} result
 * @property {string} description
 *
 * @link https://core.telegram.org/bots/api#getfile
 * @typedef {object} responseFile
 * @property {boolean} ok
 * @property {file} result
 *
 * @typedef {object} responseMessage
 * @property {boolean} ok
 * @property {message} result
 *
 * @typedef {object} responseWebhookInfo
 * @property {boolean} ok
 * @property {object} result
 * @property {boolean} result.has_custom_certificate
 * @property {number} result.pending_update_count
 * @property {number} result.max_connections
 * @property {string} result.ip_address
 * @property {allowedUpdate[]} result.allowed_updates
 *
 * @typedef {object} senderChat
 * @property {'private'|'group'|'supergroup'|'channel'} type -
 * Type of chat
 * @property {string} [title] - Title, for supergroups, channels
 * and group chats
 * @property {boolean} [is_forum] - `true`, if the supergroup chat
 * is a forum (has topics enabled)
 *
 * @typedef {object} senderUser
 * @property {boolean} is_bot - `true`, if this user is a bot
 * @property {string} [language_code] -
 * {@link https://en.wikipedia.org/wiki/IETF_language_tag|IETF language tag} of the user's language
 * @property {boolean} [is_premium] - `true`, if this user is a
 * Telegram Premium user
 *
 * @link https://core.telegram.org/bots/api#update
 * @typedef {object} update - This object represents an incoming
 * update.
 * @property {number} update_id - The update's unique identifier.
 * Update identifiers start from a certain positive number and
 * increase sequentially. This identifier becomes especially
 * handy if you're using webhooks, since it allows you to ignore
 * repeated updates or to restore the correct update sequence,
 * should they get out of order. If there are no new updates for
 * at least a week, then identifier of the next update will
 * be chosen randomly instead of sequentially.
 * @property {message} [message] - New incoming message of any
 * kind - text, photo, sticker, etc.
 * @property {messageEdited} [edited_message] - New version of a
 * message that is known to the bot and was edited. This update
 * may at times be triggered by changes to message fields that
 * are either unavailable or not actively used by your bot.
 * @property {callbackQuery} [callback_query] - New incoming
 * callback query. This object represents an incoming callback
 * query from a callback button in an inline keyboard. If the
 * button that originated the query was attached to a message sent
 * by the bot, the field message will be present. If the button was
 * attached to a message sent via the bot (in inline mode), the
 * field inline_message_id will be present. Exactly one of the
 * fields data or game_short_name will be present.
 * >NOTE: After the user presses a callback button, Telegram
 * clients will display a progress bar until you call
 * answerCallbackQuery. It is, therefore, necessary to react by
 * calling answerCallbackQuery even if no notification to the user
 * is needed (e.g., without specifying any of the optional
 * parameters).
 *
 * @typedef {object} webhook - webhook parameters
 * @property {string} url - https URL to send updates to. Use an
 * empty string to remove webhook integration
 * @property {string} [certificate] - url to public key certificate
 * so that the root certificate in use can be checked
 * @property {string} [ip_address] - fixed IP address which will be
 * used to send webhook requests instead of the IP address resolved
 * through DNS
 * @property {number} [max_connections] - maximum allowed number of
 * simultaneous HTTPS connections to the webhook for update
 * delivery, 1-100.
 * Defaults to 40. Use lower values to limit the load on your bot's
 * server, and higher values to increase your bot's throughput.
 * @property {allowedUpdate[]} [allowed_updates] - JSON-serialized
 * list of the update types you want your bot to receive. For
 * example, specify ['message', 'edited_channel_post',
 * 'callback_query'] to only receive updates of these types. See
 * Update for a complete list of available update types. Specify an
 * empty list to receive all update types except chat_member,
 * message_reaction, and message_reaction_count (default).
 * If not specified, the previous setting will be used.
 * @property {boolean} [drop_pending_updates] - drop all pending
 * updates
 * @property {string} [secret_token] - a secret token to be sent in
 * a header `X-Telegram-Bot-Api-Secret-Token` in every webhook
 * request, 1-256 characters. Only characters `A-Z`, `a-z`, `0-9`,
 * `_` and `-` are allowed. The header is useful to ensure that the
 * request comes from a webhook set by you.
 */
