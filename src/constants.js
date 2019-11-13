'use strict';

const cookie = {
  COOKIE_SEPARATOR: '; ',
  COOKIE_DELETE: `Expires=${new Date(0)}`,
  COOKIE_SECURE: 'Secure',
  COOKIE_HTTP_ONLY: 'HttpOnly',
};

const messages = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

module.exports = {
  ...cookie,
  ...messages,
};
