import {jest} from '@jest/globals';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {mockCreateServer, mockServer} from './server.mock.js';


import loader from '../app/loader.js';

const require = createRequire(import.meta.url);

afterAll(() => {
  loader.close();
  jest.clearAllTimers();
  mockCreateServer.mockClear();
  mockServer.close();
});

describe('resolve:', () => {
  it('resolves module name to module path', () => {
    const moduleName = 'node:util';
    const modulePath = loader.resolve(moduleName);
    expect(modulePath).toBe(require.resolve(moduleName));
  });
});

describe('namespaces:', () => {
  it('creates app namespace', () => {
    expect(typeof globalThis.app).toBe('object');
  });
  it('fills app with modules', () => {
    expect(Object.keys(globalThis.app).length).toBeGreaterThan(0);
  });
});

describe('watch:', () => {
  it('watches changes in imported modules', () => {
    const fsWatcher = jest.spyOn(fs, 'watch');
    fsWatcher.mockImplementation(() => {});
    loader.watch();
    expect(fsWatcher).toHaveBeenCalled();
  });
});
