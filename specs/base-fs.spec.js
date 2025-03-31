import {jest} from '@jest/globals';
import fs from 'node:fs';
import stream from 'node:stream';

import {baseFs} from '../app/base-fs.js';

const sep = '\t';
const chat = 'chat';
const task = 'task';
const account = 'user';

let database = '';
const recordsExpected = [];

const size = 10;
const prepareTestThings = () =>
  new Promise(async (resolve, reject) => {
    const fields = ['task', 'chat', 'account'];
    const record = [task, chat, account];
    database += `${fields.join(sep)}\n`;
    const arr = [...Array(size).keys()];
    await Promise.all(arr.map(async (i) => {
      database += `${record.map((value) => value + i).join(sep)}\n`;
      recordsExpected.push({
        task: task + i,
        chat: chat + i,
        account: account + i,
      });
    }));
    database += '\n';
    resolve(true);
  });

const fsCreateRS = jest.spyOn(fs, 'createReadStream');
fsCreateRS.mockImplementation(() => {
  const rs = stream.Readable.from([...database]);
  rs.close = () => undefined;
  return rs;
});
const fsCreateWS = jest.spyOn(fs, 'createWriteStream');
fsCreateWS.mockImplementation(() => {
  const ws = {
    close: () => undefined,
    end: (data, cb) => {
      database += data;
      cb();
    },
    write: (data) => database += data,
  };
  return ws;
});

beforeEach(async () => {
  recordsExpected.length = 0;
  database = '';
  await prepareTestThings();
  baseFs.init();
});

describe('baseFs:', () => {
  it('load records from the database', async () => {
    const records = await baseFs.load();
    expect(records).toEqual(recordsExpected);
  });
  it('save records to the database', async () => {
    const dataExpected = database;
    database = '';
    await baseFs.save(recordsExpected);
    expect(database).toBe(dataExpected);
  });
});
