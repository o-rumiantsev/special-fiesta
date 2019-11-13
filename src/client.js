'use strict';

const url = require('url');
const querystring = require('querystring');
const constants = require('./constants');

const parseBody = require('./body-parser');
const parseCookie = require('./cookie-parser');

class ClientError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class Client {
  data = null;
  query = null;
  body = null;
  cookies = null;
  headers = null;
  preparedCookie = [];

  constructor(req, res, options) {
    this.req = req;
    this.res = res;
    this.options = options;
  }

  get url() {
    return this.req.url;
  }

  get method() {
    return this.req.method;
  }

  set statusCode(code) {
    return (this.res.statusCode = code);
  }

  get statusCode() {
    return this.res.statusCode;
  }

  set statusMessage(message) {
    return (this.res.statusMessage = message);
  }

  get statusMessage() {
    return this.res.statusMessage;
  }

  setHeader(name, value) {
    this.res.setHeader(name, value);
    return this;
  }

  setCookie(name, value, options = {}) {
    this.preparedCookie.push(`${name}=${value}`);

    if (options.delete) {
      this.preparedCookie.push(constants.COOKIE_DELETE);
      return this;
    }

    if (options.expires) {
      this.preparedCookie.push(`Expires=${options.expires}`);
    }

    if (options.secure) {
      this.preparedCookie.push(constants.COOKIE_SECURE);
    }

    if (options.httpOnly) {
      this.preparedCookie.push(constants.COOKIE_HTTP_ONLY);
    }

    return this;
  }

  sendCookies() {
    const cookies = this.preparedCookie.join(constants.COOKIE_SEPARATOR);
    this.setHeader('Set-Cookie', cookies);
    return this;
  }

  getHeader(name, value) {
    return this.res.getHeader(name, value);
  }

  hasHeader(name) {
    return this.res.hasHeader(name);
  }

  removeHeader(name) {
    this.res.removeHeader(name);
    return this;
  }

  writeHead(statusCode, statusMessage, headers) {
    this.res.writeHead(statusCode, statusMessage, headers);
    return this;
  }

  error(message, statusCode = 400) {
    this.statusCode = statusCode;
    this.statusMessage = message;
    throw new ClientError(message, statusCode);
  }

  async processing() {
    const { query } = url.parse(this.url);

    this.query = querystring.parse(query);
    this.headers = this.req.headers;

    if (this.options.parseCookie) {
      this.cookies = parseCookie(this.req);
    }

    if (this.options.parseBody) {
      const { data, body } = await parseBody(this.req);
      this.data = data;
      this.body = body;
    }

    return this;
  }
}

module.exports = {
  Client,
  ClientError,
};
