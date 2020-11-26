/* eslint-disable no-console, no-process-env */

const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const conf = require('config');
const merge = require('test/e2e/helpers/caseConfigHelper').merge;

const waitForTimeout = parseInt(conf.saucelabs.waitForTimeout);
const smartWait = parseInt(conf.saucelabs.smartWait);
const browser = process.env.SAUCE_BROWSER || conf.saucelabs.browser;
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME || conf.saucelabs.username,
  accessKey: process.env.SAUCE_ACCESS_KEY || conf.saucelabs.key,
  tunnelIdentifier: process.env.SAUCE_TUNNEL_IDENTIFIER || conf.saucelabs.tunnelId,
  acceptSslCerts: true,
  tags: ['RFE_divorce']
};

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(defaultSauceOptions, candidateCapabilities['sauce:options']);
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

const setupConfig = {
  tests: './paths/**/*.js',
  output: `${process.cwd()}/functional-output`,
  helpers: {
    WebDriver: {
      url: process.env.E2E_FRONTEND_URL || conf.tests.e2e.url,
      browser,
      waitForTimeout,
      smartWait,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {}
    },
    SauceLabsReportingHelper: { require: './helpers/sauceLabsReportingHelper.js' },
    JSWait: { require: './helpers/JSWait.js' },
    IdamHelper: { require: './helpers/idamHelper.js' },
    CaseHelper: { require: './helpers/caseHelper.js' },
    SauceLabsBrowserHelper: { require: './helpers/SauceLabsBrowserHelper.js' }
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
        options: { mochaFile: `${process.cwd()}/functional-output/result.xml` }
      },
      mochawesome: {
        stdout: './functional-output/console.log',
        options: {
          reportDir: `${process.cwd()}/functional-output`,
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    autoDelay: {
      enabled: true
    }
  },
  multiple: {
    microsoftIE11: {
      browsers: getBrowserConfig('microsoftIE11')
    },
    microsoftEdge: {
      browsers: getBrowserConfig('microsoftEdge')
    },
    chrome: {
      browsers: getBrowserConfig('chrome')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    },
    safari: {
      browsers: getBrowserConfig('safari')
    }
  },
  name: 'RFE Frontend Tests'
};

exports.config = setupConfig;
