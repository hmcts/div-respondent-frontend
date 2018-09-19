const config = require('config');

const waitForTimeout = config.tests.e2e.waitForTimeout;
const waitForAction = config.tests.e2e.waitForAction;
const chromeArgs = [ '--no-sandbox' ];

if (config.environment !== 'development') {
  const proxyServer = config.tests.e2e.idam.idamTestApiProxy;
  const proxyByPass = config.tests.e2e.idam.idamTestProxyByPass;
  chromeArgs.push(`--proxy-server=${proxyServer}`);
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass}`);
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
  plugins: {
    stepByStepReport: {
      enabled: true,
      fullPageScreenshots: true
    },
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 2
    }
  },
  name: 'Frontend Tests'
};
