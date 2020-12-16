const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const authTokenString = '__auth-token';
const statesToRedirectToDn = config.dnCaseStates;

const isStateToRedirectToDn = caseState => {
  return statesToRedirectToDn.includes(caseState);
};

const getDnRedirectUrl = req => {
  const appLandingPage = `${config.services.dnFrontend.url}${config.services.dnFrontend.landing}`;
  const queryString = `?${authTokenString}=${req.cookies[authTokenString]}`;
  const redirectUrl = `${appLandingPage}${queryString}`;
  logger.infoWithReq(req, redirectUrl);
  return redirectUrl;
};

const getDaRedirectUrl = req => {
  const daAppLandingPage = `${config.services.daFrontend.url}${config.services.daFrontend.landing}`;
  const daQueryString = `?${authTokenString}=${req.cookies[authTokenString]}`;
  const redirectUrl = `${daAppLandingPage}${daQueryString}`;
  logger.infoWithReq(req, redirectUrl);
  return redirectUrl;
};

const redirectToDn = (req, res, caseState) => {
  logger.infoWithReq(req, 'redirect_to_dn', `case state is ${caseState}, redirecting to DN`);
  return res.redirect(getDnRedirectUrl(req));
};

module.exports = {
  isStateToRedirectToDn,
  redirectToDn,
  getDnRedirectUrl,
  getDaRedirectUrl
};
