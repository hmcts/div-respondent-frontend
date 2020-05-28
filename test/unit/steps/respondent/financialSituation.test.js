const modulePath = 'steps/respondent/financial-situation/FinancialSituation.step';
const FinancialSituation = require(modulePath);
const financialSituContent = require(
  'steps/respondent/financial-situation/FinancialSituation.content'
);
const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
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

const answers = ['Yes', 'No'];

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
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'signIn',
      'signOut',
      'languageToggle',
      'thereWasAProblem',
      'change'
    ];
    return content(FinancialSituation, {}, { ignoreContent });
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
          respConsiderFinancialSituation: 'Yes'
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
