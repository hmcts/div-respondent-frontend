/* eslint-disable no-magic-numbers */
const config = require('config');
const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');

const waitForTimeout = config.tests.e2e.waitForTimeout;
const smartWait = config.tests.e2e.smartWait;
const browser = config.services.sourceLabs.browser;

const getDesiredCapabilities = () => {
  const desiredCapability = supportedBrowsers[browser];
  desiredCapability.tunnelIdentifier = config.services.sourceLabs.tunnelId;
  desiredCapability.tags = ['divorce'];
  return desiredCapability;
};

const setupConfig = {
  tests: './paths/**/*.js',
  output: config.tests.e2e.outputDir,
  helpers: {
    WebDriverIO: {
      url: config.node.baseUrl,
      browser: supportedBrowsers[browser].browserName,
      waitForTimeout,
      smartWait,
      cssSelectorsEnabled: 'true',
      windowSize: '1600x900',
      timeouts: {
        script: 60000,
        'page load': 60000,
        implicit: 20000
      },
      host: 'ondemand.saucelabs.com',
      port: 80,
      user: config.services.sourceLabs.username,
      key: config.services.sourceLabs.key,
      desiredCapabilities: getDesiredCapabilities()
    },
    IdamHelper: { require: './helpers/idamHelper.js' },
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
        options: { mochaFile: `${config.tests.e2e.outputDir}/result.xml` }
      },
      mochawesome: {
        stdout: `${config.tests.e2e.outputDir}/console.log`,
        options: {
          reportDir: config.tests.e2e.outputDir,
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  name: 'Frontend Tests'
};

exports.config = setupConfig;
