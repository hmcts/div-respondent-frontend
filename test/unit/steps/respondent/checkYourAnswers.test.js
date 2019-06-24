const modulePath = 'steps/respondent/check-your-answers/CheckYourAnswers.step';
const CheckYourAnswers = require(modulePath);
const doneStep = require('steps/respondent/done/Done.step');
const idam = require('services/idam');
const caseOrchestration = require('services/caseOrchestration');
const config = require('config');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(caseOrchestration, 'sendAosResponse')
      .resolves();
  });

  afterEach(() => {
    idam.protect.restore();
    caseOrchestration.sendAosResponse.restore();
  });

  it('has idam.protect and user data middleware', () => {
    CheckYourAnswers.journey = { collectSteps: {} };
    return middleware.hasMiddleware(CheckYourAnswers, [idam.protect()]);
  });

  it('redirects to next page if statement of true answered', () => {
    const fields = { respStatementOfTruth: 'Yes' };
    return question.redirectWithField(CheckYourAnswers, fields, doneStep);
  });

  describe('with solicitor', () => {
    let sandbox = {};
    before(() => {
      sandbox = sinon.sandbox.create();
    });

    after(() => {
      sandbox.restore();
    });

    it('redirects to next page if solicitor representing and acknowledges answers', () => {
      const fields = { respSolicitorRepStatement: 'Yes' };
      sandbox.stub(config, 'features').value({
        respSolicitorDetails: true
      });
      const session = {
        SolicitorRepresentation: { respondentSolicitorRepresented: 'yes', response: 'yes' }
      };
      return question.redirectWithField(CheckYourAnswers, fields, doneStep, session);
    });
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(CheckYourAnswers);
  });

  it('shows error if does not answer solicitor acknowledge answers', () => {
    return question.testErrors(CheckYourAnswers, { SolicitorRepresentation: { response: 'yes' } });
  });

  it('renders the content', () => {
    return content(CheckYourAnswers, {}, {
      ignoreContent: [
        'continue',
        'serviceName'
      ]
    });
  });
});
