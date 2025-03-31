import {jest} from '@jest/globals';
import http from 'node:http';

export {mockCreateServer, mockServer};

const mockServer = {
  callbacks: {},
  close: () => null,
  listen: (port) => mockServer.port = port,
  on: (event, cb) => mockServer.callbacks[event] = cb,
  port: undefined,
};
const mockCreateServer = jest.spyOn(http, 'createServer');
mockCreateServer.mockImplementation(() => mockServer);
