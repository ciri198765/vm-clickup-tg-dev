import {jest} from '@jest/globals';
import util from 'node:util';
import fs from 'node:fs';
import {mockCreateServer, mockServer} from './server.mock.js';

import {index} from '../app/index.js';

let error;
let hasListener;
let result;
let fsResult;
const message = 'test error';
const handler = jest.spyOn(index, 'catchError');
const emitEvent = (e) => {
  return process.emit(e, new Error(message));
};
const logger = jest.spyOn(console, 'dir')
    .mockImplementation((m) => {
      // use util.inspect() to get error object data
      // in much the same way console.dir() uses it
      result = util.inspect(m);
    });
const fsExists = jest.spyOn(fs, 'existsSync')
    .mockReturnValue(false);
const fsMkDir = jest.spyOn(fs, 'mkdirSync')
    .mockImplementation(() => null);
const fsWrite = jest.spyOn(fs, 'writeFileSync')
    .mockImplementation((filePath, data) => {
      fsResult = typeof data === 'object' ? data.toString() : data;
    });

afterAll(() => {
  process.emit('beforeExit', 0);
  index.close();
  mockCreateServer.mockClear();
  mockServer.close();
});

describe('uncaughtException:', () => {
  const eventName = 'uncaughtException';
  beforeEach(() => {
    error = null;
    result = null;
    handler.mockImplementationOnce((err) => error = err);
    hasListener = emitEvent(eventName);
  });
  it('has listener', () => {
    expect(hasListener).toBe(true);
  });
  it('calls handler', () => {
    expect(handler).toHaveBeenCalled();
  });
  it('catches error', () => {
    expect(error.message).toBe(message);
  });
  it('calls console.dir', () => {
    emitEvent(eventName);
    expect(logger).toHaveBeenCalled();
  });
  it('passes message to console', () => {
    emitEvent(eventName);
    expect(result).toContain(message);
  });
  it('checks the logs folder exists', () => {
    expect(fsExists).toHaveBeenCalled();
  });
  it('creates the logs folder if not exists', () => {
    expect(fsMkDir).toHaveBeenCalled();
  });
  it('calls writeFile to write the log file', () => {
    expect(fsWrite).toHaveBeenCalled();
  });
  it('passes error message into the log file', () => {
    expect(fsResult).toContain(message);
  });
});

describe('unhandledRejection:', () => {
  const eventName = 'unhandledRejection';
  beforeEach(() => {
    error = null;
    result = null;
    handler.mockImplementationOnce((err) => error = err);
    hasListener = emitEvent(eventName);
  });
  it('has listener', () => {
    expect(hasListener).toBe(true);
  });
  it('calls handler', () => {
    expect(handler).toHaveBeenCalled();
  });
  it('catches error', () => {
    expect(error.message).toBe(message);
  });
  it('calls console.dir', () => {
    emitEvent(eventName);
    expect(logger).toHaveBeenCalled();
  });
  it('passes message to console', () => {
    emitEvent(eventName);
    expect(result).toContain(message);
  });
  it('checks the logs folder exists', () => {
    expect(fsExists).toHaveBeenCalled();
  });
  it('creates the logs folder if not exists', () => {
    expect(fsMkDir).toHaveBeenCalled();
  });
  it('calls writeFile to write the log file', () => {
    expect(fsWrite).toHaveBeenCalled();
  });
  it('passes error message into the log file', () => {
    expect(fsResult).toContain(message);
  });
});
