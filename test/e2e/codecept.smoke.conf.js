/* eslint-disable no-process-env */
const processEnvironmentSetup = require('@hmcts/node-js-environment-variable-setter');

if (process.env.POINT_TO_REMOTE) {
  const configurationFile = './remote-config.json';
  processEnvironmentSetup.setUpEnvironmentVariables(configurationFile);
}
const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
const waitForAction = config.tests.e2e.waitForAction;
const proxyServer = config.tests.e2e.proxy;
const proxyByPass = config.tests.e2e.proxyByPass;

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
        args: [
          '--no-sandbox',
          `--proxy-server=${proxyServer}`,
          `--proxy-bypass-list=${proxyByPass}`
        ]
      }
    },
    JSWait: { require: './helpers/JSWait.js' }
  },
  include: { I: './pages/steps.js' },
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
