const config = require('config');

const authTokenString = '__auth-token';
const applicationProcessingCases = config.applicationProcessingCaseStates;

const isApplicationProcessing = caseState => {
  return applicationProcessingCases.includes(caseState);
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

module.exports = {
  isApplicationProcessing,
  getDnRedirectUrl,
  getDaRedirectUrl
};
