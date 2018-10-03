const modulePath = 'steps/choose-a-response/ChooseAResponse.step';
const stepContent = require('steps/choose-a-response/ChooseAResponse.content');
const ChooseAResponse = require(modulePath);
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ChooseAResponse, [idam.protect()]);
  });

  it('redirects to next page on success', () => {
    const fields = { respDefendsDivorce: 'yes' };
    return question.redirectWithField(ChooseAResponse, fields, Jurisdiction);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ChooseAResponse);
  });

  it('renders the content', () => {
    return content(ChooseAResponse, {}, { ignoreContent: ['info'] });
  });

  it('does not render specific behaviour info by default', () => {
    return content(ChooseAResponse, {}, {
      ignoreContent: ['info'],
      specificValuesToNotExist: [
        stepContent.en.info.options.proceedButDisagree.heading,
        stepContent.en.info.options.proceedButDisagree.summary
      ]
    });
  });

  it('does not render specific behaviour questions by default', () => {
    return content(ChooseAResponse, {}, {
      ignoreContent: ['info'],
      specificValuesToNotExist: [
        stepContent.en.fields.proceedButDisagree.heading,
        stepContent.en.fields.proceedButDisagree.summary
      ]
    });
  });

  describe('behaviour', () => {
    it('renders specific behaviour info', () => {
      return content(
        ChooseAResponse,
        {
          originalPetition: {
            reasonForDivorce: 'unreasonable-behaviour'
          }
        },
        {
          specificValues: [
            stepContent.en.info.options.proceedButDisagree.heading,
            stepContent.en.info.options.proceedButDisagree.summary
          ]
        }
      );
    });

    it('renders specific behaviour questions', () => {
      return content(
        ChooseAResponse,
        {
          originalPetition: {
            reasonForDivorce: 'unreasonable-behaviour'
          }
        }, {
          specificValues: [
            stepContent.en.fields.proceed.heading,
            stepContent.en.fields.proceed.summary,
            stepContent.en.fields.proceedButDisagree.heading,
            stepContent.en.fields.proceedButDisagree.summary,
            stepContent.en.fields.disagree.heading,
            stepContent.en.fields.disagree.summary
          ]
        });
    });
  });
});
