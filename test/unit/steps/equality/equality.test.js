const modulePath = 'steps/equality/Equality.step';
const Equality = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  const journeys = ['respondent', 'co-respondent'];

  journeys.forEach(j => {
    describe(j, () => {
      it('redirects to PCQ with the correct parameters', () => {
        const req = {
          journey: {},
          session: {
            invokePcq: true,
            referenceNumber: '123abc',
            IdamLogin: { success: j }
          },
          idam: { userDetails: { email: 'test@test.com' } },
          headers: { host: 'localhost' }
        };
        req.session[Equality.pcqIdPropertyName(req)] = 'abc123';
        const res = {
          redirect: sinon.spy()
        };

        const step = new Equality(req, res);
        step.handler(req, res);

        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.args[0][0]).to.satisfy(str => str.startsWith(
          // eslint-disable-next-line max-len
          'http://localhost:4000/service-endpoint?serviceId=DIVORCE&actor=RESPONDENT&pcqId=abc123&ccdCaseId=123abc&partyId=test@test.com&returnUrl=localhost/check-your-answers&language=en&token='
        ));
      });
    });
  });
});
