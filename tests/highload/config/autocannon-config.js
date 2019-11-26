'use strict';

const { port } = require('./app-config');

module.exports = {
  title: 'highload test',
  url: 'http://localhost:' + port,
  connections: 5000,
  amount: 5000,
  timeout: 5, // seconds
  requests: [
    {
      method: 'POST',
      path: '/test',
      body: JSON.stringify({ n: 10 }),
      headers: { 'Content-Type': 'application/json' },
    },
  ],
};
