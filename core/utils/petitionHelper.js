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
  return redirectUrl;
};

const getDaRedirectUrl = req => {
  const daAppLandingPage = `${config.services.daFrontend.url}${config.services.daFrontend.landing}`;
  const daQueryString = `?${authTokenString}=${req.cookies[authTokenString]}`;
  const redirectUrl = `${daAppLandingPage}${daQueryString}`;
  return redirectUrl;
};

const redirectToDn = (req, res, caseState) => {
  const redirectUrl = getDnRedirectUrl(req);
  logger.infoWithReq(req, 'redirect_to_dn', `case state is ${caseState}, redirecting to DN`);
  logger.infoWithReq(req, redirectUrl);
  return res.redirect(redirectUrl);
};

module.exports = {
  isStateToRedirectToDn,
  redirectToDn,
  getDnRedirectUrl,
  getDaRedirectUrl
};
