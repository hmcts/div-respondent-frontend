const modulePath = 'steps/co-respondent/cr-contact-details/CrContactDetails.step';
const CrContactDetails = require(modulePath);
const CheckYourAnswers = require('steps/respondent/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const CrContactDetailsContent = require(
  'steps/co-respondent/cr-contact-details/CrContactDetails.content'
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
    return middleware.hasMiddleware(CrContactDetails, [idam.protect()]);
  });

  it('when phone number is not supplied return correct value', () => {
    const telephone = ' ';
    const consent = 'Yes';

    const fields = {
      contactDetails: {
        telephone,
        consent
      }
    };

    const req = {
      journey: {},
      session: { CrContactDetails: fields }
    };

    const res = {};
    const step = new CrContactDetails(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).not.to.have.property('coRespPhoneNumber');
    expect(_values).to.have.property('coRespConsentToEmail', consent);
  });

  it('when all details are supplied return correct value', () => {
    const telephone = 'Phone Number';
    const consent = 'Yes';

    const fields = {
      contactDetails: {
        telephone,
        consent
      }
    };

    const req = {
      journey: {},
      session: { CrContactDetails: fields }
    };

    const res = {};
    const step = new CrContactDetails(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('coRespPhoneNumber', telephone);
    expect(_values).to.have.property('coRespConsentToEmail', consent);
  });

  it('when phone number is not supplied returns correct answers', () => {
    const expectedContent = [
      CrContactDetailsContent.en.contactMethods.email.heading,
      CrContactDetailsContent.en.fields.email.label
    ];

    const stepData = {
      contactDetails: {
        consent: CrContactDetailsContent.en.fields.email.label
      }
    };

    return question.answers(CrContactDetails, stepData, expectedContent, {});
  });

  it('when phone number is empty returns correct answers', () => {
    const telephone = ' ';

    const expectedContent = [
      CrContactDetailsContent.en.contactMethods.email.heading,
      CrContactDetailsContent.en.fields.email.label
    ];

    const stepData = {
      contactDetails: {
        telephone,
        consent: CrContactDetailsContent.en.fields.email.label
      }
    };

    return question.answers(CrContactDetails, stepData, expectedContent, {});
  });

  it('when all details are supplied returns correct answers', () => {
    const telephone = 'Phone Number';

    const expectedContent = [
      CrContactDetailsContent.en.contactMethods.telephone.heading,
      telephone,
      CrContactDetailsContent.en.contactMethods.email.heading,
      CrContactDetailsContent.en.fields.email.label
    ];

    const stepData = {
      contactDetails: {
        telephone,
        consent: CrContactDetailsContent.en.fields.email.label
      }
    };

    return question.answers(CrContactDetails, stepData, expectedContent, {});
  });


  it('shows errors when both consent and no phone number are not supplied', () => {
    const fields = {};

    const onlyErrors = ['requireConsent'];

    return question.testErrors(CrContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when no consent supplied', () => {
    const fields = { 'contactDetails.telephone': '08647177782' };

    const onlyErrors = ['requireConsent'];

    return question.testErrors(CrContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when consent is not yes', () => {
    const fields = {
      'contactDetails.telephone': '08647177782',
      'contactDetails.consent': 'No'
    };

    const onlyErrors = ['requireConsent'];

    return question.testErrors(CrContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when invalid phone number supplied', () => {
    const fields = {
      'contactDetails.telephone': '0',
      'contactDetails.consent': 'Yes'
    };

    const onlyErrors = ['requireValidTelephoneNo'];

    return question.testErrors(CrContactDetails, {}, fields, { onlyErrors });
  });

  it('redirects to next page when phone number is not details are supplied', () => {
    const fields = {
      'contactDetails.consent': 'Yes'
    };

    return question.redirectWithField(CrContactDetails, fields, CheckYourAnswers);
  });

  it('redirects to next page when all details are supplied', () => {
    const fields = {
      'contactDetails.telephone': '08647177782',
      'contactDetails.consent': 'Yes'
    };

    return question.redirectWithField(CrContactDetails, fields, CheckYourAnswers);
  });

  it('renders the content', () => {
    return content(CrContactDetails, {}, { ignoreContent: ['info', 'contactMethods', 'question'] });
  });
});
