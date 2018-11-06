const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const config = require('config');

const idamArgs = {
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
  authenticate: (req, res, next) => {
    // clone args so we don't modify the global idamArgs
    const args = Object.assign({}, idamArgs);
    args.hostName = req.hostname;
    args.redirectUri = `https://${req.get('host') + config.paths.authenticated}`;
    middleware.authenticate(args)(req, res, next);
  },
  landingPage: (req, res, next) => {
    const args = Object.assign({}, idamArgs);
    args.hostName = req.hostname;
    args.redirectUri = `https://${req.get('host') + config.paths.authenticated}`;
    middleware.landingPage(args)(req, res, next);
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