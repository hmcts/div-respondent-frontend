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

const app = express();

setupHelmet(app);
setupPrivacy(app);
setupHealthChecks(app);
setupRateLimiter(app);

// Parsing cookies
app.use(cookieParser());

// Get user details from idam, sets req.idam.userDetails
app.use(idam.userDetails());

lookAndFeel.configure(app, {
  baseUrl: config.node.baseUrl,
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
      path.resolve(__dirname, 'assets/scss/main.scss')
    ]
  },
  nunjucks: {
    globals: {
      phase: 'ALPHA',
      feedbackLink: 'https://github.com/hmcts/one-per-page/issues/new',
      googleAnalyticsId: config.services.googleAnalytics.id
    }
  }
});

onePerPage.journey(app, {
  baseUrl: config.node.baseUrl,
  steps: getSteps(),
  errorPages: {},
  session: {
    redis: { url: config.services.redis.url },
    cookie: { secure: config.services.redis.useSSL === 'true' },
    secret: config.services.redis.secret,
    sessionEncryption: req => {
      let key = config.services.redis.encryptionAtRestKey;
      if (req && req.idam && req.idam.userDetails) {
        key += req.idam.userDetails.id;
      }
      return key;
    }
  }
});

app.use(logging.Express.accessLogger());

module.exports = app;
