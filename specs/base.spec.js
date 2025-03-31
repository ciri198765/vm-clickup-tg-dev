import {base} from '../app/base.js';

const chat = 'chat';
const task = 'task';
const account = 'user';
const chat1 = `${chat}1`;
const task1 = `${task}1`;
const chat2 = `${chat}2`;
const task2 = `${task}2`;
const record1 = {};
const record2 = {};

const driver = {
  data: [],
  load: async function() {
    return this.data;
  },
  save: async function(data) {
    this.data = data;
    return true;
  },
};
beforeEach(() => {
  Object.assign(record1, {task: task1, chat: chat1, account: account});
  Object.assign(record2, {task: task2, chat: chat2, account: account});
  base.clear();
  driver.data = [];
});

describe('base:', () => {
  it('create a zero-sized base', () => {
    expect(base.size).toBe(0);
  });
  it('(c) add record to the base', () => {
    expect(base.chats[chat1]).toBeUndefined();
    base.chats[chat1] = record1;
    expect(base.chats[chat1]).toEqual(record1);

    expect(base.tasks[task2]).toBeUndefined();
    base.tasks[task2] = record2;
    expect(base.tasks[task2]).toEqual(record2);
  });
  it('(r) read record from the base by key', () => {
    base.chats[chat1] = record1;
    expect(base.chats[chat1]).toEqual(record1);
    expect(base.chats[chat1].task).toEqual(task1);

    base.tasks[task2] = record2;
    expect(base.tasks[task2]).toEqual(record2);
    expect(base.tasks[task2].chat).toEqual(chat2);
  });
  it('(u) update record in the base by key', () => {
    base.chats[chat1] = record1;
    expect(base.chats[chat1]).toEqual(record1);
    expect(base.chats[chat1].task).toEqual(task1);
    base.chats[chat1].task = task2;
    expect(base.chats[chat1].task).toEqual(task2);

    base.tasks[task2] = record2;
    expect(base.tasks[task2]).toEqual(record2);
    expect(base.tasks[task2].chat).toEqual(chat2);
    base.tasks[task2].chat = chat1;
    expect(base.tasks[task2].chat).toEqual(chat1);
  });
  it('(d) remove record from the base by key', () => {
    base.chats[chat1] = record1;
    expect(base.chats[chat1]).toEqual(record1);
    delete base.chats[chat1];
    expect(base.chats[chat1]).toBeUndefined();

    base.tasks[task2] = record2;
    expect(base.tasks[task2]).toEqual(record2);
    delete base.tasks[task2];
    expect(base.tasks[task2]).toBeUndefined();
  });
  it('store unique data keys', () => {
    expect(base.size).toBe(0);
    base.chats[chat1] = record1;
    base.chats[chat2] = record2;
    expect(base.size).toBe(2);
    base.chats[chat1] = record1;
    expect(base.size).toBe(2);
    let amount = 0;
    Object.values(base.chats).forEach((value, key) =>
      amount += value === record1 ? 1 : 0);
    expect(amount).toBe(1);
  });
  it('load records from the driver', async () => {
    const data = [
      record1,
      record2,
    ];
    driver.data = data;
    base.init({driver: driver});
    expect(base.chats[chat1]).toBeUndefined();
    expect(base.chats[chat2]).toBeUndefined();

    await base.load();
    expect(base.chats[chat1]).toEqual(record1);
    expect(base.chats[chat2]).toEqual(record2);
  });
  it('save records to the driver', async () => {
    expect(driver.data.length).toBe(0);
    base.chats[chat1] = record1;
    base.tasks[task2] = record2;
    await base.save();
    const data = [record1, record2];
    expect(driver.data).toBeDefined();
    expect(driver.data).toEqual(data);
  });
});
