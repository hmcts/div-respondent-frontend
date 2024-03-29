const config = require('config');
const express = require('express');
const path = require('path');
const onePerPage = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const { accessLogger } = require('services/logger');
const getSteps = require('steps');
const setupHelmet = require('middleware/helmet');
const setupPrivacy = require('middleware/privacy');
const setupHealthChecks = require('middleware/healthcheck');
const idam = require('services/idam');
const cookieParser = require('cookie-parser');
const setupRateLimiter = require('services/rateLimiter');
const documentHandler = require('services/documentHandler');
const setLocals = require('middleware/setLocalsMiddleware');
const getFilters = require('views/filters');
const errorContent = require('views/errors/error-content');
const httpStatus = require('http-status-codes');
const { parseBool } = require('@hmcts/one-per-page/util');

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
      path.resolve(__dirname, 'assets/js/cookiesManager.js'),
      path.resolve(__dirname, 'assets/scss/main.scss'),
      path.resolve(__dirname, 'assets/scss/_choose-a-response.scss'),
      path.resolve(__dirname, 'assets/scss/_check-your-answers.scss'),
      path.resolve(__dirname, 'assets/scss/_agree-to-pay-costs.scss'),
      path.resolve(__dirname, 'assets/scss/_confirm-defence.scss'),
      path.resolve(__dirname, 'assets/scss/_cookies.scss'),
      path.resolve(__dirname, 'assets/scss/_review-application.scss'),
      path.resolve(__dirname, 'assets/scss/_web-chat.scss')
    ]
  },
  nunjucks: {
    filters: getFilters(),
    globals: {
      phase: 'BETA',
      feedbackLink: 'https://www.smartsurvey.co.uk/s/Divorce_Feedback',
      googleAnalyticsId: config.services.googleAnalytics.id,
      antennaWebchat: {
        url: config.services.antennaWebchat.url,
        service: config.services.antennaWebchat.service,
        version: config.services.antennaWebchat.version
      },
      commonProps: {
        en: {
          courtPhoneNumber: config.commonProps.courtPhoneNumberEn,
          courtOpeningHours: config.commonProps.courtOpeningHourEn
        }
      },
      features: {
        antennaWebchatUserAttribute: parseBool(config.features.antennaWebchatUserAttribute),
        antennaWebchatAvailabilityToggle: parseBool(config.features.antennaWebchatAvailabilityToggle),
        // Dynatrace Feature Toggle
        dynatrace: parseBool(config.features.dynatrace)
      }
    }
  }
});

// Get user details from idam, sets req.idam.userDetails
app.use(idam.userDetails());

// 1px image used for tracking
app.get('/noJS.png', (req, res) => {
  res.send('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
});

app.use('/webchat', express.static(`${__dirname}/node_modules/@hmcts/ctsc-web-chat/assets`));

app.use('/public/locale', express.static(`${__dirname}/assets/locale`));
app.use('/public/js', express.static(`${__dirname}/assets/js`));

app.use(accessLogger());

app.use(setLocals.idamLoggedin);

app.set('trust proxy', 1);

const getSession = {
  bind: theApp => {
    if (config.NODE_ENV !== 'production') {
      theApp.get('/session', (req, res) => {
        res.writeHead(httpStatus.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(req.session));
      });
    }
  }
};

onePerPage.journey(app, {
  baseUrl: config.node.baseUrl,
  steps: getSteps(),
  routes: [documentHandler, getSession],
  errorPages: {
    serverError: {
      template: 'errors/server-error',
      message: {
        tryAgain: errorContent.tryAgain,
        canContact: errorContent.canContact,
        phoneDetails: errorContent.isThereAProblemWithThisPagePhone,
        emailDetails: errorContent.isThereAProblemWithThisPageEmail,
        serviceName: errorContent.serviceName,
        youCanEither: errorContent.youCanEither,
        backLink: errorContent.backLink,
        feedback: errorContent.feedback,
        accessibility: errorContent.accessibility,
        cookies: errorContent.cookies,
        privacyPolicy: errorContent.privacyPolicy,
        termsAndConditions: errorContent.termsAndConditions
      }
    },
    notFound: {
      template: 'errors/not-found-error',
      message: {
        errorMessage: errorContent.notFoundMessage,
        isThereAProblem: errorContent.isThereAProblemWithThisPageParagraph,
        phoneDetails: errorContent.isThereAProblemWithThisPagePhone,
        emailDetails: errorContent.isThereAProblemWithThisPageEmail,
        serviceName: errorContent.serviceName,
        youCanEither: errorContent.youCanEither,
        backLink: errorContent.backLink,
        feedback: errorContent.feedback,
        accessibility: errorContent.accessibility,
        cookies: errorContent.cookies,
        privacyPolicy: errorContent.privacyPolicy,
        termsAndConditions: errorContent.termsAndConditions
      }
    }
  },
  session: {
    redis: { url: process.env.REDIS_URL || config.services.redis.url },
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

module.exports = app;
