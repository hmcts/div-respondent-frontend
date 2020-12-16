const config = require('config');
const logger = require('services/logger').getLogger(__filename);
const { toLower } = require('lodash');

const authTokenString = '__auth-token';

const statesToRedirectToDn = ['awaitinggeneralreferralpayment', 'generalconsiderationcomplete'];

const isStateToRedirectToDn = caseState => {
  return statesToRedirectToDn.includes(toLower(caseState));
};

const redirectToDn = (req, res, caseState) => {
  const appLandingPage = `${config.services.dnFrontend.url}${config.services.dnFrontend.landing}`;
  const queryString = `?${authTokenString}=${req.cookies[authTokenString]}`;

  logger.infoWithReq(req, 'redirect_to_dn', `case state is ${caseState}, redirecting to DN`);
  return res.redirect(`${appLandingPage}${queryString}`);
};

const redirectOnCondition = (req, res, next) => {
  const hasOriginalPetition = req.session && req.session.originalPetition;
  if (!hasOriginalPetition) {
    return next();
  }

  const originalPetition = req.session.originalPetition;
  const idamUserIsRespondent = req.idam.userDetails.email === originalPetition.respEmailAddress;

  if (!idamUserIsRespondent) {
    const appLandingPage = `${config.services.dnFrontend.url}${config.services.dnFrontend.landing}`;
    const queryString = `?${authTokenString}=${req.cookies[authTokenString]}`;

    logger.infoWithReq(req, 'redirect_to_dn', 'IDAM user does not match case respondent user, redirecting to DN');
    return res.redirect(`${appLandingPage}${queryString}`);
  }

  const caseState = req.session.caseState;
  if (isStateToRedirectToDn(caseState)) {
    return redirectToDn(req, res, caseState);
  }

  return next();
};

module.exports = { redirectOnCondition };
