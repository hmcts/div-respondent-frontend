/* eslint-disable no-process-env */
const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
const waitForAction = config.tests.e2e.waitForAction;
const chromeArgs = [ '--no-sandbox' ];

exports.config = {
  tests: './smoke/*.js',
  output: config.tests.e2e.outputDir,
  helpers: {
    Puppeteer: {
      url: config.tests.e2e.url || config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: false,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
    },
    JSWait: { require: './helpers/JSWait.js' }
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: `${config.tests.e2e.outputDir}/smoke-result.xml` }
      }
    }
  },
  name: 'Frontend Smoke Tests'
};
