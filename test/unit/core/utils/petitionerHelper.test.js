const modulePath = 'middleware/petitionMiddleware';
const config = require('config');
const { expect, itParam } = require('@hmcts/one-per-page-test-suite');
const {
  isApplicationProcessing,
  getDnRedirectUrl,
  getDaRedirectUrl
} = require('core/utils/petitionHelper');

const authTokenString = '__auth-token';
const email = 'user@email.com';
const req = {
  cookies: { '__auth-token': 'authToken' },
  idam: {
    userDetails: { email }
  }
};

describe(modulePath, () => {
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
});
