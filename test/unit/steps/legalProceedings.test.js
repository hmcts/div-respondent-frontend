const modulePath = 'steps/legal-proceedings/LegalProceedings.step';
const LegalProceedings = require(modulePath);
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const LegalProceedingsContent = require('steps/legal-proceedings/LegalProceedings.content');

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

    return question.redirectWithField(LegalProceedings, fields, CheckYourAnswers);
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

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      LegalProceedingsContent.en.cya.question,
      LegalProceedingsContent.en.fields.no.answer
    ];

    const stepData = {
      legalProceedings: {
        exists: 'no'
      }
    };

    return question.answers(LegalProceedings, stepData, expectedContent, {});
  });

  it('returns correct answers if answered yes', () => {
    const details = 'Details';

    const expectedContent = [
      LegalProceedingsContent.en.cya.question,
      LegalProceedingsContent.en.fields.yes.answer,
      LegalProceedingsContent.en.cya.details,
      details
    ];

    const stepData = {
      legalProceedings: {
        exists: 'yes',
        details
      }
    };

    return question.answers(LegalProceedings, stepData, expectedContent, {});
  });

  it('redirects to next page on legal proceedings is no', () => {
    const fields = { 'legalProceedings-exists': 'no' };
    return question.redirectWithField(LegalProceedings, fields, CheckYourAnswers);
  });

  it('shows error if question is not answered', () => {
    const onlyErrors = ['required'];
    return question.testErrors(LegalProceedings, {}, {}, { onlyErrors });
  });

  it('renders the content', () => {
    return content(LegalProceedings, {}, { ignoreContent: ['info', 'cya'] });
  });
});
