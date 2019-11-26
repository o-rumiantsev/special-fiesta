'use strict';

const Koa = require('koa');
const app = new Koa();

const middlewares = [
  // 1) add err handlling
  (ctx, next) => {
    ctx.req['ErrorHandler'] = () => {
      /* Error Handling emulation*/
    };
    next();
  },
  // 2) parse body to body.json
  (ctx, next) => {
    try {
      next();
    } catch (err) {
      // handle err
      // req.ErrorHandler(err);
    }
  },
  // 3) db request emulation
  (ctx, next) => setTimeout(next, 75),
  // 4) set headers
  (ctx, next) => {
    ctx.res.setHeader('Content-Type', 'application/json');
    next();
  },
  // 5) count factorial
  (ctx, next) => {
    const factorial = n => (n === 1 ? 1 : n * factorial(n - 1));
    ctx.bodyreq.body = { n: factorial(req.body.n) };
    next();
  },
  // 6) response
  (ctx, next) => {
    ctx.res.write(ctx.req.body);
    ctx.res.end();
  },
];

module.exports = app;
