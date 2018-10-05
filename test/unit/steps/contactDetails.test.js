const modulePath = 'steps/contact-details/ContactDetails.step';
const ContactDetails = require(modulePath);
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const ContactDetailsContent = require('steps/contact-details/ContactDetails.content');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ContactDetails, [idam.protect()]);
  });

  it('when phone number is not supplied return correct value', () => {
    const phoneNo = ' ';
    const consent = 'yes';

    const fields = {
      contactDetails: {
        phoneNo,
        consent
      }
    };

    const req = {
      journey: {},
      session: { ContactDetails: fields }
    };

    const res = {};
    const step = new ContactDetails(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).not.to.have.property('respPhoneNumber');
    expect(_values).to.have.property('respConsentToEmail', consent);
  });

  it('when all details are supplied return correct value', () => {
    const phoneNo = 'Phone Number';
    const consent = 'yes';

    const fields = {
      contactDetails: {
        phoneNo,
        consent
      }
    };

    const req = {
      journey: {},
      session: { ContactDetails: fields }
    };

    const res = {};
    const step = new ContactDetails(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respPhoneNumber', phoneNo);
    expect(_values).to.have.property('respConsentToEmail', consent);
  });

  it('when phone number is not supplied returns correct answers', () => {
    const expectedContent = [
      ContactDetailsContent.en.cya.emailConsent,
      ContactDetailsContent.en.fields.consent.answer
    ];

    const stepData = {
      contactDetails: {
        consent: ContactDetailsContent.en.fields.consent.answer
      }
    };

    return question.answers(ContactDetails, stepData, expectedContent, {});
  });

  it('when phone number is empty returns correct answers', () => {
    const phoneNo = ' ';

    const expectedContent = [
      ContactDetailsContent.en.cya.emailConsent,
      ContactDetailsContent.en.fields.consent.answer
    ];

    const stepData = {
      contactDetails: {
        phoneNo,
        consent: ContactDetailsContent.en.fields.consent.answer
      }
    };

    return question.answers(ContactDetails, stepData, expectedContent, {});
  });

  it('when all details are supplied returns correct answers', () => {
    const phoneNo = 'Phone Number';

    const expectedContent = [
      ContactDetailsContent.en.cya.phoneNumber,
      phoneNo,
      ContactDetailsContent.en.cya.emailConsent,
      ContactDetailsContent.en.fields.consent.answer
    ];

    const stepData = {
      contactDetails: {
        phoneNo,
        consent: ContactDetailsContent.en.fields.consent.answer
      }
    };

    return question.answers(ContactDetails, stepData, expectedContent, {});
  });


  it('shows errors when both consent and no phone number are not supplied', () => {
    const fields = {};

    const onlyErrors = ['requireConsent'];

    return question.testErrors(ContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when no consent supplied', () => {
    const fields = { 'contactDetails-phoneNo': '08647177782' };

    const onlyErrors = ['requireConsent'];

    return question.testErrors(ContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when consent is not yes', () => {
    const fields = {
      'contactDetails-phoneNo': '08647177782',
      'contactDetails-consent': 'no'
    };

    const onlyErrors = ['requireConsent'];

    return question.testErrors(ContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when invalid phone number supplied', () => {
    const fields = {
      'contactDetails-phoneNo': '0',
      'contactDetails-consent': 'yes'
    };

    const onlyErrors = ['requireValidPhoneNo'];

    return question.testErrors(ContactDetails, {}, fields, { onlyErrors });
  });

  it('redirects to next page when phone number is not details are supplied', () => {
    const fields = {
      'contactDetails-consent': 'yes'
    };

    return question.redirectWithField(ContactDetails, fields, CheckYourAnswers);
  });

  it('redirects to next page when all details are supplied', () => {
    const fields = {
      'contactDetails-phoneNo': '08647177782',
      'contactDetails-consent': 'yes'
    };

    return question.redirectWithField(ContactDetails, fields, CheckYourAnswers);
  });

  it('renders the content', () => {
    return content(ContactDetails, {}, { ignoreContent: ['info', 'cya', 'question'] });
  });
});
