const modulePath = 'steps/respondent/defend-financial-hardship/DefendFinancialHardship.step';
const DefendFinancialHardship = require(modulePath);
const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const DefendFinancialHardshipContent = require('steps/respondent/defend-financial-hardship/DefendFinancialHardship.content'); // eslint-disable-line max-len
const feesAndPaymentsService = require('services/feesAndPaymentsService');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('defended-petition-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 245.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(DefendFinancialHardship, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      DefendFinancialHardship,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('severe hardship is yes value should contain details', () => {
    const respHardshipDefenseResponse = 'Yes';
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
    const respHardshipDefenseResponse = 'No';
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
        exists: 'No'
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
        exists: 'Yes',
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
    const ignoreContent = [
      'info',
      'cya',
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
      'wife',
      'phoneToCallIfProblems'
    ];

    return content(DefendFinancialHardship, {}, { ignoreContent });
  });

  it('redirects to Jurisdiction step when answered no', () => {
    const fields = {
      'financialHardship.exists': 'No'
    };
    const sessionData = {
      originalPetition: {}
    };
    return question.redirectWithField(DefendFinancialHardship, fields, Jurisdiction, sessionData);
  });

  it('redirects to Jurisdiction step when answered yes', () => {
    const fields = {
      'financialHardship.exists': 'Yes',
      'financialHardship.details': 'Financial hardship details'
    };
    const sessionData = {
      originalPetition: {}
    };
    return question.redirectWithField(DefendFinancialHardship, fields, Jurisdiction, sessionData);
  });
});
