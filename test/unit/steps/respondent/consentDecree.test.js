const modulePath = 'steps/respondent/consent-decree/ConsentDecree.step';
const ConsentDecree = require(modulePath);
const contentFile = require('steps/respondent/consent-decree/ConsentDecree.content');
const FinancialSituation = require('steps/respondent/financial-situation/FinancialSituation.step');
const ConfirmDefence = require('steps/respondent/confirm-defence/ConfirmDefence.step');
const NoConsentAreYouSure = require(
  'steps/respondent/no-consent-are-you-sure/NoConsentAreYouSure.step'
);
const idam = require('services/idam');
const {
  middleware,
  question,
  sinon,
  content,
  expect
} = require('@hmcts/one-per-page-test-suite');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

const answers = {
  yes: 'Yes',
  no: 'No'
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('amend-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 95,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ConsentDecree, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      ConsentDecree,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'amend-fee');
    });
  });

  it('redirects to financial page when user consents', () => {
    const fields = {
      'response.consentDecree': 'Yes',
      'response.willDefend': 'No'
    };
    return question.redirectWithField(ConsentDecree, fields, FinancialSituation);
  });

  it('redirects to check consent answer page when user does not consent but will not defend', () => { // eslint-disable-line
    const fields = {
      'response.consentDecree': 'No',
      'response.willDefend': 'No'
    };
    return question.redirectWithField(ConsentDecree, fields, NoConsentAreYouSure);
  });

  it('redirects to confirm defence page when user does not consent and will defend', () => {
    const fields = {
      'response.consentDecree': 'No',
      'response.willDefend': 'Yes'
    };
    return question.redirectWithField(ConsentDecree, fields, ConfirmDefence);
  });

  it('shows consent required error if consent not answered', () => {
    const fields = { 'response.consentDecree': '' };
    const onlyErrors = ['consentRequired'];
    return question.testErrors(ConsentDecree, {}, fields, { onlyErrors });
  });

  it('shows defence required error if not consenting', () => {
    const fields = { 'response.consentDecree': 'No' };
    const onlyErrors = ['defenceRequired'];
    return question.testErrors(ConsentDecree, {}, fields, { onlyErrors });
  });

  it('renders the content', () => {
    const ignoreContent = [
      'expandingPanel',
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
      'change',
      'husband',
      'wife'
    ];

    return content(ConsentDecree, {}, { ignoreContent });
  });

  it('sets value for consent based on form fields', () => {
    const req = {
      session: {
        ConsentDecree: {
          response: {
            consentDecree: answers.yes
          }
        }
      }
    };
    const step = new ConsentDecree(req, {});

    step.retrieve()
      .validate();

    const values = step.values();

    expect(values)
      .to
      .be
      .an('object');
    expect(values)
      .to
      .have
      .property('respAdmitOrConsentToFact', answers.yes);
    expect(values)
      .to
      .have
      .property('respWillDefendDivorce', answers.no);
  });

  it('sets value for consent and defence based on form fields', () => {
    const req = {
      session: {
        ConsentDecree: {
          response: {
            consentDecree: answers.no,
            willDefend: answers.yes
          }
        }
      }
    };
    const step = new ConsentDecree(req, {});

    step.retrieve()
      .validate();

    const values = step.values();
    expect(values)
      .to
      .be
      .an('object');
    expect(values)
      .to
      .have
      .property('respAdmitOrConsentToFact', answers.no);
    expect(values)
      .to
      .have
      .property('respWillDefendDivorce', answers.yes);
  });

  it('applies the correct answer object given consent', () => {
    const req = {
      session: {
        ConsentDecree: {
          response: {
            consentDecree: answers.yes
          }
        }
      }
    };
    const step = new ConsentDecree(req, {});
    step.retrieve()
      .validate();
    const answersArr = step.answers();

    expect(answersArr)
      .to
      .be
      .an('array');

    expect(answersArr[0].question)
      .to
      .equal(contentFile.en.fields.consentDecree.header);

    expect(answersArr[0].answer)
      .to
      .equal(contentFile.en.fields.consentDecree.labelYes);
  });

  it('applies the correct answer object given no consent and not defending', () => {
    const req = {
      session: {
        ConsentDecree: {
          response: {
            consentDecree: answers.no,
            willDefend: answers.no
          }
        }
      }
    };
    const step = new ConsentDecree(req, {});
    step.retrieve()
      .validate();
    const answersArr = step.answers();

    expect(answersArr)
      .to
      .be
      .an('array');

    expect(answersArr[0].question)
      .to
      .equal(contentFile.en.fields.consentDecree.header);

    expect(answersArr[0].answer)
      .to
      .equal(contentFile.en.fields.consentDecree.labelNo);

    expect(answersArr[1].question)
      .to
      .equal(contentFile.en.fields.willDefend.header);
    expect(answersArr[1].answer)
      .to
      .equal(contentFile.en.fields.willDefend.answerNo);
  });
});
