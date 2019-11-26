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

module.exports = { startApp, closeApp };
