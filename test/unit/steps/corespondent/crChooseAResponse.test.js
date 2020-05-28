const modulePath = 'steps/co-respondent/cr-choose-a-response/CrChooseAResponse.step'; // eslint-disable-line
const stepContent = require('steps/co-respondent/cr-choose-a-response/CrChooseAResponse.content');
const CrChooseAResponse = require(modulePath);
const CrAgreeToPayCosts = require(
  'steps/co-respondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.step'
);
const CrContactDetails = require(
  'steps/co-respondent/cr-contact-details/CrContactDetails.step'
);
const CrConfirmDefence = require('steps/co-respondent/cr-confirm-defence/CrConfirmDefence.step');

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

    return content(
      CrChooseAResponse,
      session,
      { specificContent: ['title'], ignoreContent }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('redirects to cr confirm defence page when disagreeing with divorce', () => {
    const fields = { response: 'defend' };
    return question.redirectWithField(CrChooseAResponse, fields, CrConfirmDefence, session);
  });

  it('redirects to CrAgreeToPayCosts page, agreeing divorce & petitioner cliams costs', () => {
    const fields = { response: 'proceed' };
    const sess = {
      originalPetition: {
        claimsCostsFrom: [
          'respondent',
          'correspondent'
        ]
      }
    };
    return question.redirectWithField(CrChooseAResponse, fields, CrAgreeToPayCosts, sess);
  });


  it('redirects to CrContactDetails page when agreeing with divorce & not claiming costs', () => {
    const fields = { response: 'proceed' };
    const sess = {
      originalPetition: {
        claimsCostsFrom: ['respondent']
      }
    };
    return question.redirectWithField(CrChooseAResponse, fields, CrContactDetails, sess);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(CrChooseAResponse, session);
  });

  it('renders the content', () => {
    const ignoreContent = [
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
      'languageToggle',
      'thereWasAProblem',
      'change',
      'husband',
      'wife'
    ];
    return content(CrChooseAResponse, session, { ignoreContent });
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
    expect(values).to.have.property('defendsDivorce', 'No');
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
    expect(values).to.have.property('defendsDivorce', 'Yes');
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
