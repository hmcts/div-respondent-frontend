/* eslint-disable no-process-env */
const config = require('config');

const waitForTimeout = 15000;
const waitForAction = 1000;
const chromeArgs = [ '--no-sandbox' ];

exports.config = {
  tests: './paths/**/*.js',
  output: `${process.cwd()}/mock-output`,
  helpers: {
    Puppeteer: {
      url: config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: false,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
    },
    IdamHelper: { require: '../e2e/helpers/idamHelper.js' },
    CaseHelper: { require: '../e2e/helpers/caseHelper.js' },
    JSWait: { require: '../e2e/helpers/JSWait.js' }
  },
  include: { I: '../e2e/pages/steps.js' },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: './mocks-output/result.xml' }
      },
      mochawesome: {
        stdout: './mocks-output/console.log',
        options: {
          reportDir: process.env.E2E_OUTPUT_DIR || './mocks-output',
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    parallel: {
      chunks: 4,
      browsers: ['chrome']
    }
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 1
    },
    autoDelay: {
      enabled: true
    }
  },
  name: 'Respondent Frontend Mock Tests'
};
