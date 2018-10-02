const modulePath = 'steps/confirm-defence/ConfirmDefence.step.js';
const ConfirmDefence = require(modulePath);
const Jurisdiction = require('steps/jurisdiction/Jurisdiction.step');
const ChooseAResponse = require('steps/choose-a-response/ChooseAResponse.step');
const confirmDefenceContent = require('steps/confirm-defence/ConfirmDefence.content');
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
    return middleware.hasMiddleware(ConfirmDefence, [idam.protect()]);
  });

  it('redirects to the check your answers page on confirmation', () => {
    const fields = { response: 'confirm' };
    return question.redirectWithField(ConfirmDefence, fields, Jurisdiction);
  });

  it('redirects to back to choose a response page on changing response', () => {
    const fields = { response: 'changeResponse' };
    return question.redirectWithField(ConfirmDefence, fields, ChooseAResponse);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ConfirmDefence);
  });

  it('should have the answer object set correctly if user confirms', () => {
    const req = {
      journey: {},
      session: {
        ConfirmDefence: {
          response: confirmDefenceContent.en.fields.confirm.value
        }
      }
    };
    const step = new ConfirmDefence(req, {});
    step.retrieve()
      .validate();

    const answer = step.answers();
    expect(answer.answer).to.equal(confirmDefenceContent.en.fields.confirm.heading);
    expect(answer.question).to.equal(confirmDefenceContent.en.title);
    expect(answer.hide).to.equal(true);
  });

  it('renders the content', () => {
    return content(ConfirmDefence, {}, { ignoreContent: ['info'] });
  });
});
