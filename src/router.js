'use strict';

const path = require('path');

class Router {
  mapping = {};

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  static compose(routers) {
    const mapping = {};

    for (const router of routers) {
      for (const [key, handler] of Object.entries(router.mapping)) {
        mapping[key] = handler;
      }
    }

    const composed = new Router();
    composed.mapping = mapping;

    return composed;
  }

  absolutePath(relPath) {
    if (relPath === '/') relPath = '';
    return path.join(this.prefix, relPath);
  }

  setHandler(relPath, method, handler) {
    const key = `${method} ${this.absolutePath(relPath)}`;
    this.mapping[key] = handler;
  }

  getHandler(path, method) {
    const key = `${method} ${path}`;
    return this.mapping[key];
  }

  get(path, handler) {
    this.setHandler(path, 'GET', handler);
  }

  post(path, handler) {
    this.setHandler(path, 'POST', handler);
  }

  put(path, handler) {
    this.setHandler(path, 'PUT', handler);
  }

  delete(path, handler) {
    this.setHandler(path, 'DELETE', handler);
  }
}

module.exports = Router;
