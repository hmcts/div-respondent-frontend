const config = require('config');
const { isEqual, get, toLower } = require('lodash');

const authTokenString = '__auth-token';
const {
  respRespondableStates,
  applicationProcessingCaseStates,
  bailiffProcessingCaseStates
} = config;

const constants = {
  proceed: 'proceed',
  proceedButDisagree: 'proceedButDisagree',
  defend: 'defend',
  yes: 'Yes',
  no: 'No',
  notAccept: 'NoNoAdmission',
  behavior: 'unreasonable-behaviour',
  desertion: 'desertion',
  separation5yrs: 'separation-5-years',
  coRespondent: 'correspondent'
};

const isApplicationProcessing = caseState => {
  return applicationProcessingCaseStates.includes(caseState);
};

const isAosAwaitingState = caseState => {
  return caseState === config.caseStates.AosAwaiting;
};

const isBailiffCase = caseState => {
  return bailiffProcessingCaseStates.includes(caseState);
};

const isUnlinkedBailiffCase = req => {
  const caseState = get(req.session, 'caseState');
  if (!isBailiffCase(caseState)) {
    return false;
  }
  const receivedAos = toLower(get(req.session, 'originalPetition.receivedAosFromResp', 'No'));
  return isBailiffCase(caseState) && isEqual(receivedAos, toLower(constants.no));
};

const isValidStateForAos = caseState => {
  return respRespondableStates.includes(caseState);
};

const idamUserIsCorespondent = (req, coRespAnswers) => {
  return isEqual(get(req, 'idam.userDetails.email'), get(coRespAnswers, 'contactInfo.emailAddress'));
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
  constants,
  isAosAwaitingState,
  isValidStateForAos,
  idamUserIsCorespondent,
  isUnlinkedBailiffCase,
  isApplicationProcessing,
  getDnRedirectUrl,
  getDaRedirectUrl
};
