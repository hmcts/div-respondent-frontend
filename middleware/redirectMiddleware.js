const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const authTokenString = '__auth-token';

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

  return next();
};

module.exports = { redirectOnCondition };