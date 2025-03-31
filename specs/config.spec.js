import {jest} from '@jest/globals';
import fs from 'node:fs';

import {config} from '../app/config.js';

globalThis.app = {};

const configDir = '/tmp/jest/config';
const configFile = `${configDir}/config.json`;

const port = '8088';
const portDefault = 8000;
const portNew = '8080';
const configMock = {
  port: port,
};
const configNew = {port: portNew};

const fsExists = jest.spyOn(fs, 'existsSync');
const fsRead = jest.spyOn(fs, 'readFileSync');
const fsWatch = jest.spyOn(fs, 'watch');
fsExists.mockImplementation(() => true);
fsRead.mockImplementation(() => JSON.stringify(configMock));
const watcher = {
  callback: () => {},
  file: undefined,
  fileChanged: () => watcher.callback('change', watcher.file),
};
fsWatch.mockImplementation((path, options, cb) => {
  watcher.file = path.split('/').pop();
  watcher.callback = cb;
});

const mockCallWith = (mock, value) => {
  return mock.calls.filter((arr) => arr.some((v) => v === value))[0];
};

beforeEach(() => {
  fsExists.mockClear();
  fsRead.mockClear();
  fsWatch.mockClear();
  config.init({
    configFile: configFile,
  });
});

afterAll(() => {
  config.close();
});

describe('config.json:', () => {
  it('check if config.json file exists', () => {
    expect(fsExists).toHaveBeenCalledWith(configFile);
  });
  it('read parameters from config.json if exists', () => {
    expect(app.config.port).toBe(port);
  });
  it('watch changes in config.json file', () => {
    const watchCall = mockCallWith(fsWatch.mock, configFile);
    expect(watchCall).toContain(configFile);
  });
  it('read config.json again after it changed', async () => {
    expect(app.config.port).toBe(port);
    fsRead.mockImplementationOnce(() => JSON.stringify(configNew));
    watcher.fileChanged();
    expect(app.config.port).toBe(portNew);
  });
  it('use default parameters if config.json not exists', () => {
    fsExists.mockImplementationOnce(() => false);
    config.init({
      configFile: configFile,
    });
    expect(app.config.port).toEqual(portDefault);
  });
});
