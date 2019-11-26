'use strict';

const startTest = (test, testconfig) => {
  return new Promise((rej, res) => {
    const instance = test(testconfig, (err, result) => {
      if (err) return rej(err);
      res(result);
    });
    test.track(instance);
  });
};

module.exports = { startTest };
