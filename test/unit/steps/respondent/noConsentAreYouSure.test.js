const modulePath = 'steps/respondent/no-consent-are-you-sure/NoConsentAreYouSure.step.js';
const NoConsentAreYouSure = require(modulePath);
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const FinancialSituation = require('steps/respondent/financial-situation/FinancialSituation.step');
const ConsentDecree = require('steps/respondent/consent-decree/ConsentDecree.step');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

const yes = 'Yes';
const no = 'No';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('amend-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 95,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(NoConsentAreYouSure, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      NoConsentAreYouSure,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'amend-fee');
    });
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(NoConsentAreYouSure);
  });

  it('when answer is yes then the answer should be empty', () => {
    const req = {
      journey: {},
      session: {
        NoConsentAreYouSure: {
          response: yes
        }
      }
    };
    const step = new NoConsentAreYouSure(req, {});
    step.retrieve().validate();

    const answer = step.answers();
    expect(answer.answer).to.eql(yes);
    expect(answer.hide).to.eql(true);
  });

  it('when answer is no then the answer should be empty', () => {
    const req = {
      journey: {},
      session: {
        NoConsentAreYouSure: {
          response: no
        }
      }
    };
    const step = new NoConsentAreYouSure(req, {});
    step.retrieve().validate();

    const answer = step.answers();
    expect(answer.answer).to.eql(no);
    expect(answer.hide).to.eql(true);
  });

  it('returns the correct values object, with yes for conform consent', () => {
    const req = {
      journey: {},
      session: {
        NoConsentAreYouSure: {
          response: yes
        }
      }
    };
    const step = new NoConsentAreYouSure(req, {});
    step.retrieve().validate();

    const values = step.values();
    expect(values).to.eql({});
  });

  it('returns the correct values object, with no for conform consent', () => {
    const req = {
      journey: {},
      session: {
        NoConsentAreYouSure: {
          response: no
        }
      }
    };
    const step = new NoConsentAreYouSure(req, {});
    step.retrieve().validate();

    const values = step.values();
    expect(values).to.eql({});
  });

  it('redirects to financial situation page on confirm', () => {
    const fields = {
      response: yes
    };

    return question.redirectWithField(NoConsentAreYouSure, fields, FinancialSituation);
  });

  it('redirects to consent decree page on not confirm', () => {
    const fields = {
      response: no
    };

    return question.redirectWithField(NoConsentAreYouSure, fields, ConsentDecree);
  });

  it('renders all the content', () => {
    return content(NoConsentAreYouSure, {},
      { specificContent: [
        'detailsText.para1',
        'detailsText.para2',
        'detailsText.para3',
        'notice'
      ] });
  });
});
