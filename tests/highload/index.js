'use strict';

const { promisify } = require('util');
const autocannon = require('autocannon');

const { closeApp, startApp } = require('./tools');
const { autocannonConfig, appConfig } = require('./config');
const apps = require('./apps');

const test = async apps => {
  try {
    for await (const app of apps) {
      await startApp(app, appConfig);
      console.log(`App has been inited.`);
      const result = await promisify(autocannon(autocannonConfig));
      console.log(`App has been tested.`);
      console.table(result);
      await closeApp(app);
      console.log(`App has been closed.`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = test.bind(this, Object.values(apps));
