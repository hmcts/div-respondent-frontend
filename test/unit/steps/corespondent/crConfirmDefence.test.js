const modulePath = 'steps/co-respondent/cr-confirm-defence/CrConfirmDefence.step.js';
const CrConfirmDefence = require(modulePath);
const ChooseAResponse = require('steps/co-respondent/cr-choose-a-response/CrChooseAResponse.step');
const CrContactDetails = require(
  'steps/co-respondent/cr-contact-details/CrContactDetails.step'
);
const CrConfirmDefenceContent = require(
  'steps/co-respondent/cr-confirm-defence/CrConfirmDefence.content'
);
const CrAgreeToPayCosts = require(
  'steps/co-respondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.step'
);
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

const confirm = 'confirm';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(CrConfirmDefence, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      CrConfirmDefence,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('redirects to the CrAgreeToPayCosts on confirmation & if petitioner claims costs', () => {
    const fields = { response: 'confirm' };
    const session = {
      originalPetition: {
        claimsCostsFrom: [
          'respondent',
          'correspondent'
        ]
      }
    };
    return question.redirectWithField(CrConfirmDefence, fields, CrAgreeToPayCosts, session);
  });


  it('redirects - CrContactDetails page on confirmation & petitioner not claim costs', () => {
    const fields = { response: 'confirm' };
    const session = {
      originalPetition: {
        claimsCostsFrom: ['respondent']
      }
    };
    return question.redirectWithField(CrConfirmDefence, fields, CrContactDetails, session);
  });

  it('redirects back to cr choose a response page on changing response', () => {
    const fields = { response: 'changeResponse' };
    const session = {
      originalPetition: {
        claimsCostsFrom: ['respondent']
      }
    };
    return question.redirectWithField(CrConfirmDefence, fields, ChooseAResponse, session);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(CrConfirmDefence);
  });

  it('should have the answer object set correctly', () => {
    const req = {
      journey: {},
      session: {
        CrConfirmDefence: {
          response: confirm
        }
      }
    };
    const step = new CrConfirmDefence(req, {});
    step.retrieve()
      .validate();

    const answer = step.answers();
    expect(answer.answer).to.equal(CrConfirmDefenceContent.en.fields.confirm.label);
    expect(answer.question).to.equal(CrConfirmDefenceContent.en.title);
    expect(answer.hide).to.equal(true);
  });

  it('renders the content', () => {
    const ignoreContent = [
      'info',
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
      'change'
    ];

    return content(CrConfirmDefence, {}, { ignoreContent });
  });
});
