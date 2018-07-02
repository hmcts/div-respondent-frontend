const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
const waitForAction = config.tests.e2e.waitForAction;
const proxyServer = config.tests.e2e.proxyServer;
const proxyByPass = config.tests.e2e.proxyByPass;
const chromeArgs = [ '--no-sandbox' ];

if (config.environment !== 'development') {
  chromeArgs.push(`--proxy-server=${proxyServer}`);
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass}`);
}

exports.config = {
  tests: './paths/**/*.js',
  output: config.tests.e2e.outputDir,
  helpers: {
    Puppeteer: {
      url: config.tests.url || config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: false,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
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
