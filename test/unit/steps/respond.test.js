const modulePath = 'steps/respond/Respond.step';

const Respond = require(modulePath);
const ReviewApplication = require('steps/review-application/ReviewApplication.step');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const getSteps = require('steps');
const request = require('request-promise-native');
const rawResponse = require('resources/raw-response-mock.json');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(request, 'get')
      .resolves(rawResponse);
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    request.get.restore();
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
      'backLink',
      'divorceCenterUrl'
    ] });
  });
});
