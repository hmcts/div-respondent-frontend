const caseOrchestration = require('services/caseOrchestration');
const config = require('config');
const CaptureCaseAndPin = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const ProgressBar = require('steps/respondent/progress-bar/ProgressBar.step');
const crProgressBar = require('steps/co-respondent/cr-progress-bar/CrProgressBar.step');
const DivorceApplicationProcessing = require('steps/divorce-application-processing/DivorceApplicationProcessing.step');
const logger = require('services/logger').getLogger(__filename);
const crRespond = require('steps/co-respondent/cr-respond/CrRespond.step');
const httpStatus = require('http-status-codes');
const {
  isValidStateForAos,
  isUnlinkedBailiffCase,
  isAosAwaitingState,
  isApplicationProcessing,
  getDaRedirectUrl
} = require('core/utils/petitionHelper');

function storePetitionInSession(req, response) {
  req.session.referenceNumber = response.body.caseId;
  req.session.caseState = response.body.state;
  req.session.originalPetition = response.body.data;
  /* eslint-disable */
  if (req.session.originalPetition.marriageIsSameSexCouple !== 'Yes') {
    req.session.divorceWho = req.session.originalPetition.divorceWho === 'husband'
      ? 'wife'
      : 'husband';
  } else {
    req.session.divorceWho = req.session.originalPetition.divorceWho;
  }
  req.session.languagePreferenceWelsh = req.session.originalPetition.languagePreferenceWelsh;

  const divorceCenter = req.session.originalPetition.courts;
  req.session.serviceCentreName = req.session.originalPetition.court[divorceCenter].serviceCentreName;
  req.session.divorceCenterName = req.session.originalPetition.court[divorceCenter].divorceCentre;
  req.session.divorceCenterCourtCity = req.session.originalPetition.court[divorceCenter].courtCity;
  req.session.divorceCenterPostCode = req.session.originalPetition.court[divorceCenter].postCode;
  req.session.divorceCenterEmail = req.session.originalPetition.court[divorceCenter].email;
  req.session.divorceCenterPhoneNumber = req.session.originalPetition.court[divorceCenter].phoneNumber;

  if (req.session.originalPetition.court[divorceCenter].poBox) {
    req.session.divorceCenterPoBox = req.session.originalPetition.court[divorceCenter].poBox;
  }

  if (req.session.originalPetition.court[divorceCenter].street) {
    req.session.divorceCenterStreet = req.session.originalPetition.court[divorceCenter].street;
  }
  /* eslint-enable */
}

function findCoRespPath(coRespAnswers, caseState) {
  const receivedAOSRespFromCoResp = coRespAnswers && coRespAnswers.aos && coRespAnswers.aos.received === 'Yes';
  if (!receivedAOSRespFromCoResp && config.coRespRespondableStates.includes(caseState)) {
    return crRespond.path;
  }
  return crProgressBar.path;
}

const loadMiniPetition = (req, res, next) => {
  return caseOrchestration.getPetition(req)
    // eslint-disable-next-line complexity
    .then(response => {
      if (response.statusCode === httpStatus.OK) {
        storePetitionInSession(req, response);

        const caseState = response.body.state;
        if (isApplicationProcessing(caseState)) {
          logger.infoWithReq(req, 'divorce_application_processing', `Case state is ${caseState}, redirecting to Divorce Application Processing detail page`);
          return res.redirect(DivorceApplicationProcessing.path);
        }

        const originalPetition = req.session.originalPetition;
        const coRespAnswers = originalPetition && originalPetition.coRespondentAnswers;
        const idamUserIsCorespondent = coRespAnswers && coRespAnswers.contactInfo && req.idam.userDetails.email === coRespAnswers.contactInfo.emailAddress;

        if (idamUserIsCorespondent) {
          logger.infoWithReq(req, 'user_is_coresp', 'User is corespondent, redirecting to find CoRespPath');
          return res.redirect(findCoRespPath(coRespAnswers, caseState));
        }

        if (caseState === config.caseStates.DivorceGranted) {
          const redirectUrl = getDaRedirectUrl(req);
          logger.infoWithReq(req, 'redirect_to_da', 'User is respondent and divorce is granted, redirecting to DA');
          logger.infoWithReq(req, redirectUrl);
          return res.redirect(redirectUrl);
        }

        if (isAosAwaitingState(caseState) || isUnlinkedBailiffCase(req)) {
          logger.infoWithReq(req, 'case_aos_awaiting', 'Case is awaiting, redirecting to capture case and pin page');
          return res.redirect(CaptureCaseAndPin.path);
        }

        if (!isValidStateForAos(caseState)) {
          logger.infoWithReq(req, 'case_not_started', 'Case not started, redirecting to progress bar page');
          return res.redirect(ProgressBar.path);
        }

        logger.infoWithReq(req, 'case_state_ok', 'Case is in a valid state for the respondent to respond, can proceed respondent journey', response.statusCode);
        return next();
      } else if (response.statusCode === httpStatus.NOT_FOUND) {
        logger.infoWithReq(req, 'case_not_found', 'Case not found, redirecting to capture case and pin page');
        return res.redirect(CaptureCaseAndPin.path);
      } else if (response.statusCode >= httpStatus.BAD_REQUEST) {
        logger.errorWithReq(req, 'case_unexpected_response', 'Unexpected response code while retrieving case', response.statusCode);
        return next(new Error(response));
      }

      logger.infoWithReq(req, 'load_mini_petition', 'Loading mini petition', response.statusCode);
      return next();
    });
};

module.exports = { loadMiniPetition };
