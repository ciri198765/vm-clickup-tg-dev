import {jest} from '@jest/globals';
import fs from 'node:fs';

import {LoggerFS} from '../app/logger-fs.js';

const folder = '/tmp/jest/logger-fs';
const errorLog = `${folder}/error.log`;
const outputLog = `${folder}/output.log`;
const append = {flags: 'a'};
const message = '¡hola, mundo!';
const streams = {};
const rotated = {};

globalThis.app = {
  logger: {
    error: () => {},
  },
};

const loggerFs = new LoggerFS({folder: folder});

const fsCreateReadStream = jest.spyOn(fs, 'createReadStream');
const fsCreateWriteStream = jest.spyOn(fs, 'createWriteStream');
const fsExists = jest.spyOn(fs, 'existsSync');
const fsMkDir = jest.spyOn(fs, 'mkdirSync');
const fsRename = jest.spyOn(fs, 'renameSync');
fsCreateReadStream.mockImplementation((path, options) => {
  const rs = stream.Readable.from([...streams[path]]);
  rs.close = () => undefined;
  return rs;
});
fsCreateWriteStream.mockImplementation((path, options) => {
  streams[path] = '';
  const ws = {
    close: () => {},
    cork: () => {},
    end: (data, cb) => {
      streams[path] += data;
      cb();
    },
    once: (event, cb) => {
      if (event === 'ready') cb();
    },
    path: path,
    uncork: () => {},
    write: (data) => streams[path] += data,
    writable: true,
  };
  return ws;
});
fsExists.mockImplementation((path) => Object.keys(streams).includes(path));
fsMkDir.mockImplementation(() => undefined);
fsRename.mockImplementation((oldPath, newPath) => {
  streams[newPath] = structuredClone(streams[oldPath]);
  rotated[oldPath] = newPath;
});

const readFromLogFile = (filename) => streams[filename].trimEnd();

beforeEach(async () => {
  fsCreateReadStream.mockClear();
  fsCreateWriteStream.mockClear();
  fsExists.mockClear();
  fsMkDir.mockClear();
  fsRename.mockClear();
  await loggerFs.init();
});

afterAll(() => {
  loggerFs.close();
});

describe('init:', () => {
  it('creates the logs folder if not exists', async () => {
    expect(fsMkDir).toHaveBeenCalled();
  });
  it('creates fs.WriteStream for error.log', async () => {
    expect(fsCreateWriteStream).toHaveBeenCalledWith(errorLog, append);
    expect(fs.existsSync(errorLog)).toBe(true);
  });
  it('creates fs.WriteStream for output.log', async () => {
    expect(fsCreateWriteStream).toHaveBeenCalledWith(outputLog, append);
    expect(fs.existsSync(outputLog)).toBe(true);
  });
});

describe('write:', () => {
  it('writes into the error.log (error)', () => {
    loggerFs.write('error', message);
    const result = readFromLogFile(errorLog);
    expect(result).toBe(message);
  });
  it('writes into the error.log (warn)', () => {
    loggerFs.write('warn', message);
    const result = readFromLogFile(errorLog);
    expect(result).toBe(message);
  });
  it('writes into the output.log (info)', () => {
    loggerFs.write('info', message);
    const result = readFromLogFile(outputLog);
    expect(result).toBe(message);
  });
  it('writes into the output.log (log)', () => {
    loggerFs.write('log', message);
    const result = readFromLogFile(outputLog);
    expect(result).toBe(message);
  });
});

describe('rotate:', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    await loggerFs.init();
  });

  it('rename error.log when date changed', () => {
    loggerFs.write('error', message);
    jest.runOnlyPendingTimers();
    const newLog = rotated[errorLog];
    const resultRotated = readFromLogFile(newLog);
    expect(resultRotated).toBe(message);
    loggerFs.write('error', message);
    const resultNewLog = readFromLogFile(errorLog);
    expect(resultNewLog).toBe(message);
  });
  it('rename output.log when date changed', () => {
    loggerFs.write('output', message);
    jest.runOnlyPendingTimers();
    const newLog = rotated[outputLog];
    const resultRotated = readFromLogFile(newLog);
    expect(resultRotated).toBe(message);
    loggerFs.write('output', message);
    const resultNewLog = readFromLogFile(outputLog);
    expect(resultNewLog).toBe(message);
  });
});
