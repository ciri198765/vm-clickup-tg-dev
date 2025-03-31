export {responses};

const responses = {
  answerCallbackQuery: new Map([
    [JSON.stringify({
      'callback_query_id': '1831457958420616596',
      'text': 'Thank you',
    }), {
      'ok': true,
      'result': true,
    }],
  ]),
  ['file_21.jpg']: new Map([
    [undefined, 'some jpg data'],
  ]),
  getFile: new Map([
    [JSON.stringify({
      file_id: 'someFileId',
    }), {
      'ok': true,
      'result': {
        'file_id': 'someFileId',
        'file_unique_id': 'AQADjtIxGyWQ2Ul9',
        'file_size': 47594,
        'file_path': 'photos/file_17.jpg',
      },
    }],
  ]),
  getWebhookInfo: new Map([
    [JSON.stringify(undefined), {
      'ok': true,
      'result': {
        'url': 'https://your.domain.com/telegram',
        'has_custom_certificate': false,
        'pending_update_count': 0,
        'max_connections': 40,
        'ip_address': '12.345.678.90',
        'allowed_updates': [
          'message',
          'edited_message',
          'channel_post',
          'edited_channel_post',
          'inline_query',
          'chosen_inline_result',
          'callback_query',
          'shipping_query',
          'pre_checkout_query',
          'poll',
          'poll_answer',
          'my_chat_member',
          'chat_member',
          'chat_join_request',
        ],
      },
    }],
  ]),
  sendDocument: new Map([
    [await createFormData([
      ['chat_id', '123456789'],
      ['document', new File(
          ['¡hola, mundo!'],
          'document.txt',
          {type: 'plain/text'})],
    ]), {
      'ok': true,
      'result': {
        'message_id': 338,
        'from': {
          'id': 6621147080,
          'is_bot': true,
          'first_name': 'test bot',
          'username': 'test_bot',
        },
        'chat': {
          'id': 123456789,
          'first_name': 'Jane',
          'last_name': 'Doe',
          'username': 'jdoe',
          'type': 'private',
        },
        'date': 1706993207,
        'document': {
          'file_name': 'document.txt',
          'mime_type': 'text/plain',
          'file_id': 'BQACAgIAAxkDAAIBUmW',
          'file_unique_id': 'AgAD0z4AAmuZ-Ek',
          'file_size': 14,
        },
      },
    }],
  ]),
  sendMessage: new Map([
    [JSON.stringify({
      'chat_id': '123',
      'text': 'hello',
      'parse_mode': 'MarkdownV2',
      'disable_notification': false,
    }), {
      'ok': true,
      'result': {
        'message_id': 273,
        'from': {
          'id': 6621147080,
          'is_bot': true,
          'first_name': 'test bot',
          'username': 'test_bot',
        },
        'chat': {
          'id': 123456789,
          'first_name': 'Jane',
          'last_name': 'Doe',
          'username': 'jdoe',
          'type': 'private',
        },
        'date': 1706398861,
        'text': '¡hola, mundo!',
      },
    }],
    [JSON.stringify({
      'chat_id': '123',
      'text': '\\_\\*\\[\\]\\(\\)\\~\\`\\>\\#\\=\\|\\{\\}\\.\\!\\+\\-',
      'parse_mode': 'MarkdownV2',
      'disable_notification': false,
    }), {
      'ok': true,
      'result': {
        'message_id': 329,
        'from': {
          'id': 6621147080,
          'is_bot': true,
          'first_name': 'test bot',
          'username': 'test_bot',
        },
        'chat': {
          'id': 123456789,
          'first_name': 'Jane',
          'last_name': 'Doe',
          'username': 'jdoe',
          'type': 'private',
        },
        'date': 1706914207,
        'text': '_*[]()~`>#=|{}.!+-',
      },
    }],
  ]),
  setWebhook: new Map([
    [JSON.stringify(undefined), {
      'ok': true,
      'result': true,
      'description': 'Webhook was deleted',
    }],
    [JSON.stringify({
      'url': 'https://your.domain.com/webhook',
      'max_connections': 40,
    }), {
      'ok': true,
      'result': true,
      'description': 'Webhook was set',
    }],
  ]),
};

/**
 * Create FormData object from the array of
 * [key, value]
 * @date 2/4/2024 - 2:13:02 AM
 * @author @almaceleste  https://almaceleste.github.io
 *
 * @async
 * @param {[string, any][]} fields
 * @return {Promise<FormData>}
 */
async function createFormData(fields) {
  const data = new FormData();
  await Promise.all(fields.map(([key, value]) => data.append(key, value)));
  return data;
}

// /**
//  * Serialize FormData object
//  * @date 2/4/2024 - 2:23:26 AM
//  * @author @almaceleste  https://almaceleste.github.io
//  *
//  * @param {FormData} data
//  * @return {JSON}
//  */
// function serializeFormData(data) {
//   const obj = {};
//   data.forEach((value, key) => obj[key] = value);
//   console.dir(obj);
//   console.dir(JSON.stringify(obj));
//   return JSON.stringify(obj);
// }
