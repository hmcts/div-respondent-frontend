const modulePath = 'steps/choose-a-response/ChooseAResponse.step';
const stepContent = require('steps/choose-a-response/ChooseAResponse.content');
const ChooseAResponse = require(modulePath);
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const ConfirmDefence = require('steps/confirm-defence/ConfirmDefence.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  const session = {
    fields: {
      response: {
        value: 'proceed'
      }
    }
  };

  beforeEach(() => {
    session.originalPetition = {};
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ChooseAResponse, [idam.protect()]);
  });

  it('redirects to jurisdiction page when proceeding with divorce', () => {
    const fields = { response: 'proceed' };
    return question.redirectWithField(ChooseAResponse, fields, Jurisdiction);
  });

  it('redirects to confirm defence page when disagreeing with divorce', () => {
    const fields = { response: 'defend' };
    return question.redirectWithField(ChooseAResponse, fields, ConfirmDefence);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ChooseAResponse, session);
  });

  it('renders the content', () => {
    return content(ChooseAResponse, session, { ignoreContent: ['info'] });
  });

  it('does not render specific behaviour info by default', () => {
    return content(ChooseAResponse, session, {
      ignoreContent: ['info'],
      specificValuesToNotExist: [
        stepContent.en.info.options.proceedButDisagree.heading,
        stepContent.en.info.options.proceedButDisagree.summary
      ]
    });
  });

  it('does not render specific behaviour questions by default', () => {
    return content(ChooseAResponse, session, {
      ignoreContent: ['info'],
      specificValuesToNotExist: [
        stepContent.en.fields.proceedButDisagree.heading,
        stepContent.en.fields.proceedButDisagree.summary
      ]
    });
  });

  describe('returns correct answer based on response', () => {
    it('returns correct answer for proceed', () => {
      // given
      session.ChooseAResponse = {
        response: 'proceed'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const values = step.answers();
      expect(values).to.be.an('object');
      expect(values).to.have.property('answer', stepContent.en.fields.proceed.answer);
    });

    it('returns correct answer for proceedButDisagree', () => {
      // given
      session.ChooseAResponse = {
        response: 'proceedButDisagree'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const values = step.answers();
      expect(values).to.be.an('object');
      expect(values).to.have.property('answer', stepContent.en.fields.proceedButDisagree.answer);
    });

    it('returns correct answer for defend', () => {
      // given
      session.ChooseAResponse = {
        response: 'defend'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const answers = step.answers();
      expect(answers).to.be.an('object');
      expect(answers).to.have.property('answer', stepContent.en.fields.defend.answer);
    });
  });

  describe('when reason for divorce is unreasonable behaviour', () => {
    beforeEach(() => {
      session.originalPetition = {
        reasonForDivorce: 'unreasonable-behaviour'
      };
    });

    it('renders specific behaviour info', () => {
      return content(
        ChooseAResponse,
        session,
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
            stepContent.en.fields.proceedButDisagree.heading,
            stepContent.en.fields.defend.heading
          ]
        });
    });

    it('sets respAdmitOrConsentToFact to yes if response is proceed', () => {
      // given
      session.ChooseAResponse = {
        response: 'proceed'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve()
        .validate();

      // then
      const values = step.values();
      expect(values).to.be.an('object');
      expect(values).to.have.property('respDefendsDivorce', 'yes');
      expect(values).to.have.property('respAdmitOrConsentToFact', 'yes');
    });

    it('sets respAdmitOrConsentToFact to no if response is proceedButDisagree', () => {
      // given
      session.ChooseAResponse = {
        response: 'proceedButDisagree'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve()
        .validate();

      // then
      const values = step.values();
      expect(values).to.be.an('object');
      expect(values).to.have.property('respDefendsDivorce', 'yes');
      expect(values).to.have.property('respAdmitOrConsentToFact', 'no');
    });

    it('set respAdmitOrConsentToFact to no if response is defend', () => {
      // given
      session.ChooseAResponse = {
        response: 'defend'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve()
        .validate();

      // then
      const values = step.values();
      expect(values).to.be.an('object');
      expect(values).to.have.property('respDefendsDivorce', 'no');
      expect(values).to.have.property('respAdmitOrConsentToFact', 'no');
    });
  });
});
