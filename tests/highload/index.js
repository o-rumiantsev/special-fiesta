'use strict';

const autocannon = require('autocannon');
const { track } = autocannon;

const { closeApp, startApp, startTest } = require('./tools');
const { autocannonConfig, appConfig } = require('./config');
const apps = require('./apps');
const test = async app => {
  try {
    for await (const app of apps) {
      const server = await startApp(app, appConfig);
      console.log(`App has been inited.`);
      await startTest(autocannon, autocannonConfig, track);
      console.log(`App has been tested.`);
      await closeApp(server);
      console.log(`App has been closed.`, app);
    }
  } catch (error) {
    console.error(error);
    // process.exit(1);
  }
};

module.exports = test.bind(this, Object.values(apps));
