'use strict';

const url = require('url');
const http = require('http');
const constants = require('./constants');

const Router = require('./router');
const { Client, ClientError } = require('./client');

const serializers = {
  bigint: n => n.toString(),
  number: n => n.toString(),
  string: s => s,
  boolean: b => b.toString(),
  object: o => JSON.stringify(o),
  undefined: () => '',
};

const respond = (res, data) => {
  const type = typeof data;
  const serializer = serializers[type];
  res.end(serializer(data));
};

class Application {
  router = new Router();

  constructor(options = {}) {
    this.options = options;
  }

  async onRequest(req, res) {
    const { method } = req;
    const { pathname } = url.parse(req.url);

    const handler = this.router.getHandler(pathname, method);

    if (!handler) {
      res.end(`Cannot ${method}`);
      return;
    }

    const client = new Client(req, res, this.options);
    await client.processing();

    try {
      const result = handler(client);
      respond(res, await result);
    } catch (handleError) {
      if (handleError instanceof ClientError) {
        respond(res, handleError.message);
      } else {
        res.statusCode = 500;
        respond(res, constants.INTERNAL_SERVER_ERROR);
      }
    }
  }

  use(router) {
    this.router = router;
    return this;
  }

  listen(...args) {
    const server = http.createServer(this.onRequest.bind(this));
    return server.listen(...args);
  }
}

module.exports = Application;
