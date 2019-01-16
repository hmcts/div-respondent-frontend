const config = require('config');
const express = require('express');
const path = require('path');
const onePerPage = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const logging = require('@hmcts/nodejs-logging');
const getSteps = require('steps');
const setupHelmet = require('middleware/helmet');
const setupPrivacy = require('middleware/privacy');
const setupHealthChecks = require('middleware/healthcheck');
const idam = require('services/idam');
const cookieParser = require('cookie-parser');
const setupRateLimiter = require('services/rateLimiter');
const setLocals = require('middleware/setLocalsMiddleware');
const getFilters = require('views/filters');
const errorContent = require('views/errors/error-content');

const app = express();

setupHelmet(app);
setupPrivacy(app);
setupHealthChecks(app);
setupRateLimiter(app);

// Parsing cookies
app.use(cookieParser());

lookAndFeel.configure(app, {
  baseUrl: '/',
  express: {
    views: [
      path.resolve(__dirname, 'mocks', 'steps'),
      path.resolve(__dirname, 'steps'),
      path.resolve(__dirname, 'views')
    ]
  },
  webpack: {
    entry: [
      path.resolve(__dirname, 'assets/js/main.js'),
      path.resolve(__dirname, 'assets/scss/main.scss'),
      path.resolve(__dirname, 'assets/scss/_choose-a-response.scss'),
      path.resolve(__dirname, 'assets/scss/_check-your-answers.scss'),
      path.resolve(__dirname, 'assets/scss/_agree-to-pay-costs.scss'),
      path.resolve(__dirname, 'assets/scss/_confirm-defence.scss'),
      path.resolve(__dirname, 'assets/scss/_review-application.scss')
    ]
  },
  nunjucks: {
    filters: getFilters(),
    globals: {
      phase: 'BETA',
      feedbackLink: 'http://www.smartsurvey.co.uk/s/0QIL4/',
      googleAnalyticsId: config.services.googleAnalytics.id
    }
  }
});

// Get user details from idam, sets req.idam.userDetails
app.use(idam.userDetails());

app.use(setLocals.idamLoggedin);

app.set('trust proxy', 1);

onePerPage.journey(app, {
  baseUrl: config.node.baseUrl,
  steps: getSteps(),
  errorPages: {
    serverError: {
      template: 'errors/server-error',
      message: {
        tryAgain: errorContent.tryAgain,
        canContact: errorContent.canContact,
        phoneDetails: errorContent.isThereAProblemWithThisPagePhone,
        emailDetails: errorContent.isThereAProblemWithThisPageEmail,
        serviceName: errorContent.serviceName
      }
    },
    notFound: {
      template: 'errors/not-found-error',
      message: {
        errorMessage: errorContent.notFoundMessage,
        isThereAProblem: errorContent.isThereAProblemWithThisPageParagraph,
        phoneDetails: errorContent.isThereAProblemWithThisPagePhone,
        emailDetails: errorContent.isThereAProblemWithThisPageEmail,
        serviceName: errorContent.serviceName
      }
    }
  },
  session: {
    redis: { url: config.services.redis.url },
    cookie: {
      secure: config.session.secure,
      expires: config.session.expires
    },
    secret: config.session.secret,
    sessionEncryption: req => {
      let key = config.services.redis.encryptionAtRestKey;
      if (req && req.idam && req.idam.userDetails) {
        key += req.idam.userDetails.id;
      }
      return key;
    }
  },
  timeoutDelay: config.journey.timeoutDelay,
  i18n: { filters: getFilters() },
  useCsrfToken: true
});

app.use(logging.Express.accessLogger());

module.exports = app;
