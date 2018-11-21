const modulePath = 'steps/no-consent-are-you-sure/NoConsentAreYouSure.step.js';
const NoConsentAreYouSure = require(modulePath);
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const FinancialSituation = require('steps/financial-situation/FinancialSituation.step');
const ConsentDecree = require('steps/consent-decree/ConsentDecree.step');

const yes = 'Yes';
const no = 'No';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(NoConsentAreYouSure, [idam.protect()]);
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
