const modulePath = 'steps/correspondent/cr-check-your-answers/CrCheckYourAnswers.step';

const CrCheckYourAnswers = require(modulePath);
const Done = require('steps/correspondent/cr-done/CrDone.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestration');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(CrCheckYourAnswers, [ idam.protect() ]);
  });

  it('renders the content', () => {
    const ignoreContent = [ 'continue' ];
    const session = { case: { caseData: {} } };
    return content(CrCheckYourAnswers, session, { ignoreContent });
  });

  describe('errors', () => {
    beforeEach(() => {
      sinon.stub(caseOrchestrationService, 'sendAosResponse');
    });

    afterEach(() => {
      caseOrchestrationService.sendAosResponse.restore();
    });

    it('shows error if does not answer question', () => {
      const session = { case: { caseData: {} } };
      const onlyErrors = ['required'];
      return question.testErrors(CrCheckYourAnswers, session, {}, { onlyErrors });
    });
  });

  describe('navigates', () => {
    beforeEach(() => {
      sinon.stub(caseOrchestrationService, 'sendAosResponse');
    });

    afterEach(() => {
      caseOrchestrationService.sendAosResponse.restore();
    });

    it('to Done if statement of true answered', () => {
      caseOrchestrationService.sendAosResponse.resolves();
      const fields = { coRespStatementOfTruth: 'Yes' };
      return question.redirectWithField(CrCheckYourAnswers, fields, Done);
    });
  });
});
