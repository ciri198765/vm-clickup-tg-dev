import {jest} from '@jest/globals';
import {responses} from './telegram-api.mock.js';

const mockFetch = jest.spyOn(global, 'fetch');
mockFetch.mockImplementation((url, options) =>
  new Promise((resolve, reject) => {
    const slug = url.split('/').pop();
    const data = responses[slug].get(options?.body);
    const response = {
      blob: () => new Blob([data]),
      json: () => data,
      ok: data ? true : false,
      status: data ? 200 : 404,
    };
    resolve(response);
  }));

import {TelegramApi} from '../app/telegram-api.js';

const token = undefined;
const apiUrl = `https://api.telegram.org/bot${token}`;
const webhookUrl = 'https://your.domain.com/webhook';
const telegramApi = new TelegramApi({
  token: token,
});

beforeEach(() => {
  mockFetch.mockClear();
});

describe('webhooks:', () => {
  it('set webhook', async () => {
    const url = new RegExp(`${apiUrl}/setWebhook`);
    await telegramApi.setWebhook({
      url: webhookUrl,
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
  });
  it('get webhook', async () => {
    const url = new RegExp(`${apiUrl}/getWebhookInfo`);
    await telegramApi.getWebhook();
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('GET');
  });
  it('delete webhook', async () => {
    const url = new RegExp(`${apiUrl}/setWebhook`);
    await telegramApi.deleteWebhook();
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('GET');
  });
});

describe('messages:', () => {
  it('send message', async () => {
    const url = new RegExp(`${apiUrl}/sendMessage`);
    await telegramApi.sendMessage({
      chat_id: '123',
      text: 'hello',
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
  });
});

describe('MarkdownV2:', () => {
  it('escape special characters with `\\`', async () => {
    const expected = '\\_\\*\\[\\]\\(\\)\\~\\`\\>\\#\\=\\|\\{\\}\\.\\!\\+\\-';
    await telegramApi.sendMessage({
      chat_id: '123',
      text: '_*[]()~`>#=|{}.!+-',
      parse_mode: 'MarkdownV2',
    });
    const body = mockFetch.mock.lastCall[1].body;
    expect(JSON.parse(body).text).toBe(expected);
  });
});

describe('get file:', () => {
  it('return file path information', async () => {
    const url = new RegExp(`${apiUrl}/getFile`);
    await telegramApi.getFile({
      file_id: 'someFileId',
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
  });
});

describe('fetch file:', () => {
  it('download file from the telegram as a blob', async () => {
    const filePath = 'photos/file_21.jpg';
    const url = new RegExp(`https://api.telegram.org/file/bot${token}/${filePath}`);
    await telegramApi.fetchFile(filePath);
    const resultBlob = (await mockFetch.mock.results.pop().value).blob();
    const resultText = await resultBlob.text();
    const resultMock = responses[filePath.split('/').pop()].get(undefined);

    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(resultText).toBe(resultMock);
  });
});

describe('send document:', () => {
  it('send local file to chat', async () => {
    const url = new RegExp(`${apiUrl}/sendDocument`);
    const text = '¡hola, mundo!';
    const chatId = '123456789';
    const file = new Blob([text], {type: 'plain/text'});
    await telegramApi.sendDocument(chatId, {
      blob: file,
      filename: 'document.txt',
    });
    const blob = mockFetch.mock.lastCall[1].body.get('document');
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    const headers = mockFetch.mock.lastCall[1].headers;
    expect(headers ? headers['Content-Type'] : headers).toBeUndefined();
    expect(await blob.text()).toBe(text);
  });
});

describe('callback query:', () => {
  it('answer callback query', async () => {
    const url = new RegExp(`${apiUrl}/answerCallbackQuery`);
    const text = 'Thank you';
    const callbackId = '1831457958420616596';
    await telegramApi.answerCallbackQuery({
      callback_query_id: callbackId,
      text: text,
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    const headers = mockFetch.mock.lastCall[1].headers;
    expect(headers ? headers['Content-Type'] : headers)
        .toBe('application/json');
  });
});
