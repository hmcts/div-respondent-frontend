const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const config = require('@hmcts/properties-volume').addTo(require('config'));
const logger = require('services/logger').getLogger(__filename);

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

const setArgsFromRequest = req => {
  // clone args so we don't modify the global idamArgs
  const args = Object.assign({}, idamArgs);
  args.hostName = req.hostname;
  logger.infoWithReq(req, 'req_session', 'req.session:', req.session);
  if (req.session && req.session.language) {
    logger.infoWithReq(req, 'req_session_language', 'req.session.language:', req.session.language);
  }
  logger.infoWithReq(req, 'req_query', 'req.query:', req.query);
  if (req.query && req.query.locale) {
    logger.infoWithReq(req, 'req_query_locale', 'req.query.locale:', req.query.locale);
  }
  args.language = (req.session && req.session.language) ? req.session.language : 'en';
  args.redirectUri = `https://${req.get('host') + config.paths.authenticated}`;
  return args;
};

const methods = {
  getIdamArgs: () => {
    return idamArgs;
  },
  authenticate: (req, res, next) => {
    const args = setArgsFromRequest(req);
    middleware.authenticate(args)(req, res, next);
  },
  landingPage: (req, res, next) => {
    const args = setArgsFromRequest(req);
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
