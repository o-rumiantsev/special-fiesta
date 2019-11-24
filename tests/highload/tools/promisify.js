'use strict';

const startApp = (server, config) => {
  return new Promise((res, rej) => {
    try {
      const app = server.listen(config, () => res(app));
    } catch (err) {
      rej(err);
    }
  });
};

const closeApp = server => {
  return new Promise((res, rej) => {
    try {
      server.close(res);
    } catch (err) {
      rej(err);
    }
  });
};

const startTest = (test, testconfig) => {
  return new Promise((rej, res) => {
    test(testconfig, (err, result) => {
      if (err) return rej(err);
      res(result);
    });
  });
};

module.exports = { startApp, closeApp, startTest };
