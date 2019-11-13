'use strict';

const url = require('url');
const http = require('http');

const Router = require('./router');
const Client = require('./client');

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

    const client = await new Client(req, res, this.options).prepare();
    const result = handler(client);

    if (result instanceof Promise) {
      respond(res, await result);
    } else {
      respond(res, result);
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
