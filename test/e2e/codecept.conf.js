/* eslint-disable no-process-env */
const processEnvironmentSetup = require('@hmcts/node-js-environment-variable-setter');

if (process.env.POINT_TO_REMOTE) {
  const configurationFile = './remote-config.json';
  processEnvironmentSetup.setUpEnvironmentVariables(configurationFile);
  process.env.CASE_MAINTENANCE_BASE_URL = 'http://div-cms-aat.service.core-compute-aat.internal';
}

const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
let waitForAction = config.tests.e2e.waitForAction;
const chromeArgs = ['--no-sandbox'];

if (config.environment !== 'development') {
  const proxyServer = config.tests.e2e.proxy;
  const proxyByPass = config.tests.e2e.proxyByPass;
  chromeArgs.push(`--proxy-server=${proxyServer}`);
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass}`);
}

if (config.environment === 'development') {
  waitForAction = 1000;
}

exports.config = {
  tests: './paths/**/*.js',
  output: config.tests.e2e.outputDir,
  helpers: {
    Puppeteer: {
      url: config.tests.e2e.url || config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: false,
      waitForNavigation: ['domcontentloaded', 'networkidle0'],
      getPageTimeout: 30000,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
    },
    IdamHelper: { require: './helpers/idamHelper.js' },
    CaseOrchestrationHelper: { require: './helpers/caseHelper.js' },
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
