const modulePath = 'steps/financial-situation/FinancialSituation.step';
const FinancialSituation = require(modulePath);
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, itParam } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(FinancialSituation, [idam.protect()]);
  });

  itParam('redirects to jurisdiction page when answer is ${value}', ['yes', 'no'], answer => {
    const fields = { respConsiderFinancialSituation: answer };
    return question.redirectWithField(FinancialSituation, fields, Jurisdiction);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(FinancialSituation);
  });

  it('renders the content', () => {
    return content(FinancialSituation);
  });
});
