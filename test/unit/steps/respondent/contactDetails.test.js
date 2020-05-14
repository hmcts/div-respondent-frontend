const modulePath = 'steps/respondent/contact-details/ContactDetails.step';
const ContactDetails = require(modulePath);
const CheckYourAnswers = require('steps/respondent/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const ContactDetailsContent = require('steps/respondent/contact-details/ContactDetails.content');

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
      session: { ContactDetails: fields }
    };

    const res = {};
    const step = new ContactDetails(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respPhoneNumber', telephone);
    expect(_values).to.have.property('respConsentToEmail', consent);
  });

  it('when phone number is not supplied returns correct answers', () => {
    const expectedContent = [
      ContactDetailsContent.en.contactMethods.email.heading,
      ContactDetailsContent.en.fields.email.label
    ];

    const stepData = {
      contactDetails: {
        consent: ContactDetailsContent.en.fields.email.label
      }
    };

    return question.answers(ContactDetails, stepData, expectedContent, {});
  });

  it('when phone number is empty returns correct answers', () => {
    const telephone = ' ';

    const expectedContent = [
      ContactDetailsContent.en.contactMethods.email.heading,
      ContactDetailsContent.en.fields.email.label
    ];

    const stepData = {
      contactDetails: {
        telephone,
        consent: ContactDetailsContent.en.fields.email.label
      }
    };

    return question.answers(ContactDetails, stepData, expectedContent, {});
  });

  it('when all details are supplied returns correct answers', () => {
    const telephone = 'Phone Number';

    const expectedContent = [
      ContactDetailsContent.en.contactMethods.telephone.heading,
      telephone,
      ContactDetailsContent.en.contactMethods.email.heading,
      ContactDetailsContent.en.fields.email.label
    ];

    const stepData = {
      contactDetails: {
        telephone,
        consent: ContactDetailsContent.en.fields.email.label
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
    const fields = { 'contactDetails.telephone': '08647177782' };

    const onlyErrors = ['requireConsent'];

    return question.testErrors(ContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when consent is not yes', () => {
    const fields = {
      'contactDetails.telephone': '08647177782',
      'contactDetails.consent': 'No'
    };

    const onlyErrors = ['requireConsent'];

    return question.testErrors(ContactDetails, {}, fields, { onlyErrors });
  });

  it('shows error when invalid phone number supplied', () => {
    const fields = {
      'contactDetails.telephone': '0',
      'contactDetails.consent': 'Yes'
    };

    const onlyErrors = ['requireValidTelephoneNo'];

    return question.testErrors(ContactDetails, {}, fields, { onlyErrors });
  });

  it('redirects to next page when phone number is not details are supplied', () => {
    const fields = {
      'contactDetails.consent': 'Yes'
    };

    return question.redirectWithField(ContactDetails, fields, CheckYourAnswers);
  });

  it('redirects to next page when all details are supplied', () => {
    const fields = {
      'contactDetails.telephone': '08647177782',
      'contactDetails.consent': 'Yes'
    };

    return question.redirectWithField(ContactDetails, fields, CheckYourAnswers);
  });

  it('renders the content', () => {
    const ignoreContent = [
      'info',
      'contactMethods',
      'question',
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
      'languageToggle'
    ];

    return content(ContactDetails, {}, { ignoreContent });
  });
});
