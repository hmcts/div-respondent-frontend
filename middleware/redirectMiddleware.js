const config = require('config');

const authTokenString = '__auth-token';

const redirectOnCondition = (req, res, next) => {
  // If the user is not respondent forward the user to DN
  if (req.session && req.session.originalPetition && req.idam.userDetails.email !== req.session.originalPetition.respEmailAddress && req.idam.userDetails.email === req.session.originalPetition.petitionerEmail) {
    const appLandingPage = `${config.services.dnFrontend.url}${config.services.dnFrontend.landing}`;
    const queryString = `?${authTokenString}=${req.cookies[authTokenString]}`;

    return res.redirect(`${appLandingPage}${queryString}`);
  }

  return next();
};

module.exports = { redirectOnCondition };