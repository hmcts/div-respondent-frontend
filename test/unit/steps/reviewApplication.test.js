const modulePath = 'steps/review-application/ReviewApplication.step';

const ReviewApplication = require(modulePath);
const ChooseAResponse = require('steps/choose-a-response/ChooseAResponse.step');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { getUserData } = require('middleware/ccd');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewApplication, [ idam.protect(), getUserData ]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(ReviewApplication, ChooseAResponse);
  });

  it('renders the content', () => {
    return content(ReviewApplication);
  });
});
