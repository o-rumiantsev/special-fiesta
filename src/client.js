'use strict';

const url = require('url');
const querystring = require('querystring');

const COOKIE_SEPARATOR = '; ';
const COOKIE_DELETE = new Date(0);
const COOKIE_SECURE = 'Secure';
const COOKIE_HTTP_ONLY = 'HttpOnly';

class Client {
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
      this.preparedCookie.push(`Expires=${COOKIE_DELETE}`);
      return this;
    }

    if (options.expires) {
      this.preparedCookie.push(`Expires=${options.expires}`);
    }

    if (options.secure) {
      this.preparedCookie.push(COOKIE_SECURE);
    }

    if (options.httpOnly) {
      this.preparedCookie.push(COOKIE_HTTP_ONLY);
    }

    return this;
  }

  sendCookies() {
    const cookies = this.preparedCookie.join(COOKIE_SEPARATOR);
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

  parseBody() {
    const data = [];
    return new Promise(resolve =>
      this.req
        .on('data', chunk => data.push(chunk))
        .on('end', () => resolve(data.join('')))
    );
  }

  parseHeaders() {
    return this.req.headers;
  }

  parseCookies() {
    if (!this.headers.cookie) {
      return {};
    }
    return querystring.parse(this.headers.cookie, COOKIE_SEPARATOR);
  }

  async prepare() {
    const { query } = url.parse(this.url);

    this.query = querystring.parse(query);
    this.headers = this.parseHeaders();

    if (this.options.parseBody) {
      this.body = await this.parseBody();
    }

    if (this.options.parseCookies) {
      this.cookies = this.parseCookies();
    }

    return this;
  }
}

module.exports = Client;
