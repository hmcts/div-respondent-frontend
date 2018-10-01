const modulePath = 'steps/legal-proceedings/LegalProceedings.step';
const LegalProceedings = require(modulePath);
const AgreeToPayCosts = require('steps/agree-to-pay-costs/AgreeToPayCosts.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(LegalProceedings, [idam.protect()]);
  });

  it('legal proceedings is yes value should contain details', () => {
    const legalProceedingsExists = 'yes';
    const respLegalProceedingsDescription = 'Legal Proceedings';

    const fields = {
      legalProceedings: {
        exists: legalProceedingsExists,
        details: respLegalProceedingsDescription
      }
    };

    const req = {
      journey: {},
      session: { LegalProceedings: fields }
    };

    const res = {};
    const step = new LegalProceedings(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respLegalProceedingsExist', legalProceedingsExists);
    expect(_values).to.have.property('respLegalProceedingsDescription',
      respLegalProceedingsDescription);
  });

  it('legal proceedings is yes value should contain details', () => {
    const legalProceedingsExists = 'no';
    const respLegalProceedingsDescription = 'Legal Proceedings';

    const fields = {
      legalProceedings: {
        exists: legalProceedingsExists,
        details: respLegalProceedingsDescription
      }
    };

    const req = {
      journey: {},
      session: { LegalProceedings: fields }
    };

    const res = {};
    const step = new LegalProceedings(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respLegalProceedingsExist', legalProceedingsExists);
    expect(_values).to.not.have.property('respLegalProceedingsDescription');
  });

  it('shows error when legal proceedings is yes and case details not supplied', () => {
    const fields = { 'legalProceedings-exists': 'yes' };

    const onlyErrors = ['requireCaseDetails'];

    return question.testErrors(LegalProceedings, {}, fields, { onlyErrors });
  });

  it('redirects to next page on legal proceedings is yes and case details supplied', () => {
    const fields = {
      'legalProceedings-exists': 'yes',
      'legalProceedings-details': 'Legal Proceedings'
    };

    return question.redirectWithField(LegalProceedings, fields, AgreeToPayCosts);
  });

  it('redirects to next page on legal proceedings is no', () => {
    const fields = { 'legalProceedings-exists': 'no' };
    return question.redirectWithField(LegalProceedings, fields, AgreeToPayCosts);
  });

  it('shows error if question is not answered', () => {
    const onlyErrors = ['required'];
    return question.testErrors(LegalProceedings, {}, {}, { onlyErrors });
  });

  it('renders the content', () => {
    return content(LegalProceedings, {}, { ignoreContent: ['info', 'cya'] });
  });
});
