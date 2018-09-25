const modulePath = 'steps/respond-with-pin/RespondWithPin.step';

const RespondWithPin = require(modulePath);
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
  });

  afterEach(() => {
    idam.protect.restore();
    request.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(RespondWithPin, [idam.protect()]);
  });

  it('redirects to next page', () => {
    const answers = {
      referenceNumber: validReferenceNumber,
      securityAccessCode: validSecurityAccessCode
    };
    return question.redirectWithField(RespondWithPin, answers, Respond);
  });

  describe('validate reference number shows error if', () => {
    it('is not provided', () => {
      const answers = {
        securityAccessCode: validSecurityAccessCode
      };
      const onlyErrors = ['referenceNumberRequired'];
      return question.testErrors(RespondWithPin, {}, answers, { onlyErrors });
    });
    it('is less than 16 digits', () => {
      const answers = {
        referenceNumber: '1234',
        securityAccessCode: validSecurityAccessCode
      };
      const onlyErrors = ['referenceNumberRequired'];
      return question.testErrors(RespondWithPin, {}, answers, { onlyErrors });
    });
    it('contains a non-digit character', () => {
      const answers = {
        referenceNumber: '123456789012345A',
        securityAccessCode: validSecurityAccessCode
      };
      const onlyErrors = ['referenceNumberDigitsOnly'];
      return question.testErrors(RespondWithPin, {}, answers, { onlyErrors });
    });
  });

  describe('validate security access code shows error if', () => {
    it('is not provided', () => {
      const answers = {
        referenceNumber: validReferenceNumber
      };
      const onlyErrors = ['securityAccessCodeRequired'];
      return question.testErrors(RespondWithPin, {}, answers, { onlyErrors });
    });
    it('contains a non-digit character', () => {
      const answers = {
        referenceNumber: validReferenceNumber,
        securityAccessCode: '1234567A'
      };
      const onlyErrors = ['securityAccessCodeDigitsOnly'];
      return question.testErrors(RespondWithPin, {}, answers, { onlyErrors });
    });
  });

  it('renders the content', () => {
    return content(RespondWithPin, {}, {
      ignoreContent: [
        'continue',
        'backLink'
      ]
    });
  });
});
