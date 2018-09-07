const modulePath = 'steps/respond/Respond.step';

const Respond = require(modulePath);
const ReviewApplication = require('steps/review-application/ReviewApplication.step');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const ccd = require('middleware/ccd');
const getSteps = require('steps');
const CONF = require('config');

describe(modulePath, () => {
  const defaultEnvironment = CONF.environment;
  beforeEach(() => {
    CONF.environment = 'development';
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(ccd, 'getUserData').callsFake(middleware.nextMock);
  });

  afterEach(() => {
    CONF.environment = defaultEnvironment;
    idam.protect.restore();
    ccd.getUserData.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Respond, [ idam.protect() ]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(Respond, ReviewApplication, getSteps());
  });

  it('renders the content', () => {
    return content(Respond, {}, { ignoreContent: [
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'backLink'
    ] });
  });
});
