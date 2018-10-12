const modulePath = 'steps/financial-situation/FinancialSituation.step';
const FinancialSituation = require(modulePath);
const financialSituContent = require('steps/financial-situation/FinancialSituation.content');
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const idam = require('services/idam');
const {
  middleware,
  question,
  sinon,
  content,
  itParam,
  stepAsInstance,
  expect
} = require('@hmcts/one-per-page-test-suite');

const answers = ['yes', 'no'];

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

  itParam('redirects to jurisdiction page when answer is ${value}', answers, answer => {
    const fields = { respConsiderFinancialSituation: answer };
    return question.redirectWithField(FinancialSituation, fields, Jurisdiction);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(FinancialSituation);
  });

  it('renders the content', () => {
    return content(FinancialSituation);
  });

  itParam('sets respConsiderFinancialSituation to answer', answers, answer => {
    // given
    const step = stepAsInstance(FinancialSituation, {
      FinancialSituation: {
        respConsiderFinancialSituation: answer
      }
    });

    // when
    step.retrieve().validate();

    // then
    const values = step.values();
    expect(values).to.be.an('object');
    expect(values).to.have.property('respConsiderFinancialSituation', answer);
  });

  it('applies the correct question and answer object', () => {
    const req = {
      journey: {},
      session: {
        FinancialSituation: {
          respConsiderFinancialSituation: 'yes'
        }
      }
    };
    const step = new FinancialSituation(req, {});
    step.retrieve().validate();
    const answerObj = step.answers();
    const expectedAnswer = 'Yes';
    expect(answerObj.answer).to.equal(expectedAnswer);
    expect(answerObj.question).to.equal(financialSituContent.en.title);
  });
});
