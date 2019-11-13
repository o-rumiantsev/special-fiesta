'use strict';

const querystring = require('querystring');
const constants = require('./constants');

const parse = req => {
  if (!req.headers.cookie) {
    return {};
  }
  return querystring.parse(req.headers.cookie, constants.COOKIE_SEPARATOR);
};

module.exports = parse;
