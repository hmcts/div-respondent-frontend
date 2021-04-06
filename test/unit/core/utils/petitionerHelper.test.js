const modulePath = 'middleware/petitionMiddleware';
const config = require('config');
const { expect, itParam } = require('@hmcts/one-per-page-test-suite');
const {
  isValidStateForAos,
  isLinkedBailiffCase,
  isAosAwaitingState,
  isApplicationProcessing,
  getDnRedirectUrl,
  getDaRedirectUrl
} = require('core/utils/petitionHelper');

const authTokenString = '__auth-token';
const email = 'user@email.com';
const TEST_REFERENCE = '123456';
let req = {};

describe(modulePath, () => {
  beforeEach(() => {
    req = {
      cookies: { '__auth-token': 'authToken' },
      idam: {
        userDetails: { email }
      }
    };
  });

  itParam('should return true if state is to be handled on DN', config.applicationProcessingCaseStates, (done, validState) => {
    expect(isApplicationProcessing(validState)).to.be.true;
    done();
  });

  it('should return false if state is not to be handled on DN', () => {
    const validState = 'DNPronounced';
    expect(isApplicationProcessing(validState)).to.be.false;
  });

  it('should return expected DN redirect url', () => {
    const expectedUrl = getDnRedirectUrl(req);

    expect(expectedUrl).to.contain(config.services.dnFrontend.url);
    expect(expectedUrl).to.contain(config.services.dnFrontend.landing);
    expect(expectedUrl).to.contain(authTokenString);
  });

  it('should return expected DA redirect url', () => {
    const expectedUrl = getDaRedirectUrl(req);

    expect(expectedUrl).to.contain(config.services.daFrontend.url);
    expect(expectedUrl).to.contain(config.services.daFrontend.landing);
    expect(expectedUrl).to.contain(authTokenString);
  });

  it('should return true when state AosAwaiting', () => {
    expect(isAosAwaitingState('AosAwaiting')).to.be.true;
  });

  it('should return false when not AosAwaiting', () => {
    expect(isAosAwaitingState('SomeOtherState')).to.be.false;
  });

  it('should return true if bailiff case and not yet linked', () => {
    req.session = {
      referenceNumber: TEST_REFERENCE,
      caseState: 'AwaitingBailiffReferral',
      originalPetition: { receivedAOSfromResp: 'Yes' }
    };
    expect(isLinkedBailiffCase(req)).to.be.true;
  });

  it('should return false if bailiff case already linked', () => {
    req.session = {
      referenceNumber: TEST_REFERENCE,
      caseState: 'IssuedToBailiff',
      originalPetition: { receivedAOSfromResp: 'No' }
    };
    expect(isLinkedBailiffCase(req)).to.be.false;
  });

  it('should return false if any other linked state', () => {
    req.session = {
      referenceNumber: TEST_REFERENCE,
      caseState: 'SomeOtherState',
      originalPetition: { receivedAOSfromResp: 'Yes' }
    };
    expect(isLinkedBailiffCase(req)).to.be.false;
  });

  it('should return false if any other linked state', () => {
    req.session = {
      referenceNumber: TEST_REFERENCE,
      caseState: 'SomeOtherState',
      originalPetition: { someOtherProperty: 'Yes' }
    };
    expect(isLinkedBailiffCase(req)).to.be.false;
  });

  itParam('should return true if case is a valid Aos state', config.respRespondableStates, (done, respRespondableState) => {
    expect(isValidStateForAos(respRespondableState)).to.be.true;
    done();
  });

  it('should return false if case is not a valid Aos state', () => {
    expect(isValidStateForAos('SomeOtherState')).to.be.false;
  });
});
