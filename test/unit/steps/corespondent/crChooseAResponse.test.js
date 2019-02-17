const modulePath = 'steps/corespondent/cr-choose-a-response/CrChooseAResponse.step'; // eslint-disable-line
const stepContent = require('steps/corespondent/cr-choose-a-response/CrChooseAResponse.content');
const CrChooseAResponse = require(modulePath);
const AgreeToPayCosts = require('steps/respondent/agree-to-pay-costs/AgreeToPayCosts.step');
const ConfirmDefence = require('steps/respondent/confirm-defence/ConfirmDefence.step');

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
    return middleware.hasMiddleware(CrChooseAResponse, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    return content(
      CrChooseAResponse,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('redirects to confirm defence page when disagreeing with divorce', () => {
    const fields = { response: 'defend' };
    return question.redirectWithField(CrChooseAResponse, fields, ConfirmDefence, session);
  });

  it('redirects to AgreeToPayCosts page when agreeing with divorce', () => {
    const fields = { response: 'proceed' };
    return question.redirectWithField(CrChooseAResponse, fields, AgreeToPayCosts, session);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(CrChooseAResponse, session);
  });

  it('renders the content', () => {
    return content(CrChooseAResponse, session);
  });

  it('sets coRespDefendsDivorce to no if response is proceed', () => {
    // given
    session.CrChooseAResponse = {
      response: 'proceed'
    };

    // when
    const step = new CrChooseAResponse({ session });
    step.retrieve()
      .validate();

    // then
    const values = step.values();
    expect(values).to.be.an('object');
    expect(values).to.have.property('coRespDefendsDivorce', 'No');
  });

  it('sets coRespDefendsDivorce to yes if response is defend', () => {
    // given
    session.CrChooseAResponse = {
      response: 'defend'
    };

    // when
    const step = new CrChooseAResponse({ session });
    step.retrieve()
      .validate();

    // then
    const values = step.values();
    expect(values).to.be.an('object');
    expect(values).to.have.property('coRespDefendsDivorce', 'Yes');
  });

  describe('returns correct answer based on response', () => {
    it('returns correct answer for proceed', () => {
      // given
      session.CrChooseAResponse = {
        response: 'proceed'
      };

      // when
      const step = new CrChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const values = step.answers();
      expect(values).to.be.an('object');
      expect(values).to.have.property('answer', stepContent.en.fields.proceed.answer);
    });

    it('returns correct answer for defend', () => {
      // given
      session.CrChooseAResponse = {
        response: 'defend'
      };

      // when
      const step = new CrChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const answers = step.answers();
      expect(answers).to.be.an('object');
      expect(answers).to.have.property('answer', stepContent.en.fields.defend.answer);
    });
  });
});
