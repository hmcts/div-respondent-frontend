const modulePath = 'steps/capture-case-and-pin/CaptureCaseAndPin.step';

const CaptureCaseAndPin = require(modulePath);
const caseOrchestration = require('services/caseOrchestration');
const Respond = require('steps/respond/Respond.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const rawResponse = require('resources/raw-response-mock.json');

const validReferenceNumber = '1234567890123456';
const validSecurityAccessCode = '1234';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(request, 'get')
      .resolves(rawResponse);
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(caseOrchestration, 'linkCase')
      .resolves({});
  });

  afterEach(() => {
    idam.protect.restore();
    request.get.restore();
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
    it('contains a non-digit character', () => {
      const answers = {
        referenceNumber: '123456789012345A',
        securityAccessCode: validSecurityAccessCode
      };
      const onlyErrors = ['referenceNumberDigitsOnly'];
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
  });

  it('renders auth error from link case API call', () => {
    return content(CaptureCaseAndPin, { authError: false }, {
      specificContent: [
        'thereWasAProblem',
        'referenceNumberOrPinDoNotMatch'
      ]
    });
  });

  it('renders the content', () => {
    return content(CaptureCaseAndPin, {}, {
      ignoreContent: [
        'continue',
        'backLink',
        'thereWasAProblem',
        'referenceNumberOrPinDoNotMatch'
      ]
    });
  });
});
