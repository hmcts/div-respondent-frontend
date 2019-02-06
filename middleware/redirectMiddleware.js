const config = require('config');

const crRespond = require('steps/correspondent/cr-respond/CrRespond.step');

const authTokenString = '__auth-token';

const redirectOnCondition = (req, res, next) => {
  const hasOriginalPetition = req.session && req.session.originalPetition;
  if (!hasOriginalPetition) {
    return next();
  }

  const idamUserIsCorrespondent = req.idam.userDetails.email === req.session.originalPetition.coRespEmailAddress;
  if (idamUserIsCorrespondent) {
    return res.redirect(crRespond.path);
  }

  const idamUserIsRespondent = req.idam.userDetails.email === req.session.originalPetition.respEmailAddress;
  if (!idamUserIsRespondent) {
    const appLandingPage = `${config.services.dnFrontend.url}${config.services.dnFrontend.landing}`;
    const queryString = `?${authTokenString}=${req.cookies[authTokenString]}`;

    return res.redirect(`${appLandingPage}${queryString}`);
  }

  return next();
};

module.exports = { redirectOnCondition };
