import {jest} from '@jest/globals';
import {responses} from './clickup-api.mock.js';

const mockFetch = jest.spyOn(global, 'fetch');
mockFetch.mockImplementation((url, options) =>
  new Promise((resolve, reject) => {
    url = url.replace(apiUrl, '');
    const json = responses[url][options.method];
    const response = {
      json: () => json,
    };
    resolve(response);
  }));

import {ClickupApi} from '../app/clickup-api.js';

const apiUrl = 'https://api\.clickup\.com/api/v2';
const authorization = '(b6krSZxaX_m=wx';
const listId = '12345678';
const taskId = '12345678';
const team = '1634496360';
const webhookId = '4b67ac88-e506-4a29-9d42-26e504e3435e';
const webhookUrl = 'https://your.domain.com/webhook';
const clickupApi = new ClickupApi({
  authorization: authorization,
  team: team,
});

beforeEach(() => {
  mockFetch.mockClear();
});

describe('webhooks:', () => {
  it('create webhook', async () => {
    const url = new RegExp(`${apiUrl}/team/${team}/webhook`);
    await clickupApi.createWebhook({
      endpoint: webhookUrl,
      events: ['taskCreated', 'taskCommentPosted', 'taskCommentUpdated'],
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('get webhooks', async () => {
    const url = new RegExp(`${apiUrl}/team/${team}/webhook`);
    await clickupApi.getWebhooks();
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('GET');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('delete webhook', async () => {
    const url = new RegExp(`${apiUrl}/webhook/${webhookId}`);
    await clickupApi.deleteWebhook(webhookId);
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('DELETE');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('update webhook', async () => {
    const url = new RegExp(`${apiUrl}/webhook/${webhookId}`);
    await clickupApi.updateWebhook(webhookId, {
      endpoint: webhookUrl,
      events: ['taskCreated'],
      status: 'suspended',
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('PUT');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
});

describe('methods:', () => {
  it('create task', async () => {
    const url = new RegExp(`${apiUrl}/list/${listId}/task`);
    await clickupApi.createTask(listId, {
      name: 'New Task Name',
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('create task comment', async () => {
    const url = new RegExp(`${apiUrl}/task/${taskId}/comment`);
    await clickupApi.createTaskComment(taskId, {
      name: 'New Task Name',
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('create task attachment', async () => {
    const url = new RegExp(`${apiUrl}/task/${taskId}/attachment`);
    const text = '¡hola, mundo!';
    const file = new Blob([text], {type: 'plain/text'});
    await clickupApi.createTaskAttachment(taskId, {
      blob: file,
      filename: 'document.txt',
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('POST');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type']).toBeUndefined();
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('get list fields', async () => {
    const url = new RegExp(`${apiUrl}/list/${listId}/field`);
    await clickupApi.getFields(listId);
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('GET');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('get list info', async () => {
    const url = new RegExp(`${apiUrl}/list/${listId}`);
    await clickupApi.getList(listId);
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('GET');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('get task info', async () => {
    const url = new RegExp(`${apiUrl}/task/${taskId}`);
    await clickupApi.getTask(taskId);
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('GET');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
  it('update task', async () => {
    const url = new RegExp(`${apiUrl}/task/${taskId}`);
    await clickupApi.updateTask(taskId, {
      name: 'Updated Task Name',
    });
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.lastCall[0]).toMatch(url);
    expect(mockFetch.mock.lastCall[1].method).toBe('PUT');
    expect(mockFetch.mock.lastCall[1].headers['Content-Type'])
        .toBe('application/json');
    expect(mockFetch.mock.lastCall[1].headers['Authorization'])
        .toBe(authorization);
  });
});
