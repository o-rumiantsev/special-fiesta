'use strict';

const { startApp, closeApp } = require('./promisify');
const { startTest } = require('./test');

module.exports = { startApp, closeApp, startTest };
