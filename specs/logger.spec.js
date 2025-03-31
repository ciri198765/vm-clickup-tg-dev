import {jest} from '@jest/globals';
import util from 'node:util';

import logger from '../app/logger.js';

// test message must not contain spaces
const message = '¡hola!';
const beginning = /.*\u001b\[\d?;?\d{2}m/;
const ending = /\u001b\[\dm/;
let result = undefined;

const log = jest.spyOn(console, 'log')
    .mockImplementation((m) => {
      // remove beginning and ending to leave just test message
      // and pass it into result variable
      result = m.replace(beginning, '').replace(ending, '');
    });

globalThis.app = {
  loggerFs: {
    write: () => {},
  },
};

beforeEach(() => {
  log.mock = null;
  result = undefined;
});

describe('logger:', () => {
  it('writes log message', () => {
    logger.log(message);
    expect(log).toHaveBeenCalled();
    expect(result).toBe(message);
  });
  it('writes info message', () => {
    logger.info(message);
    expect(log).toHaveBeenCalled();
    expect(result).toBe(message);
  });
  it('writes warn message', () => {
    logger.warn(message);
    expect(log).toHaveBeenCalled();
    expect(result).toBe(message);
  });
  it('writes error message', () => {
    logger.error(message);
    expect(log).toHaveBeenCalled();
    expect(result).toBe(message);
  });
  it('takes several arguments', () => {
    // prepare array of messages, from 3 to 9 in length
    const n = Math.round(6*Math.random()) + 3;
    const messages = [];
    messages.length = n;
    messages.fill(message);
    // spread messages to logger
    logger.info(...messages);
    // get result string from mock implementation and split to array
    const arr = result.split(' ');
    // check that array of messages has length n
    // and contains only initial messages
    const several = arr.length === n &&
        arr.every((value) => value === message);
    expect(several).toBe(true);
  });
  it('displays object hierarchically', () => {
    // create object hierarchical example
    const object = {test: 'test'};
    const hierarchical = util.inspect(object);
    logger.info(object);
    expect(result).toBe(hierarchical);
  });
});
