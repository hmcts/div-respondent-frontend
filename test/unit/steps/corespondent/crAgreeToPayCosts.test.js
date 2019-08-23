const modulePath = 'steps/co-respondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.step';
const CrAgreeToPayCosts = require(modulePath);
const CrContactDetails = require('steps/co-respondent/cr-contact-details/CrContactDetails.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const AgreeToPayCostsContent = require(
  'steps/co-respondent/cr-agree-to-pay-costs/CrAgreeToPayCosts.content'
);
const feesAndPaymentsService = require('services/feesAndPaymentsService');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('petition-issue-fee')
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
    return middleware.hasMiddleware(CrAgreeToPayCosts, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      CrAgreeToPayCosts,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'petition-issue-fee');
    });
  });

  it('when agrees to pay the cost then no details required', () => {
    const agreeToPayCosts = 'Yes';

    const fields = {
      crAgreeToPayCosts: {
        agree: agreeToPayCosts
      }
    };

    const req = {
      journey: {},
      session: { CrAgreeToPayCosts: fields }
    };

    const res = {};
    const step = new CrAgreeToPayCosts(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.deep.nested.property('costs.agreeToCosts', agreeToPayCosts);
  });

  it('when does not agree to pay the cost then reason required', () => {
    const coRespAgreeToCosts = 'No';
    const coRespCostsReason = 'Reason';

    const fields = {
      crAgreeToPayCosts: {
        agree: coRespAgreeToCosts,
        noReason: coRespCostsReason
      }
    };

    const req = {
      journey: {},
      session: { CrAgreeToPayCosts: fields }
    };

    const res = {};
    const step = new CrAgreeToPayCosts(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.deep.nested.property('costs.agreeToCosts', coRespAgreeToCosts);
    expect(_values).to.have.deep.nested.property('costs.reason', coRespCostsReason);
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      AgreeToPayCostsContent.en.cya.agree,
      AgreeToPayCostsContent.en.fields.agree.answer
    ];

    const stepData = {
      crAgreeToPayCosts: {
        agree: 'Yes'
      }
    };

    return question.answers(CrAgreeToPayCosts, stepData, expectedContent, {});
  });

  it('returns correct answers if answered no', () => {
    const noReason = 'noReason';

    const expectedContent = [
      AgreeToPayCostsContent.en.cya.agree,
      AgreeToPayCostsContent.en.fields.disagree.answer,
      AgreeToPayCostsContent.en.cya.noReason,
      noReason
    ];

    const stepData = {
      crAgreeToPayCosts: {
        agree: 'No',
        noReason
      }
    };

    return question.answers(CrAgreeToPayCosts, stepData, expectedContent, {});
  });


  it('shows error when does not agree to cost and reason not supplied', () => {
    const fields = { 'crAgreeToPayCosts.agree': 'No' };

    const onlyErrors = ['noReasonRequired'];

    return question.testErrors(CrAgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('redirects to next page when agreed to pay the costs', () => {
    const fields = {
      'crAgreeToPayCosts.agree': 'Yes'
    };

    return question.redirectWithField(CrAgreeToPayCosts, fields, CrContactDetails);
  });

  it('redirects to next page when not agreed to pay costs and reason supplied', () => {
    const fields = {
      'crAgreeToPayCosts.agree': 'No',
      'crAgreeToPayCosts.noReason': 'Reason'
    };

    return question.redirectWithField(CrAgreeToPayCosts, fields, CrContactDetails);
  });

  it('renders the content', () => {
    const ignoreContent = [
      'info',
      'cya',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours'
    ];
    return content(CrAgreeToPayCosts, {}, { ignoreContent });
  });
});
