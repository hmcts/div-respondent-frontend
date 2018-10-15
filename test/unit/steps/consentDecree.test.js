const modulePath = 'steps/consent-decree/ConsentDecree.step';
const ConsentDecree = require(modulePath);
const contentFile = require('steps/consent-decree/ConsentDecree.content');
const FinancialSituation = require('steps/financial-situation/FinancialSituation.step');
const ConfirmDefence = require('steps/confirm-defence/ConfirmDefence.step');
const NoConsentAreYouSure = require('steps/no-consent-are-you-sure/NoConsentAreYouSure.step');
const idam = require('services/idam');
const {
  middleware,
  question,
  sinon,
  content,
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

  it('redirects to check consent answer page when user does not consent but will not defend', () => { // eslint-disable-line
    const fields = {
      'response-consentDecree': 'no',
      'response-willDefend': 'no'
    };
    return question.redirectWithField(ConsentDecree, fields, NoConsentAreYouSure);
  });

  it('redirects to confirm defence page when user does not consent and will defend', () => {
    const fields = {
      'response-consentDecree': 'no',
      'response-willDefend': 'yes'
    };
    return question.redirectWithField(ConsentDecree, fields, ConfirmDefence);
  });

  it('shows consent required error if consent not answered', () => {
    const fields = { 'response-consentDecree': '' };
    const onlyErrors = ['consentRequired'];
    return question.testErrors(ConsentDecree, {}, fields, { onlyErrors });
  });

  it('shows defence required error if not consenting', () => {
    const fields = { 'response-consentDecree': 'no' };
    const onlyErrors = ['defenceRequired'];
    return question.testErrors(ConsentDecree, {}, fields, { onlyErrors });
  });

  it('renders the content', () => {
    return content(ConsentDecree, {}, { ignoreContent: [ 'expandingPanel' ] });
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
      .property('respDefendsDivorce', answers.no);
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
      .property('respDefendsDivorce', answers.yes);
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
      .equal(contentFile.en.fields.willDefend.labelNo);
  });
});
