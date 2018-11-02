const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const config = require('config');
const { URL } = require('url');

const redirectUri = `${config.node.baseUrl}${config.paths.authenticated}`;

const idamArgs = {
  redirectUri,
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
    const reqUrl = new URL(req.get('host'));
    // clone args so we don't modify the global idamArgs
    const args = Object.assign({}, idamArgs);
    args.hostName = reqUrl.hostname;
    args.redirectUri = reqUrl.origin + config.paths.authenticated;
    middleware.authenticate(args)(req, res, next);
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