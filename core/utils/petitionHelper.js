const config = require('config');
const { isEqual, get } = require('lodash');

const authTokenString = '__auth-token';
const applicationProcessingCases = config.applicationProcessingCaseStates;

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
  return applicationProcessingCases.includes(caseState);
};

const isAosAwaitingState = caseState => {
  return caseState === config.caseStates.AosAwaiting;
};

const isBailiffCase = caseState => {
  const bailiffStates = ['AwaitingBailiffReferral', 'AwaitingBailiffService', 'IssuedToBailiff'];
  return bailiffStates.includes(caseState);
};

const isLinkedBailiffCase = req => {
  const caseState = get(req.session, 'caseState');
  const receivedAos = get(req.session, 'originalPetition.receivedAOSfromResp');
  return isBailiffCase(caseState) && isEqual(receivedAos, constants.yes);
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
  isLinkedBailiffCase,
  isApplicationProcessing,
  getDnRedirectUrl,
  getDaRedirectUrl
};
