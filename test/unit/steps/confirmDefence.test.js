const modulePath = 'steps/confirm-defence/ConfirmDefence.step.js';
const ConfirmDefence = require(modulePath);
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const ChooseAResponse = require('steps/choose-a-response/ChooseAResponse.step');
const ConsentDecree = require('steps/consent-decree/ConsentDecree.step');
const confirmDefenceContent = require('steps/confirm-defence/ConfirmDefence.content');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');

const confirm = 'confirm';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ConfirmDefence, [idam.protect()]);
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

  it('renders the content', () => {
    return content(ConfirmDefence, {}, { ignoreContent: ['info'] });
  });
});
