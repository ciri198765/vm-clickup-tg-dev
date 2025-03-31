import {mockCreateServer, mockServer} from './server.mock.js';

globalThis.app = {};
app.clickup = {
  handle: async (request, response) => response.slug = 'clickup',
};
app.config = {port: 8000};
app.telegram = {};
const routes = {
  '/clickup': app.clickup.handle,
  '/telegram': app.telegram.handle,
};
app.router = {
  resolve: (route) => routes[route],
};

const server = await import('../app/server.js').then((m) => m.server);

describe('server:', () => {
  it('create http server', () => {
    expect(mockCreateServer).toHaveBeenCalled();
    expect(server).toEqual(mockServer);
  });
  it('create listener for `request` event', async () => {
    const listener = mockServer.callbacks['request'];
    expect(listener).toBeDefined();
  });
  it('handle request with specific handler', async () => {
    const request = {url: '/clickup'};
    const listener = mockServer.callbacks['request'];
    const response = {};
    await listener(request, response);
    expect(response.slug).toBe('clickup');
  });
  it('listen on specified port', () => {
    expect(mockServer.port).toBe(app.config.port);
  });
});
