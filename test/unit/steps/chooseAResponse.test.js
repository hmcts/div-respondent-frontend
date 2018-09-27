const modulePath = 'steps/choose-a-response/ChooseAResponse.step';
const ChooseAResponse = require(modulePath);
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { getUserData } = require('middleware/ccd');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and userData middleware', () => {
    return middleware.hasMiddleware(ChooseAResponse, [idam.protect(), getUserData]);
  });

  it('redirects to next page on success', () => {
    const fields = { response: 'proceed' };
    return question.redirectWithField(ChooseAResponse, fields, Jurisdiction);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ChooseAResponse);
  });

  it('renders the content', () => {
    return content(ChooseAResponse, {}, { ignoreContent: ['info'] });
  });
});
