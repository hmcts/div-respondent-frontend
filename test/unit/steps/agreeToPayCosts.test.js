const modulePath = 'steps/agree-to-pay-costs/AgreeToPayCosts.step';
const AgreeToPayCosts = require(modulePath);
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(AgreeToPayCosts, [idam.protect()]);
  });

  it('when agrees to pay the cost then no details required', () => {
    const agreeToPayCosts = 'yes';

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
    const agreeToPayCosts = 'no';
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
    const agreeToPayCosts = 'differentAmount';
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

  it('shows error when does not agree to cost and reason not supplied', () => {
    const fields = { 'agreeToPayCosts-agree': 'no' };

    const onlyErrors = ['noReasonRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different and mount details not supplied', () => {
    const fields = { 'agreeToPayCosts-agree': 'differentAmount' };

    const onlyErrors = ['newAmountRequired', 'newAmountReasonRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different amount and amount not supplied', () => {
    const fields = {
      'agreeToPayCosts-agree': 'differentAmount',
      'agreeToPayCosts-newAmountReason': 'Reason'
    };

    const onlyErrors = ['newAmountRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different amount and amount supplied is NaN', () => {
    const fields = {
      'agreeToPayCosts-agree': 'differentAmount',
      'agreeToPayCosts-newAmount': 'NaN',
      'agreeToPayCosts-newAmountReason': 'Reason'
    };

    const onlyErrors = ['newAmountRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('shows error when agree to pay different amount and reason not supplied', () => {
    const fields = {
      'agreeToPayCosts-agree': 'differentAmount',
      'agreeToPayCosts-newAmount': 555
    };

    const onlyErrors = ['newAmountReasonRequired'];

    return question.testErrors(AgreeToPayCosts, {}, fields, { onlyErrors });
  });

  it('redirects to next page when agreed to pay the costs', () => {
    const fields = {
      'agreeToPayCosts-agree': 'yes'
    };

    return question.redirectWithField(AgreeToPayCosts, fields, CheckYourAnswers);
  });

  it('redirects to next page when not agreed to pay costs and reason supplied', () => {
    const fields = {
      'agreeToPayCosts-agree': 'no',
      'agreeToPayCosts-noReason': 'Reason'
    };

    return question.redirectWithField(AgreeToPayCosts, fields, CheckYourAnswers);
  });

  it('redirects to next page when agreed to pay new Amount and details supplied', () => {
    const fields = {
      'agreeToPayCosts-agree': 'differentAmount',
      'agreeToPayCosts-newAmount': 12345,
      'agreeToPayCosts-newAmountReason': 'Reason'
    };

    return question.redirectWithField(AgreeToPayCosts, fields, CheckYourAnswers);
  });

  it('renders the content', () => {
    return content(AgreeToPayCosts, {}, { ignoreContent: ['info', 'cya'] });
  });
});
