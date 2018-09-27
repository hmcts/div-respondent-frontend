const modulePath = 'steps/confirm-defence/ConfirmDefence.step.js';
const ConfirmDefence = require(modulePath);
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const ChooseAResponse = require('steps/choose-a-response/ChooseAResponse.step');
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
    return middleware.hasMiddleware(ConfirmDefence, [idam.protect(), getUserData]);
  });

  it('redirects to the check your answers page on confirmation', () => {
    const fields = { response: 'confirm' };
    return question.redirectWithField(ConfirmDefence, fields, CheckYourAnswers);
  });

  it('redirects to back to choose a response page on changing response', () => {
    const fields = { response: 'changeResponse' };
    return question.redirectWithField(ConfirmDefence, fields, ChooseAResponse);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ConfirmDefence);
  });

  it('renders the content', () => {
    return content(ConfirmDefence, {}, { ignoreContent: ['info'] });
  });
});
