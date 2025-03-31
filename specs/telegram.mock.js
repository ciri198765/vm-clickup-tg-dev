import {strings} from '../app/strings.js';

export {mocks, updates};

const chatId = 123456789;
const chatIdNew = 1234567890;
const firstName = 'Jane';
const lastName = 'Doe';
const username = 'jdoe';
const languageCode = 'en';
const botName = 'help_bot';

const updates = {
  callback: {
    'message': null,
    'update_id': 683518626,
    'channel_post': null,
    'inline_query': null,
    'callback_query': {
      'id': '1831457961185473344',
      'from': {
        'id': chatIdNew,
        'is_bot': false,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'language_code': languageCode,
      },
      'message': {
        'message_id': 357,
        'from': {
          'id': 6621147080,
          'is_bot': true,
          'first_name': botName,
          'username': botName,
        },
        'chat': {
          'id': chatIdNew,
          'first_name': firstName,
          'last_name': lastName,
          'username': username,
          'type': 'private',
        },
        'date': 1708650252,
        'text': strings[languageCode].doYouAgree,
        'reply_markup': {
          'inline_keyboard': [
            [
              {
                text: strings[languageCode].yes,
                callback_data: 'agreement.yes',
              },
              {
                text: strings[languageCode].no,
                callback_data: 'agreement.no',
              },
              {
                text: strings[languageCode].info,
                callback_data: 'agreement.info',
              },
            ],
          ],
        },
      },
      'chat_instance': '-6721759569613092847',
      'data': 'agreement.yes',
    },
    'edited_message': null,
    'edited_channel_post': null,
  },
  command: {
    'message': {
      'message_id': 360,
      'from': {
        'id': chatId,
        'is_bot': false,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'language_code': languageCode,
      },
      'chat': {
        'id': chatId,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'type': 'private',
      },
      'date': '2024-02-25T18:39:42.000Z',
      'text': '/start',
      'entities': [
        {
          'offset': 0,
          'length': 6,
          'type': 'bot_command',
        },
      ],
      'attachment': {
        'type': 'OtherOrNone',
      },
    },
    'update_id': 683518642,
    'channel_post': null,
    'inline_query': null,
    'callback_query': null,
    'edited_message': null,
    'edited_channel_post': null,
  },
  commandNew: {
    'message': {
      'message_id': 360,
      'from': {
        'id': chatIdNew,
        'is_bot': false,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'language_code': languageCode,
      },
      'chat': {
        'id': chatIdNew,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'type': 'private',
      },
      'date': '2024-02-25T18:39:42.000Z',
      'text': '/start',
      'entities': [
        {
          'offset': 0,
          'length': 6,
          'type': 'bot_command',
        },
      ],
      'attachment': {
        'type': 'OtherOrNone',
      },
    },
    'update_id': 683518642,
    'channel_post': null,
    'inline_query': null,
    'callback_query': null,
    'edited_message': null,
    'edited_channel_post': null,
  },
  message: {
    'message': {
      'message_id': 361,
      'from': {
        'id': chatId,
        'is_bot': false,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'language_code': languageCode,
      },
      'chat': {
        'id': chatId,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'type': 'private',
      },
      'date': '2024-02-26T21:27:49.000Z',
      'text': 'hola',
      'attachment': {
        'type': 'OtherOrNone',
      },
    },
    'update_id': 683518643,
    'channel_post': null,
    'inline_query': null,
    'callback_query': null,
    'edited_message': null,
    'edited_channel_post': null,
  },
  messageFile: {
    'message': {
      'message_id': 362,
      'from': {
        'id': chatId,
        'is_bot': false,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'language_code': languageCode,
      },
      'chat': {
        'id': chatId,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'type': 'private',
      },
      'date': '2024-02-26T22:55:52.000Z',
      'photo': [
        {
          'file_id': 'AgACAgIAAxkBAAIBamXcwADNAQ',
          'file_unique_id': 'AQADlNQxG1We6Up4',
          'file_size': 2595,
          'width': 90,
          'height': 90,
          'type': 'Photo',
        },
        {
          'file_id': 'AgACAgIAAxkBAAIBamXbQADNAQ',
          'file_unique_id': 'AQADlNQxG1We6Upy',
          'file_size': 3646,
          'width': 200,
          'height': 200,
        },
      ],
      'caption': 'hola',
      'attachment': {
        'file_id': 'AgACAgIAAxkBAAIBamXcwADNAQ',
        'file_unique_id': 'AQADlNQxG1We6Up4',
        'file_size': 2595,
        'width': 90,
        'height': 90,
        'type': 'Photo',
      },
    },
    'update_id': 683518644,
    'channel_post': null,
    'inline_query': null,
    'callback_query': null,
    'edited_message': null,
    'edited_channel_post': null,
  },
  messageNew: {
    'message': {
      'message_id': 361,
      'from': {
        'id': chatIdNew,
        'is_bot': false,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'language_code': languageCode,
      },
      'chat': {
        'id': chatIdNew,
        'first_name': firstName,
        'last_name': lastName,
        'username': username,
        'type': 'private',
      },
      'date': '2024-02-26T21:27:49.000Z',
      'text': 'hola',
      'attachment': {
        'type': 'OtherOrNone',
      },
    },
    'update_id': 683518643,
    'channel_post': null,
    'inline_query': null,
    'callback_query': null,
    'edited_message': null,
    'edited_channel_post': null,
  },
};

