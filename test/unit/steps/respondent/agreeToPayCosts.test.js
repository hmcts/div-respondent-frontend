const modulePath = 'steps/respondent/agree-to-pay-costs/AgreeToPayCosts.step';
const AgreeToPayCosts = require(modulePath);
const ContactDetails = require('steps/respondent/contact-details/ContactDetails.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const AgreeToPayCostsContent = require(
  'steps/respondent/agree-to-pay-costs/AgreeToPayCosts.content'
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
    return middleware.hasMiddleware(AgreeToPayCosts, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      AgreeToPayCosts,
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
      agreeToPayCosts: {
        agree: agreeToPayCosts
      }
    };

    const req = {
      journey: {},
      session: { AgreeToPayCosts: fields }
    };

    const res = {};
    const step = new AgreeToPayCosts(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respAgreeToCosts', agreeToPayCosts);
    expect(_values).to.not.have.property('respCostsAmount');
    expect(_values).to.not.have.property('respCostsReason');
  });

  it('when does not agree to pay the cost then reason required', () => {
    const agreeToPayCosts = 'No';
    const respCostsReason = 'Reason';

    const fields = {
      agreeToPayCosts: {
        agree: agreeToPayCosts,
        noReason: respCostsReason
      }
    };

    const req = {
      journey: {},
      session: { AgreeToPayCosts: fields }
    };

    const res = {};
    const step = new AgreeToPayCosts(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respAgreeToCosts', agreeToPayCosts);
    expect(_values).to.not.have.property('respCostsAmount');
    expect(_values).to.have.property('respCostsReason', respCostsReason);
  });

  it('when agrees to pay a different amount then new amount and a reason are required', () => {
    const agreeToPayCosts = 'DifferentAmount';
    const respCostsAmount = '1234';
    const respCostsReason = 'Reason';

    const fields = {
      agreeToPayCosts: {
        agree: agreeToPayCosts,
        newAmount: respCostsAmount,
        newAmountReason: respCostsReason
      }
    };

    const req = {
      journey: {},
      session: { AgreeToPayCosts: fields }
    };

    const res = {};
    const step = new AgreeToPayCosts(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respAgreeToCosts', agreeToPayCosts);
    expect(_values).to.have.property('respCostsAmount', respCostsAmount);
    expect(_values).to.have.property('respCostsReason', respCostsReason);
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      AgreeToPayCostsContent.en.cya.agree,
      AgreeToPayCostsContent.en.fields.agree.answer
    ];

    const stepData = {
      agreeToPayCosts: {
        agree: 'Yes'
      }
    };

    return question.answers(AgreeToPayCosts, stepData, expectedContent, {});
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
      agreeToPayCosts: {
        agree: 'No',
        noReason
      }
    };

    return question.answers(AgreeToPayCosts, stepData, expectedContent, {});
  });

  it('returns correct answers if answered no', () => {
    const newAmount = 'New Amount';
    const newAmountReason = 'New Amount Reason';

    const expectedContent = [
      AgreeToPayCostsContent.en.cya.agree,
      AgreeToPayCostsContent.en.fields.differentAmount.answer,
      AgreeToPayCostsContent.en.cya.newAmount,
      newAmount,
      AgreeToPayCostsContent.en.cya.newAmountReason,
      newAmountReason
    ];

    const stepData = {
      agreeToPayCosts: {
        agree: 'DifferentAmount',
        newAmount,
        newAmountReason
      }
    };

    return question.answers(AgreeToPayCosts, stepData, expectedContent, {});
  });

  it('shows error when does not agree to cost and reason not supplied', () => {
    const fields = { 'agreeToPayCosts.agree': 'No' };

    const onlyErrors = ['noReasonRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different and mount details not supplied', () => {
    const fields = { 'agreeToPayCosts.agree': 'DifferentAmount' };

    const onlyErrors = ['newAmountRequired', 'newAmountReasonRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different amount and amount not supplied', () => {
    const fields = {
      'agreeToPayCosts.agree': 'DifferentAmount',
      'agreeToPayCosts.newAmountReason': 'Reason'
    };

    const onlyErrors = ['newAmountRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different amount and amount supplied is NaN', () => {
    const fields = {
      'agreeToPayCosts.agree': 'DifferentAmount',
      'agreeToPayCosts.newAmount': 'NaN',
      'agreeToPayCosts.newAmountReason': 'Reason'
    };

    const onlyErrors = ['newAmountRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different amount and reason not supplied', () => {
    const fields = {
      'agreeToPayCosts.agree': 'DifferentAmount',
      'agreeToPayCosts.newAmount': 555
    };

    const onlyErrors = ['newAmountReasonRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('redirects to next page when agreed to pay the costs', () => {
    const fields = {
      'agreeToPayCosts.agree': 'Yes'
    };

    return question.redirectWithField(AgreeToPayCosts, fields, ContactDetails);
  });

  it('redirects to next page when not agreed to pay costs and reason supplied', () => {
    const fields = {
      'agreeToPayCosts.agree': 'No',
      'agreeToPayCosts.noReason': 'Reason'
    };

    return question.redirectWithField(AgreeToPayCosts, fields, ContactDetails);
  });

  it('redirects to next page when agreed to pay new Amount and details supplied', () => {
    const fields = {
      'agreeToPayCosts.agree': 'DifferentAmount',
      'agreeToPayCosts.newAmount': 12345,
      'agreeToPayCosts.newAmountReason': 'Reason'
    };

    return question.redirectWithField(AgreeToPayCosts, fields, ContactDetails);
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
      'chatOpeningHours',
      'signIn',
      'signOut',
      'languageToggle',
      'thereWasAProblem'
    ];

    return content(AgreeToPayCosts, {}, { ignoreContent });
  });
});
