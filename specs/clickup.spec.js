import {jest} from '@jest/globals';
import {mocks, updates, values} from './clickup.mock.js';

import {clickupApi} from '../app/clickup-api.js';
import {telegramApi} from '../app/telegram-api.js';

const listId = '12345678';
const {chatId, taskId, username} = values;
const response = {
  end: () => undefined,
  writeHead: function() {
    return this;
  },
};

globalThis.app = {
  base: {tasks: {[taskId]: {chat: chatId, task: taskId, account: username}}},
  config: {clickup: {listId: listId}},
  clickupApi: clickupApi,
  telegramApi: telegramApi,
};

import {clickup} from '../app/clickup.js';

const mockFetch = jest.spyOn(global, 'fetch');
mockFetch.mockImplementation((url, options) =>
  new Promise(async (resolve, reject) => {
    const slug = url.split('/').pop();
    const data = mocks[slug] ? mocks[slug][options?.body] : {};
    const response = {
      blob: () => new Blob([data]),
      json: () => data,
      ok: data ? true : false,
      status: data ? 200 : 500,
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

describe('taskCommentPosted:', () => {
  it('do nothing if text not started with prefix', async () => {
    const body = JSON.stringify(updates.notTg);
    const request = createRequest(body);
    await clickup.handle(request, response);
    expect(mockFetch).not.toHaveBeenCalled();
  });
  it('do nothing if text has nothing except prefix', async () => {
    const body = JSON.stringify(updates.commentEmpty);
    const request = createRequest(body);
    await clickup.handle(request, response);
    expect(mockFetch).not.toHaveBeenCalled();
  });
  it('send text as message to telegram', async () => {
    const body = JSON.stringify(updates.comment);
    const request = createRequest(body);
    await clickup.handle(request, response);
    const resultBody = parseBody(mockFetch.mock.lastCall[1].body);
    expect(mockFetch).toHaveBeenCalled();
    expect(resultBody).toEqual(mocks.sendMessage[body]);
  });
  it('send message (w/o filename) and upload attachment', async () => {
    const body = JSON.stringify(updates.attachmentComment);
    const request = createRequest(body);
    await clickup.handle(request, response);
    const calls = mockFetch.mock.calls;
    const results = mockFetch.mock.results;

    const messageBody = parseBody(calls[0][1].body);
    const messageMock = mocks
        .sendMessage[JSON.stringify(updates.attachmentComment)];
    expect(messageBody).toEqual(messageMock);

    const fetchFileResponse = await results[1].value;
    const fetchFileBlob = await fetchFileResponse.blob();
    const fetchFileContent = await fetchFileBlob.text();
    const fetchFileUrl = calls[1][0];
    const filename = fetchFileUrl.split('/').pop();
    const fetchFileMock = mocks[filename][undefined];
    expect(fetchFileContent).toEqual(fetchFileMock);

    const sendDocumentBody = calls[2][1].body;
    const sendDocumentMock = mocks
        .sendDocument[JSON.stringify(updates.attachmentComment)];
    expect(sendDocumentBody).toEqual(sendDocumentMock);

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
  it('only upload attachment if text is empty', async () => {
    const body = JSON.stringify(updates.attachmentOnly);
    const request = createRequest(body);
    await clickup.handle(request, response);
    const calls = mockFetch.mock.calls;
    const results = mockFetch.mock.results;

    const fetchFileResponse = await results[0].value;
    const fetchFileBlob = await fetchFileResponse.blob();
    const fetchFileContent = await fetchFileBlob.text();
    const fetchFileUrl = calls[0][0];
    const filename = fetchFileUrl.split('/').pop();
    const fetchFileMock = mocks[filename][undefined];
    expect(fetchFileContent).toEqual(fetchFileMock);

    const sendDocumentBody = calls[1][1].body;
    const sendDocumentMock = mocks
        .sendDocument[JSON.stringify(updates.attachmentOnly)];
    expect(sendDocumentBody).toEqual(sendDocumentMock);

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
  it('upload multiple files if payload has multiple attachments', async () => {
    const body = JSON.stringify(updates.attachments);
    const request = createRequest(body);
    await clickup.handle(request, response);
    const calls = mockFetch.mock.calls;
    const results = mockFetch.mock.results;

    const fetchFile1Response = await results[0].value;
    const fetchFile1Blob = await fetchFile1Response.blob();
    const fetchFile1Content = await fetchFile1Blob.text();
    const fetchFile1Url = calls[0][0];
    const filename1 = fetchFile1Url.split('/').pop();
    const fetchFile1Mock = mocks[filename1][undefined];
    expect(fetchFile1Content).toEqual(fetchFile1Mock);

    const sendDocument1Body = calls[2][1].body;
    const sendDocument1Mock = mocks
        .sendDocument[filename1];
    expect(sendDocument1Body).toEqual(sendDocument1Mock);

    const fetchFile2Response = await results[1].value;
    const fetchFile2Blob = await fetchFile2Response.blob();
    const fetchFile2Content = await fetchFile2Blob.text();
    const fetchFile2Url = calls[1][0];
    const filename2 = fetchFile2Url.split('/').pop();
    const fetchFile2Mock = mocks[filename2][undefined];
    expect(fetchFile2Content).toEqual(fetchFile2Mock);

    const sendDocument2Body = calls[3][1].body;
    const sendDocument2Mock = mocks
        .sendDocument[filename2];
    expect(sendDocument2Body).toEqual(sendDocument2Mock);

    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
});

describe('taskDeleted:', () => {
  it('delete record from the base', async () => {
    const body = JSON.stringify(updates.taskDeleted);
    const request = createRequest(body);

    expect(app.base.tasks[taskId]).toBeDefined();
    await clickup.handle(request, response);
    expect(app.base.tasks[taskId]).toBeUndefined();
  });
});
