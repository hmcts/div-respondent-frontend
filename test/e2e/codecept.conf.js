/* eslint-disable no-process-env */
const processEnvironmentSetup = require('@hmcts/node-js-environment-variable-setter');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const request = require('request-promise-native');

if (process.env.POINT_TO_REMOTE) {
  const configurationFile = './remote-config.json';
  processEnvironmentSetup.setUpEnvironmentVariables(configurationFile);
}

const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
let waitForAction = config.tests.e2e.waitForAction;
const chromeArgs = ['--no-sandbox'];
const selfUrl = config.tests.e2e.url || config.node.baseUrl;

request.get(selfUrl).then(result => {
  logger.log(`Result of getting test URL ${selfUrl}`);
  logger.log(result);
}).catch(error => {
  logger.log(`Error getting test URL ${selfUrl}`);
  logger.log(error);
});

logger.log(`Using base URL: ${selfUrl}`);

if (config.environment !== 'development') {
  const proxyServer = config.tests.e2e.proxy;
  const proxyByPass = config.tests.e2e.proxyByPass;
  chromeArgs.push(`--proxy-server=${proxyServer}`);
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass}`);
  chromeArgs.push('--allow-failed-policy-fetch-for-test');
}

if (config.environment === 'development') {
  waitForAction = 1000;
}

exports.config = {
  tests: './paths/**/*.js',
  output: config.tests.e2e.outputDir,
  helpers: {
    Puppeteer: {
      url: selfUrl,
      waitForTimeout,
      waitForAction,
      show: false,
      // 3 mins (default 30secs)
      timeout: 300000,
      dumpio: true,
      pipe: true,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
    },
    IdamHelper: { require: './helpers/idamHelper.js' },
    CaseHelper: { require: './helpers/caseHelper.js' },
    JSWait: { require: './helpers/JSWait.js' }
  },
  include: { I: './pages/steps.js' },
  mocha: {
    reporterOptions: {
      reportDir: process.env.E2E_OUTPUT_DIR || './functional-output',
      reportName: 'RespondentFrontendTests',
      inlineAssets: true
    }
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    }
  },
  name: 'Respondent Frontend Tests'
};
