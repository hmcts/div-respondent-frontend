const modulePath = 'steps/capture-case-and-pin/CaptureCaseAndPin.step';
const stepContent = require('steps/capture-case-and-pin/CaptureCaseAndPin.content');
const CaptureCaseAndPin = require(modulePath);
const caseOrchestration = require('services/caseOrchestration');
const Respond = require('steps/respondent/respond/Respond.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

const validReferenceNumber = '1234567891234560';
const dashingReferenceNumber = '1234-5678-9123-4560';
const validSecurityAccessCode = '1A3b5678';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(caseOrchestration, 'linkCase')
      .resolves({});
  });

  afterEach(() => {
    idam.protect.restore();
    caseOrchestration.linkCase.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(CaptureCaseAndPin, [idam.protect()]);
  });

  it('redirects to next page', () => {
    const answers = {
      referenceNumber: validReferenceNumber,
      securityAccessCode: validSecurityAccessCode
    };
    return question.redirectWithField(CaptureCaseAndPin, answers, Respond);
  });

  it('redirects to next page with dashes in reference number', () => {
    const answers = {
      referenceNumber: dashingReferenceNumber,
      securityAccessCode: validSecurityAccessCode
    };
    return question.redirectWithField(CaptureCaseAndPin, answers, Respond);
  });

  it('redirects to next page when contains a non-digit character', () => {
    const answers = {
      referenceNumber: '1234567812345678A',
      securityAccessCode: validSecurityAccessCode
    };
    return question.redirectWithField(CaptureCaseAndPin, answers, Respond);
  });

  describe('validate reference number shows error if', () => {
    it('is not provided', () => {
      const answers = {
        securityAccessCode: validSecurityAccessCode
      };
      const onlyErrors = ['referenceNumberRequired'];
      return question.testErrors(CaptureCaseAndPin, {}, answers, { onlyErrors });
    });
    it('is less than 16 digits', () => {
      const answers = {
        referenceNumber: '1234',
        securityAccessCode: validSecurityAccessCode
      };
      const onlyErrors = ['referenceNumberRequired'];
      return question.testErrors(CaptureCaseAndPin, {}, answers, { onlyErrors });
    });

    it('is more than 16 digits', () => {
      const answers = {
        referenceNumber: `${validReferenceNumber}1`,
        securityAccessCode: validSecurityAccessCode
      };
      const onlyErrors = ['referenceNumberRequired'];
      return question.testErrors(CaptureCaseAndPin, {}, answers, { onlyErrors });
    });
  });

  describe('validate security access code shows error if', () => {
    it('is not provided', () => {
      const answers = {
        referenceNumber: validReferenceNumber
      };
      const onlyErrors = ['securityAccessCodeRequired'];
      return question.testErrors(CaptureCaseAndPin, {}, answers, { onlyErrors });
    });

    it('it is 7 digits long', () => {
      const answers = {
        referenceNumber: validReferenceNumber,
        securityAccessCode: '1234567'
      };
      const onlyErrors = ['securityAccessCodeRequired'];
      return question.testErrors(CaptureCaseAndPin, {}, answers, { onlyErrors });
    });
    it('it is 9 digits long', () => {
      const answers = {
        referenceNumber: validReferenceNumber,
        securityAccessCode: '123456789'
      };
      const onlyErrors = ['securityAccessCodeRequired'];
      return question.testErrors(CaptureCaseAndPin, {}, answers, { onlyErrors });
    });
    it('it contains special chars', () => {
      const answers = {
        referenceNumber: validReferenceNumber,
        securityAccessCode: '1234567#'
      };
      const onlyErrors = ['securityAccessCodeAlphanumericOnly'];
      return question.testErrors(CaptureCaseAndPin, {}, answers, { onlyErrors });
    });
  });

  it('renders auth error from link case API call', () => {
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours'
    ];

    return content(CaptureCaseAndPin, {
      temp: {
        linkCaseError: true,
        linkCaseAuthError: true
      }
    }, {
      specificValues: [stepContent.en.referenceNumberOrPinDoNotMatch],
      ignoreContent
    });
  });

  it('renders generic error if link case API call fails', () => {
    return content(CaptureCaseAndPin, { temp: { linkCaseError: true } }, {
      specificValues: [stepContent.en.errorLinkingCase]
    });
  });

  it('renders the content', () => {
    return content(CaptureCaseAndPin, {}, {
      ignoreContent: [
        'continue',
        'backLink',
        'thereWasAProblem',
        'referenceNumberOrPinDoNotMatch',
        'errorLinkingCase',
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
      ]
    });
  });
});
