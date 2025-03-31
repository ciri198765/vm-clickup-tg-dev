import {jest} from '@jest/globals';
import {mocks, updates} from './telegram.mock.js';

import {clickupApi} from '../app/clickup-api.js';
import {strings} from '../app/strings.js';
import {telegramApi} from '../app/telegram-api.js';

const account = 'jdoe';
const chatId = '123456789';
const listId = '12345678';
const taskId = '8693b10w6';
const response = {
  end: () => undefined,
  writeHead: function() {
    return this;
  },
};

globalThis.app = {
  base: {chats: {[chatId]: {chat: chatId, task: taskId, account: account}}},
  config: {clickup: {listId: listId}},
  clickupApi: clickupApi,
  strings: strings,
  telegramApi: telegramApi,
};

import {telegram} from '../app/telegram.js';

const mockFetch = jest.spyOn(global, 'fetch');
mockFetch.mockImplementation((url, options) =>
  new Promise(async (resolve, reject) => {
    const slug = url.split('/').pop();
    const data = mocks[slug][options?.body];
    const response = {
      blob: () => new Blob([data]),
      json: () => data,
      ok: data ? true : false,
      status: data ? 200 : 404,
    };
    resolve(response);
  }),
);

const createRequest = (body) => new Request('http://domain.com', {method: 'POST', body: body});
const parseBody = (body) => {
  // remove MarkdownV2 character escapes and parse to object
  return JSON.parse(body.replace(/\\\\/g, ''));
};

beforeEach(() => {
  mockFetch.mockClear();
});

describe('handle:', () => {
  it('handle command `/start` from registered user', async () => {
    const body = JSON.stringify(updates.command);
    const request = createRequest(body);
    await telegram.handle(request, response);
    const resultBody = parseBody(mockFetch.mock.lastCall[1].body);
    expect(mockFetch).toHaveBeenCalled();
    expect(resultBody).toEqual(mocks.sendMessage[body]);
  });
  it('handle command `/start` from unregistered user', async () => {
    const body = JSON.stringify(updates.commandNew);
    const request = createRequest(body);
    await telegram.handle(request, response);
    const resultBody = parseBody(mockFetch.mock.lastCall[1].body);
    expect(mockFetch).toHaveBeenCalled();
    expect(resultBody).toEqual(mocks.sendMessage[body]);
  });
  it('handle message from registered user', async () => {
    const body = JSON.stringify(updates.message);
    const request = createRequest(body);
    await telegram.handle(request, response);
    const resultBody = parseBody(mockFetch.mock.lastCall[1].body);
    expect(mockFetch).toHaveBeenCalled();
    expect(resultBody).toEqual(mocks.comment[body]);
  });
  it('handle message from unregistered user', async () => {
    const body = JSON.stringify(updates.messageNew);
    const bodyStart = JSON.stringify(updates.commandNew);
    const request = createRequest(body);
    await telegram.handle(request, response);
    const calls = mockFetch.mock.calls;
    const firstBody = parseBody(calls[0][1].body);
    const secondBody = parseBody(calls[1][1].body);
    expect(firstBody).toEqual(mocks.sendMessage[body]);
    expect(secondBody).toEqual(mocks.sendMessage[bodyStart]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
  it('handle message with attachment', async () => {
    const body = JSON.stringify(updates.messageFile);
    const request = createRequest(body);
    await telegram.handle(request, response);
    const calls = mockFetch.mock.calls;

    const commentBody = parseBody(calls[0][1].body);
    const commentMock = mocks.comment[body];
    expect(commentBody).toEqual(commentMock);

    const getFileBodyRaw = calls[1][1].body;
    const getFileBody = parseBody(getFileBodyRaw);
    const getFileMock = updates.messageFile.message.photo[1];
    expect(getFileBody.file_id).toEqual(getFileMock.file_id);

    const fetchFileResponse = await mockFetch.mock.results[2].value;
    const fetchFileBlob = await fetchFileResponse.blob();
    const fetchFileContent = await fetchFileBlob.text();
    const fetchFileUrl = calls[2][0];
    const filename = fetchFileUrl.split('/').pop();
    const fetchFileMock = mocks[filename][undefined];
    expect(fetchFileContent).toEqual(fetchFileMock);

    // TODO: finish attachment test
    // const value = await mockFetch.mock.results[3].value;
    // const data = new FormData();
    // data.append('attachment', fetchFileBlob, filename);
    // const attachmentBody = calls[3][1].body;

    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
  it('handle callback to agreement request', async () => {
    const body = JSON.stringify(updates.callback);
    const request = createRequest(body);
    await telegram.handle(request, response);
    const calls = mockFetch.mock.calls;
    const results = mockFetch.mock.results;

    const answerBody = parseBody(calls[0][1].body);
    const answerMock = mocks.answerCallbackQuery[body];
    expect(answerBody).toEqual(answerMock);

    const getFieldResult = (await results[1].value).json();
    expect(getFieldResult).toEqual(mocks.field.undefined);

    const createTaskBody = parseBody(calls[2][1].body);
    const createTaskMock = mocks.task[body];
    const createTaskResult = (await results[2].value).json();
    const createTaskResultMock = mocks.task[JSON.stringify(createTaskMock)];
    expect(createTaskBody).toEqual(createTaskMock);
    expect(createTaskResult).toEqual(createTaskResultMock);

    const messageBody = parseBody(calls[3][1].body);
    expect(messageBody).toEqual(mocks.sendMessage[body]);

    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
});
