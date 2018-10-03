const modulePath = 'steps/choose-a-response/ChooseAResponse.step';
const ChooseAResponse = require(modulePath);
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const ConfirmDefence = require('steps/confirm-defence/ConfirmDefence.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ChooseAResponse, [idam.protect()]);
  });

  it('redirects to jurisdiction page when proceeding with divorce', () => {
    const fields = { respDefendsDivorce: 'yes' };
    return question.redirectWithField(ChooseAResponse, fields, Jurisdiction);
  });

  it('redirects to confirm defence page when disagreeing with divorce', () => {
    const fields = { respDefendsDivorce: 'no' };
    return question.redirectWithField(ChooseAResponse, fields, ConfirmDefence);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ChooseAResponse);
  });

  it('renders the content', () => {
    return content(ChooseAResponse, {}, { ignoreContent: ['info'] });
  });
});
