const modulePath = 'steps/consent-decree/ConsentDecree.step';
const ConsentDecree = require(modulePath);
const contentFile = require('steps/consent-decree/ConsentDecree.content');
const FinancialSituation = require('steps/financial-situation/FinancialSituation.step');
const ConfirmDefence = require('steps/confirm-defence/ConfirmDefence.step');
const idam = require('services/idam');
const {
  middleware,
  question,
  sinon,
  content,
  stepAsInstance,
  expect
} = require('@hmcts/one-per-page-test-suite');

const answers = {
  yes: 'yes',
  no: 'no'
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ConsentDecree, [idam.protect()]);
  });

  it('redirects to financial page when user consents', () => {
    const fields = {
      'response-consentDecree': 'yes',
      'response-willDefend': 'no'
    };
    return question.redirectWithField(ConsentDecree, fields, FinancialSituation);
  });

  it('redirects to financial page when user does not consent but will not defend', () => {
    const fields = {
      'response-consentDecree': 'no',
      'response-willDefend': 'no'
    };
    return question.redirectWithField(ConsentDecree, fields, FinancialSituation);
  });

  it('redirects to confirm defence page when user does not consent and will defend', () => {
    const fields = {
      'response-consentDecree': 'no',
      'response-willDefend': 'yes'
    };
    return question.redirectWithField(ConsentDecree, fields, ConfirmDefence);
  });

  it('shows error if questions are not answered', () => {
    const fields = { 'response-consentDecree': '' };
    return question.testErrors(ConsentDecree, {}, fields);
  });

  it('renders the content', () => {
    return content(ConsentDecree);
  });

  it('sets value for consent based on form fields', () => {
    const step = stepAsInstance(ConsentDecree, {
      ConsentDecree: {
        response: {
          consentDecree: answers.yes
        }
      }
    });

    step.retrieve().validate();

    const values = step.values();
    expect(values).to.be.an('object');
    expect(values).to.have.property('respAdmitOrConsentToFact', answers.yes);
    expect(values).to.have.property('respDefendsDivorce', answers.no);
  });

  it('sets value for consent and defence based on form fields', () => {
    const step = stepAsInstance(ConsentDecree, {
      ConsentDecree: {
        response: {
          consentDecree: answers.no,
          willDefend: answers.yes
        }
      }
    });

    step.retrieve().validate();

    const values = step.values();
    expect(values).to.be.an('object');
    expect(values).to.have.property('respAdmitOrConsentToFact', answers.no);
    expect(values).to.have.property('respDefendsDivorce', answers.yes);
  });

  it('applies the correct question and answer object', () => {
    const req = {
      journey: {},
      session: {
        ConsentDecree: {
          respAdmitOrConsentToFact: 'yes'
        }
      }
    };
    const step = new ConsentDecree(req, {});
    step.retrieve().validate();
    const answersArr = step.answers();

    expect(answersArr).to.be.an('array');
    expect(answersArr[0].question).to.equal(contentFile.en.fields.consentDecree.header);
    expect(answersArr[0].answer).to.equal('Yes');
    expect(answersArr[1].question).to.equal(contentFile.en.fields.willDefend.header);
    expect(answersArr[1].answer).to.equal('No');
  });
});
