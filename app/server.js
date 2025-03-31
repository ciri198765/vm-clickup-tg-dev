import http from 'node:http';

export {server as default, server};

const port = app.config.port;
const server = http.createServer();
server.on('request', async (request, response) => {
  // app.logger.log({request});
  // response.statusCode = 200;
  // response.setHeader('Content-Type', 'application/json');
  const fn = app.router.resolve(request.url);
  if (!fn) return;
  await fn(request, response).catch((reason) => app.logger.error(reason));
});
server.listen(port);
