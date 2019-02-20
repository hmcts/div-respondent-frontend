const modulePath = 'steps/respondent/confirm-defence/ConfirmDefence.step.js';
const ConfirmDefence = require(modulePath);
const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const ChooseAResponse = require('steps/respondent/choose-a-response/ChooseAResponse.step');
const ConsentDecree = require('steps/respondent/consent-decree/ConsentDecree.step');
const confirmDefenceContent = require('steps/respondent/confirm-defence/ConfirmDefence.content');
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
    return middleware.hasMiddleware(ConfirmDefence, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      ConfirmDefence,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledTwice(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'petition-issue-fee');
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('redirects to the jurisdiction page on confirmation', () => {
    const fields = { response: 'confirm' };
    return question.redirectWithField(ConfirmDefence, fields, Jurisdiction);
  });

  it('redirects back to choose a response page on changing response', () => {
    const fields = { response: 'changeResponse' };
    return question.redirectWithField(ConfirmDefence, fields, ChooseAResponse);
  });

  it('redirects back to consent decree page if original petition is 2yr separation', () => {
    const fields = { response: 'changeResponse' };
    const session = {
      originalPetition: {
        reasonForDivorce: 'separation-2-years'
      }
    };
    return question.redirectWithField(ConfirmDefence, fields, ConsentDecree, session);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ConfirmDefence);
  });

  it('should have the answer object set correctly', () => {
    const req = {
      journey: {},
      session: {
        ConfirmDefence: {
          response: confirm
        }
      }
    };
    const step = new ConfirmDefence(req, {});
    step.retrieve()
      .validate();

    const answer = step.answers();
    expect(answer.answer).to.equal(confirmDefenceContent.en.fields.confirm.label);
    expect(answer.question).to.equal(confirmDefenceContent.en.title);
    expect(answer.hide).to.equal(true);
  });

  it('should ensure no re-direct loop if user has answered already', () => {
    const fields = { response: 'changeResponse' };
    const session = {
      originalPetition: {
        reasonForDivorce: 'separation-5-years'
      },
      previouslyConfirmed: false
    };
    return question.redirectWithField(ConfirmDefence, fields, Jurisdiction, session);
  });

  it('should ensure no re-direct loop if user has answered already, 2-yr sep.', () => {
    const fields = { response: 'changeResponse' };
    const session = {
      originalPetition: {
        reasonForDivorce: 'separation-2-years'
      },
      previouslyConfirmed: false
    };
    return question.redirectWithField(ConfirmDefence, fields, ConsentDecree, session);
  });

  it('renders the content', () => {
    return content(ConfirmDefence, {}, { ignoreContent: ['info'] });
  });
});
