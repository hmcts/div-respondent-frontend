const modulePath = 'steps/defend-financial-hardship/DefendFinancialHardship.step';
const DefendFinancialHardship = require(modulePath);
const ConfirmDefence = require('steps/confirm-defence/ConfirmDefence.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const DefendFinancialHardshipContent = require('steps/defend-financial-hardship/DefendFinancialHardship.content'); // eslint-disable-line max-len

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(DefendFinancialHardship, [idam.protect()]);
  });

  it('severe hardship is yes value should contain details', () => {
    const respHardshipDefenseResponse = 'yes';
    const respHardshipDescription = 'Financial hardship';

    const fields = {
      financialHardship: {
        exists: respHardshipDefenseResponse,
        details: respHardshipDescription
      }
    };

    const req = {
      journey: {},
      session: { DefendFinancialHardship: fields }
    };

    const res = {};
    const step = new DefendFinancialHardship(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respHardshipDefenseResponse', respHardshipDefenseResponse);
    expect(_values).to.have.property('respHardshipDescription',
      respHardshipDescription);
  });

  it('severe hardship is no value should not contain details', () => {
    const respHardshipDefenseResponse = 'no';
    const respHardshipDescription = 'Legal Proceedings';

    const fields = {
      financialHardship: {
        exists: respHardshipDefenseResponse,
        details: respHardshipDescription
      }
    };

    const req = {
      journey: {},
      session: { DefendFinancialHardship: fields }
    };

    const res = {};
    const step = new DefendFinancialHardship(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respHardshipDefenseResponse', respHardshipDefenseResponse);
    expect(_values).to.not.have.property('respHardshipDescription');
  });

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      DefendFinancialHardshipContent.en.cya.question,
      DefendFinancialHardshipContent.en.fields.no.answer
    ];

    const stepData = {
      financialHardship: {
        exists: 'no'
      }
    };

    return question.answers(DefendFinancialHardship, stepData, expectedContent, {});
  });

  it('returns correct answers if answered yes', () => {
    const details = 'Details';

    const expectedContent = [
      DefendFinancialHardshipContent.en.cya.question,
      DefendFinancialHardshipContent.en.fields.yes.answer,
      DefendFinancialHardshipContent.en.cya.details,
      details
    ];

    const stepData = {
      financialHardship: {
        exists: 'yes',
        details
      }
    };

    return question.answers(DefendFinancialHardship, stepData, expectedContent, {});
  });

  it('shows error if question is not answered', () => {
    const onlyErrors = ['required'];
    return question.testErrors(DefendFinancialHardship, {}, {}, { onlyErrors });
  });


  it('renders the content', () => {
    return content(DefendFinancialHardship, {}, { ignoreContent: ['info', 'cya'] });
  });

  it('redirects to ConfirmDefence step when answered no', () => {
    const fields = {
      'financialHardship-exists': 'no'
    };
    const sessionData = {
      originalPetition: {}
    };
    return question.redirectWithField(DefendFinancialHardship, fields, ConfirmDefence, sessionData);
  });

  it('redirects to ConfirmDefence step when answered yes', () => {
    const fields = {
      'financialHardship-exists': 'yes',
      'financialHardship-details': 'Financial hardship details'
    };
    const sessionData = {
      originalPetition: {}
    };
    return question.redirectWithField(DefendFinancialHardship, fields, ConfirmDefence, sessionData);
  });
});
