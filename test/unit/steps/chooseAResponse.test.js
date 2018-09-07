const modulePath = 'steps/choose-a-response/ChooseAResponse.step';
const ChooseAResponse = require(modulePath);
const End = require('steps/end/End.step');
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

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ChooseAResponse, [idam.protect(), getUserData]);
  });

  it('redirects to next page on success', () => {
    const fields = { response: 'proceed' };
    return question.redirectWithField(ChooseAResponse, fields, End);
  });

  it('does not proceed when answer is not provided', () => {
    return question.redirectWithField(ChooseAResponse, {}, ChooseAResponse);
  });

  it('renders the content', () => {
    return content(ChooseAResponse);
  });
});
