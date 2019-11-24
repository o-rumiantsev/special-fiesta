'use strict';

const express = require('express');
const app = express();

const middlewares = [
  // 1) add err handlling
  (req, res, next) => {
    req['ErrorHandler'] = () => {
      /* Error Handling emulation*/
    };
    next();
  },
  // 2) parse body to body.json
  (req, res, next) => {
    try {
      req.body = JSON.parse(req.body);
      next();
    } catch (err) {
      // handle err
      // req.ErrorHandler(err);
    }
  },
  // 3) db request emulation
  (req, res, next) => setTimeout(next, 75),
  // 4) set headers
  (req, res, next) => {
    res.setHeader(/* set headers */);
    next();
  },
  // 5) count factorial
  (req, res, next) => {
    const factorial = n => (n === 1 ? 1 : n * factorial(n - 1));
    req.body = factorial(req.body.n);
    next();
  },
  // 6) response
  (req, res, next) => {
    res.send(req.body);
  },
];

app.use('/test', middlewares);

module.exports = app;
