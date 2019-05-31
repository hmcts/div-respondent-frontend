const modulePath = 'steps/respondent/solicitor-details/SolicitorDetails.step';
const SolicitorDetails = require(modulePath);
const CheckYourAnswers = require('steps/respondent/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const SolicitorDetailsContent = require(
  'steps/respondent/solicitor-details/SolicitorDetails.content'
);

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(SolicitorDetails, [idam.protect()]);
  });

  it('renders the content', () => {
    return content(SolicitorDetails);
  });

  it('redirects to next page when all details are supplied', () => {
    const fields = {
      'solicitorDetails.solicitorName': 'John Johnes',
      'solicitorDetails.firmName': 'Test Firm Name',
      'solicitorDetails.solicitorEmail': 'solicitor@frim.com',
      'solicitorDetails.telephone': '2222222222',
      'solicitorDetails.solicitorRefNumber': '11111111111',
      'solicitorDetails.consent': 'Yes'
    };

    return question.redirectWithField(SolicitorDetails, fields, CheckYourAnswers);
  });

  it('redirects to next page when all details except Solicitor Name,are supplied', () => {
    const fields = {
      'solicitorDetails.solicitorName': '',
      'solicitorDetails.firmName': 'Test Firm Name',
      'solicitorDetails.solicitorEmail': 'solicitor@frim.com',
      'solicitorDetails.telephone': '2222222222',
      'solicitorDetails.solicitorRefNumber': '11111111111',
      'solicitorDetails.consent': 'Yes'
    };

    return question.redirectWithField(SolicitorDetails, fields, CheckYourAnswers);
  });

  it('shows error when invalid phone number supplied', () => {
    const fields = {
      'solicitorDetails.firmName': 'Test Firm Name',
      'solicitorDetails.solicitorEmail': 'solicitor@frim.com',
      'solicitorDetails.telephone': '0',
      'solicitorDetails.solicitorRefNumber': '11111111111',
      'solicitorDetails.consent': 'Yes'
    };
    const onlyErrors = ['requireValidTelephoneNo'];

    return question.testErrors(SolicitorDetails, {}, fields, { onlyErrors });
  });

  it('shows error when consent is not yes', () => {
    const fields = {
      'solicitorDetails.firmName': 'Test Firm Name',
      'solicitorDetails.solicitorEmail': 'solicitor@frim.com',
      'solicitorDetails.telephone': '2222222222',
      'solicitorDetails.solicitorRefNumber': '11111111111',
      'solicitorDetails.consent': 'No'
    };
    const onlyErrors = ['requireConsent'];

    return question.testErrors(SolicitorDetails, {}, fields, { onlyErrors });
  });

  it('shows error when email is not filled', () => {
    const fields = {
      'solicitorDetails.firmName': 'Test Firm Name',
      'solicitorDetails.solicitorEmail': '',
      'solicitorDetails.telephone': '2222222222',
      'solicitorDetails.solicitorRefNumber': '11111111111',
      'solicitorDetails.consent': 'Yes'
    };
    const onlyErrors = ['requiredField'];

    return question.testErrors(SolicitorDetails, {}, fields, { onlyErrors });
  });

  it('shows error when solicitor reference is not filled', () => {
    const fields = {
      'solicitorDetails.firmName': 'Test Firm Name',
      'solicitorDetails.solicitorEmail': 'solicitor@frim.com',
      'solicitorDetails.telephone': '2222222222',
      'solicitorDetails.solicitorRefNumber': '',
      'solicitorDetails.consent': 'Yes'
    };
    const onlyErrors = ['requiredField'];

    return question.testErrors(SolicitorDetails, {}, fields, { onlyErrors });
  });

  it('when all details are supplied return correct value', () => {
    const solicitorName = 'Test name';
    const firmName = 'Solicitor Firm Test Name';
    const solicitorEmail = 'solicitor@firm.com';
    const telephone = '07777777777';
    const solicitorRefNumber = '111111111';

    const fields = {
      solicitorDetails: {
        solicitorName,
        firmName,
        solicitorEmail,
        telephone,
        solicitorRefNumber
      }
    };
    const req = {
      journey: {},
      session: { SolicitorDetails: fields }
    };

    const res = {};
    const step = new SolicitorDetails(req, res);
    step.retrieve().validate();
    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respondentSolicitorName', solicitorName);
    expect(_values).to.have.property('respondentSolicitorCompany', firmName);
    expect(_values).to.have.property('respondentSolicitorEmail', solicitorEmail);
    expect(_values).to.have.property('respondentSolicitorPhoneNumber', telephone);
    expect(_values).to.have.property('respondentSolicitorReference', solicitorRefNumber);
  });

  it('when when the name is not supplied return correct value', () => {
    const solicitorName = '';
    const firmName = 'Solicitor Firm Test Name';
    const solicitorEmail = 'solicitor@firm.com';
    const telephone = '07777777777';
    const solicitorRefNumber = '111111111';

    const fields = {
      solicitorDetails: {
        solicitorName,
        firmName,
        solicitorEmail,
        telephone,
        solicitorRefNumber
      }
    };
    const req = {
      journey: {},
      session: { SolicitorDetails: fields }
    };

    const res = {};
    const step = new SolicitorDetails(req, res);
    step.retrieve().validate();
    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).not.to.have.property('respondentSolicitorName');
    expect(_values).to.have.property('respondentSolicitorCompany', firmName);
    expect(_values).to.have.property('respondentSolicitorEmail', solicitorEmail);
    expect(_values).to.have.property('respondentSolicitorPhoneNumber', telephone);
    expect(_values).to.have.property('respondentSolicitorReference', solicitorRefNumber);
  });

  it('when all details are supplied returns correct answers', () => {
    const expectedContent = [
      SolicitorDetailsContent.en.fields.solicitorName.label,
      SolicitorDetailsContent.en.fields.firmName.label,
      SolicitorDetailsContent.en.fields.solicitorEmail.label,
      SolicitorDetailsContent.en.fields.telephone.label,
      SolicitorDetailsContent.en.fields.solicitorRefNumber.label
    ];

    const stepData = {
      solicitorDetails: {
        solicitorName: SolicitorDetailsContent.en.fields.solicitorName.label,
        firmName: SolicitorDetailsContent.en.fields.firmName.label,
        solicitorEmail: SolicitorDetailsContent.en.fields.solicitorEmail.label,
        telephone: SolicitorDetailsContent.en.fields.telephone.label,
        solicitorRefNumber: SolicitorDetailsContent.en.fields.solicitorRefNumber.label
      }
    };

    return question.answers(SolicitorDetails, stepData, expectedContent, {});
  });

  it('when solicitor name is not supplied returns correct answers', () => {
    const expectedContent = [
      SolicitorDetailsContent.en.fields.firmName.label,
      SolicitorDetailsContent.en.fields.solicitorEmail.label,
      SolicitorDetailsContent.en.fields.telephone.label,
      SolicitorDetailsContent.en.fields.solicitorRefNumber.label
    ];

    const stepData = {
      solicitorDetails: {
        firmName: SolicitorDetailsContent.en.fields.firmName.label,
        solicitorEmail: SolicitorDetailsContent.en.fields.solicitorEmail.label,
        telephone: SolicitorDetailsContent.en.fields.telephone.label,
        solicitorRefNumber: SolicitorDetailsContent.en.fields.solicitorRefNumber.label
      }
    };

    return question.answers(SolicitorDetails, stepData, expectedContent, {});
  });
});
