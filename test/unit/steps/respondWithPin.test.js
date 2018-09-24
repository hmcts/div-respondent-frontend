const modulePath = 'steps/respond-with-pin/RespondWithPin.step';

const RespondWithPin = require(modulePath);
const Respond = require('steps/respond/Respond.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const rawResponse = require('resources/raw-response-mock.json');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(request, 'get')
      .resolves(rawResponse);
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    request.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(RespondWithPin, [idam.protect()]);
  });

  it('redirects to next page', () => {
    return question.redirectWithField(RespondWithPin, {}, Respond);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(RespondWithPin);
  });

  it('renders the content', () => {
    return content(RespondWithPin, {}, {
      ignoreContent: [
        'continue',
        'backLink'
      ]
    });
  });
});
