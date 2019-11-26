'use strict';

const express = require('express');
const app = express();
app.use(express.json());

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
      next();
    } catch (err) {
      // handle err
      // req.ErrorHandler(err);
      console.error(err);
    }
  },
  // 3) db request emulation
  (req, res, next) => setTimeout(next, 75),
  // 4) set headers
  (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  },
  // 5) count factorial
  (req, res, next) => {
    const factorial = n => (n === 1 ? 1 : n * factorial(n - 1));
    req.body = { n: factorial(req.body.n) };
    next();
  },
  // 6) response
  (req, res, next) => {
    res.send(req.body);
  },
];

app.use('/test', middlewares);
process.on('uncaughtException', console.error);

module.exports = app;
