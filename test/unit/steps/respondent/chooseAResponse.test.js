const modulePath = 'steps/respondent/choose-a-response/ChooseAResponse.step';
const stepContent = require('steps/respondent/choose-a-response/ChooseAResponse.content');
const ChooseAResponse = require(modulePath);
const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const ConfirmDefence = require('steps/respondent/confirm-defence/ConfirmDefence.step');
const FinancialSituation = require('steps/respondent/financial-situation/FinancialSituation.step');
const DefendFinancialHardship = require('steps/respondent/defend-financial-hardship/DefendFinancialHardship.step.js'); // eslint-disable-line max-len

const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

describe(modulePath, () => {
  const session = {
    fields: {
      response: {
        value: 'proceed'
      }
    }
  };

  beforeEach(() => {
    session.originalPetition = { reasonForDivorce: 'adultery' };
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('defended-petition-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 245.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ChooseAResponse, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    return content(
      ChooseAResponse,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('redirects to jurisdiction page when proceeding with divorce', () => {
    const fields = { response: 'proceed' };
    return question.redirectWithField(ChooseAResponse, fields, Jurisdiction, session);
  });

  it('redirects to confirm defence page when disagreeing with divorce', () => {
    const fields = { response: 'defend' };
    return question.redirectWithField(ChooseAResponse, fields, ConfirmDefence, session);
  });

  it('redirects to financial situation when 5 year separation and not defended', () => {
    const fields = { response: 'proceed' };
    session.originalPetition = { reasonForDivorce: 'separation-5-years' };
    return question.redirectWithField(ChooseAResponse, fields, FinancialSituation, session);
  });

  it('redirects to defend financial hardship page when disagreeing with divorce and reason is 5 year separatinon', () => { // eslint-disable-line max-len
    const fields = { response: 'defend' };
    session.originalPetition.reasonForDivorce = 'separation-5-years';
    return question.redirectWithField(ChooseAResponse, fields, DefendFinancialHardship, session);
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

  it('sets respWillDefendDivorce to no if response is proceed', () => {
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
    expect(values).to.have.property('respWillDefendDivorce', 'No');
  });

  it('sets respWillDefendDivorce to yes if response is defend', () => {
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
    expect(values).to.have.property('respWillDefendDivorce', 'Yes');
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

    it('redirects to jurisdiction page when proceed but do not admit with divorce', () => {
      const fields = { response: 'proceedButDisagree' };
      return question.redirectWithField(ChooseAResponse, fields, Jurisdiction, session);
    });

    it('renders specific behaviour info', () => {
      return content(
        ChooseAResponse,
        session,
        {
          specificValues: [stepContent.en.info.options.proceedButDisagree.heading]
        }
      );
    });

    it('renders specific behaviour questions', () => {
      return content(
        ChooseAResponse,
        {
          divorceWho: 'wife',
          originalPetition: {
            reasonForDivorce: 'unreasonable-behaviour'
          }
        }, {
          specificValues: [
            stepContent.en.fields.proceed.heading,
            'I will let the divorce proceed, but I don\'t admit to what my wife said about me',
            stepContent.en.fields.defend.heading
          ]
        });
    });

    it('sets respWillDefendDivorce to no if response is proceed', () => {
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
      expect(values).to.have.property('respWillDefendDivorce', 'No');
    });

    it('sets respWillDefendDivorce to notAccept if response is proceedButDisagree', () => {
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
      expect(values).to.have.property(
        'respWillDefendDivorce',
        'NoNoAdmission'
      );
    });

    it('set respWillDefendDivorce to Yes if response is defend', () => {
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
      expect(values).to.have.property('respWillDefendDivorce', 'Yes');
    });

    it('throws error for unknown response', () => {
      // given
      session.ChooseAResponse = {
        response: 'blah'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve()
        .validate();

      // then
      expect(step.values.bind(step)).to.throw('Unknown response to behavior: \'blah\'');
    });
  });
});