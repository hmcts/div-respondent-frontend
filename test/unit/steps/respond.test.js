const modulePath = 'steps/respond/Respond.step';

const Respond = require(modulePath);
const ReviewApplication = require('steps/review-application/ReviewApplication.step');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const getSteps = require('steps');
const petitionMiddleware = require('middleware/petitionMiddleware');
const redirectMiddleware = require('middleware/redirectMiddleware');


describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(petitionMiddleware, 'loadMiniPetition')
      .callsFake(middleware.nextMock);
    sinon.stub(redirectMiddleware, 'redirectOnCondition')
      .callsFake(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    petitionMiddleware.loadMiniPetition.restore();
    redirectMiddleware.redirectOnCondition.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Respond,
      [
        idam.protect(),
        petitionMiddleware.loadMiniPetition,
        redirectMiddleware.redirectOnCondition
      ]
    );
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
