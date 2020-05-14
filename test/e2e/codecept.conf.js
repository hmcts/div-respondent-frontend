/* eslint-disable no-process-env */
const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
const waitForAction = config.tests.e2e.waitForAction;
const chromeArgs = [ '--no-sandbox' ];

const proxyServer = config.tests.e2e.proxy;
if (proxyServer) {
  chromeArgs.push(`--proxy-server=${proxyServer}`);
}

const proxyByPass = config.tests.e2e.proxyByPass;
if (proxyByPass) {
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass}`);
}


exports.config = {
  tests: './paths/signout.js',
  output: config.tests.e2e.outputDir,
  helpers: {
    Puppeteer: {
      url: config.tests.e2e.url || config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: config.tests.e2e.show,
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
