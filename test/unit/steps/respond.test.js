const modulePath = 'steps/respond/Respond.step';

const Respond = require(modulePath);
const ReviewApplication = require('steps/review-application/ReviewApplication.step');
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
    return middleware.hasMiddleware(Respond, [ idam.protect(), getUserData ]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(Respond, ReviewApplication);
  });

  it('renders the content', () => {
    return content(Respond);
  });
});
