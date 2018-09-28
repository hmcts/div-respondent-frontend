const modulePath = 'steps/respond/Respond.step';

const Respond = require(modulePath);
const ReviewApplication = require('steps/review-application/ReviewApplication.step');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const getSteps = require('steps');
const authenticated = require('middleware/authenticated');
const loadMiniPetition = require('middleware/loadMiniPetition');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(authenticated, 'captureCaseAndPin')
      .callsFake(middleware.nextMock);
    sinon.stub(loadMiniPetition, 'loadMiniPetition')
      .callsFake(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    authenticated.captureCaseAndPin.restore();
    loadMiniPetition.loadMiniPetition.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Respond, [idam.protect()]);
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
      'backLink',
      'divorceCenterUrl'
    ] });
  });
});
