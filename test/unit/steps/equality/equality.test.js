const modulePath = 'steps/equality/Equality.step';
const Equality = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('redirects to PCQ with the correct parameters', () => {
    const req = {
      journey: {},
      session: { pcq: { id: 'abc123' } },
      headers: { host: 'localhost' }
    };
    const res = {
      redirect: sinon.spy()
    };

    const step = new Equality(req, res);
    step.handler(req,res);

    expect(res.redirect.calledOnce).to.equal(true);
    expect(res.redirect.args[0][0]).to.satisfy(str => str.startsWith('http://localhost:4000/service-endpoint?' +
      'serviceId=DIVORCE&actor=RESPONDENT&pcqId=abc123&partyId=todo&returnUrl=localhost/check-your-answers&language=en&token='));
  });
});