const mocks = {
  answerCallbackQuery: {
    [JSON.stringify(updates.callback)]: {
      callback_query_id: updates.callback.callback_query.id,
      text: strings[languageCode].thank,
    },
  },
  attachment: {
    undefined: new FormData()
        .append('attachment', new Blob(['some jpg data']), 'file_21.jpg'),
  },
  comment: {
    [JSON.stringify(updates.message)]: {
      comment_text: updates.message.message.text,
    },
    [JSON.stringify(updates.messageFile)]: {
      comment_text: updates.messageFile.message.caption,
    },
  },
  ['file_21.jpg']: {
    undefined: 'some jpg data',
  },
  field: {
    undefined: {
      'fields': [
        {
          'id': '160b9ee2-1df3-4070-8a3a-9bd43fe41625',
          'name': 'Для памяток',
          'type': 'checkbox',
          'type_config': {},
          'date_created': '1707161034565',
          'hide_from_guests': false,
          'required': false,
        },
        {
          'id': '345c0eab-fc02-4229-8a11-f71791de407b',
          'name': 'Email',
          'type': 'email',
          'type_config': {},
          'date_created': '1694860884857',
          'hide_from_guests': false,
          'required': false,
        },
        {
          'id': '565b9c07-cd77-4ba2-965f-0f34299b03ce',
          'name': 'Связь',
          'type': 'list_relationship',
          'type_config': {
            'fields': [],
            'subcategory_id': '901501151602',
            'subcategory_inverted_name': 'Requests',
          },
          'date_created': '1707574854772',
          'hide_from_guests': false,
          'required': false,
        },
        {
          'id': '56d5080d-ace5-43a5-a5d7-ba69dfb74ada',
          'name': 'Telegram/Signal',
          'type': 'short_text',
          'type_config': {},
          'date_created': '1696346576509',
          'hide_from_guests': false,
          'required': false,
        },
        {
          'id': '5e2fa78f-b99f-463f-848d-af45f75503eb',
          'name': 'Суть консультации',
          'type': 'labels',
          'type_config': {
            'options': [
              {
                'id': '361a9759-dff6-4263-b642-fc4a0bc54629',
                'label': 'Общая консультация',
                'color': '#ff7800',
              },
              {
                'id': 'bcf3b6ac-f596-4eb2-8f82-9856374e83dc',
                'label': 'Обучение',
                'color': '#81B1FF',
              },
            ],
          },
          'date_created': '1707247210374',
          'hide_from_guests': false,
          'required': false,
        },
      ],
    },
  },
  getFile: {
    [JSON.stringify(updates.messageFile.message.photo[1])]: {
      'ok': true,
      'result': {
        'file_id': 'AgACAgIAAxkBAAIBamXbQADNAQ',
        'file_unique_id': 'AQADlNQxG1We6Upy',
        'file_size': 3646,
        'file_path': 'photos/file_21.jpg',
      },
    },
  },
  sendMessage: {
    [JSON.stringify(updates.callback)]: {
      chat_id: chatIdNew,
      text: strings[languageCode].howCanWeHelp,
      parse_mode: 'MarkdownV2',
      disable_notification: false,
    },
    [JSON.stringify(updates.command)]: {
      chat_id: chatId,
      text: strings[languageCode].welcomeBack,
      parse_mode: 'MarkdownV2',
      disable_notification: false,
    },
    [JSON.stringify(updates.commandNew)]: {
      chat_id: chatIdNew,
      text: strings[languageCode].doYouAgree,
      parse_mode: 'MarkdownV2',
      disable_notification: false,
      reply_markup: {
        inline_keyboard: [
          [
            {text: strings[languageCode].yes,
              callback_data: 'agreement.yes'},
            {text: strings[languageCode].no,
              callback_data: 'agreement.no'},
            {text: strings[languageCode].info,
              callback_data: 'agreement.info'},
          ],
        ],
      },
    },
    [JSON.stringify(updates.messageNew)]: {
      chat_id: chatIdNew,
      text:
        strings[languageCode].weCannotProceed,
      parse_mode: 'MarkdownV2',
      disable_notification: false,
    },
  },
  task: {
    [JSON.stringify(updates.callback)]: {
      name: `${firstName} ${lastName}`,
      description: `chat-id: ${chatIdNew}\naccount: ${username}`,
      custom_fields: [{
        id: '56d5080d-ace5-43a5-a5d7-ba69dfb74ada',
        value: username,
      }],
    },
    [JSON.stringify({
      name: `${firstName} ${lastName}`,
      description: `chat-id: ${chatIdNew}\naccount: ${username}`,
      custom_fields: [{
        id: '56d5080d-ace5-43a5-a5d7-ba69dfb74ada',
        value: username,
      }],
    })]: {
      'id': '8693u8e4r',
    },
  },
};
