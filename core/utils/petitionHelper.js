const config = require('config');
const { isEqual, get } = require('lodash');

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
  const receivedAos = get(req.session, 'originalPetition.receivedAosFromResp', 'No');
  return isBailiffCase(caseState) && isEqual(receivedAos, constants.no);
};

function isValidStateForAos(caseState) {
  return respRespondableStates.includes(caseState);
}

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
  isUnlinkedBailiffCase,
  isApplicationProcessing,
  getDnRedirectUrl,
  getDaRedirectUrl
};
