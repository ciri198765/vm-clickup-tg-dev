import {jest} from '@jest/globals';
import fs from 'node:fs';

import {secrets} from '../app/secrets.js';

const encoding = {encoding: 'utf8'};
const secretDir = '/tmp/sops/temp';
const secretFile = 'file';
const secretPath = `${secretDir}/${secretFile}`;
const secretsFile = '/tmp/file';
const mockSecrets = {
  clickupToken: 'test',
  telegramToken: 'test',
};
const mockFiles = {
  [secretPath]: secretsFile,
  [secretsFile]: JSON.stringify(mockSecrets),
};

globalThis.app = {
  clickupApi: {secrets: null},
  telegramApi: {secrets: null},
};

const fsExists = jest.spyOn(fs, 'existsSync');
const fsReadFile = jest.spyOn(fs, 'readFileSync');
const fsRm = jest.spyOn(fs, 'rmSync');
const fsWatch = jest.spyOn(fs, 'watch');
fsExists.mockImplementation((path) => true);
fsReadFile.mockImplementation((path) => mockFiles[path]);
fsRm.mockImplementation((path) => null);
fsWatch.mockImplementation((folder, options, cb) => cb('change', secretFile));

beforeEach(() => {
  fsExists.mockClear();
  fsReadFile.mockClear();
  fsRm.mockClear();
  fsWatch.mockClear();
});

describe('secrets:', () => {
  it('check if a secret path file exists', async () => {
    await secrets.load();
    expect(fsExists).toHaveBeenCalledWith(secretPath);
  });
  it('wait for a secret path file', async () => {
    fsExists.mockImplementationOnce((path) => !(path === secretPath));
    await secrets.load();
    expect(fsWatch.mock.calls[0][0]).toBe(secretDir);
  });
  it('read the path to the secrets file', async () => {
    await secrets.load();
    expect(fsReadFile).toHaveBeenCalledWith(secretPath, encoding);
  });
  it('read the secrets from the secrets file', async () => {
    await secrets.load();
    expect(fsReadFile).toHaveBeenCalledWith(secretsFile, encoding);
  });
  it('pass the secrets to the clickup api', async () => {
    await secrets.load();
    expect(app.clickupApi.secrets).toEqual(mockSecrets);
  });
  it('pass the secrets to the telegram api', async () => {
    await secrets.load();
    expect(app.telegramApi.secrets).toEqual(mockSecrets);
  });
  it('delete the secret path file', async () => {
    await secrets.load();
    expect(fsRm).toHaveBeenCalledWith(secretPath);
  });
});
