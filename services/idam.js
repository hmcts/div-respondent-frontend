const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const config = require('config');
const url = require('url');

const redirectUri = `${config.node.baseUrl}${config.paths.authenticated}`;

const idamArgs = {
  redirectUri,
  hostName: url.parse(config.node.baseUrl).hostname,
  indexUrl: config.paths.index,
  idamApiUrl: config.services.idam.apiUrl,
  idamLoginUrl: config.services.idam.loginUrl,
  idamSecret: config.services.idam.secret,
  idamClientID: config.services.idam.clientId
};

let middleware = idamExpressMiddleware;
if (['development'].includes(config.environment)) {
  middleware = idamExpressMiddlewareMock;
}

const methods = {
  getIdamArgs: () => {
    return idamArgs;
  },
  authenticate: (...args) => {
    return middleware.authenticate(idamArgs, ...args);
  },
  landingPage: (...args) => {
    return middleware.landingPage(idamArgs, ...args);
  },
  protect: (...args) => {
    return middleware.protect(idamArgs, ...args);
  },
  logout: (...args) => {
    return middleware.logout(idamArgs, ...args);
  },
  userDetails: () => {
    return middleware.userDetails(idamArgs);
  }
};

module.exports = methods;