/* eslint-disable no-process-env */
const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
let waitForAction = config.tests.e2e.waitForAction;
const proxyServer = config.tests.e2e.proxy;
const proxyByPass = config.tests.e2e.proxyByPass;

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
      show: config.tests.e2e.show,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          `--proxy-server=${proxyServer}`,
          `--proxy-bypass-list=${proxyByPass}`
        ]
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
