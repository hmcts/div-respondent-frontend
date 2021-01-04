const modulePath = 'middleware/petitionMiddleware';
const config = require('config');
const { sinon, expect, itParam } = require('@hmcts/one-per-page-test-suite');
const {
  isStateToRedirectToDn,
  redirectToDn,
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
  itParam('should return true if state is to be handled on DN', config.dnCaseStates, (done, validState) => {
    expect(isStateToRedirectToDn(validState)).to.be.true;
    done();
  });

  it('should return false if state is not to be handled on DN', () => {
    const validState = 'DNPronounced';
    expect(isStateToRedirectToDn(validState)).to.be.false;
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

  it('should fire redirect url to DN', () => {
    const res = {
      redirect: sinon.spy()
    };
    const dnRedirectUrl = getDnRedirectUrl(req);

    redirectToDn(req, res, 'caseState');

    expect(res.redirect.withArgs(dnRedirectUrl).calledOnce).to.be.true;
  });
});
