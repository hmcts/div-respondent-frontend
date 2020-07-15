const modulePath = 'steps/equality/Equality.step';
const rewire = require('rewire');

const Equality = rewire(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  const entryPoints = ['Respond', 'CrRespond'];

  entryPoints.forEach(entryPoint => {
    describe(entryPoint, () => {
      it('redirects to PCQ with the correct parameters', () => {
        const req = {
          journey: {},
          session: {
            entryPoint,
            referenceNumber: '123abc'
          },
          idam: { userDetails: { email: 'test@test.com' } },
          headers: { host: 'localhost' }
        };
        const res = {
          redirect: sinon.spy()
        };

        Equality.__set__('uuidv4', () => {
          return 'abc123';
        });

        const step = new Equality(req, res);
        step.handler(req, res);

        expect(res.redirect.calledOnce).to.equal(true);
        const returnUrl = entryPoint === 'CrRespond' ? 'localhost/co-respondent/check-your-answers' : 'localhost/check-your-answers';
        expect(res.redirect.args[0][0]).to.satisfy(str => str.startsWith(
          // eslint-disable-next-line max-len
          `http://localhost:4000/service-endpoint?serviceId=DIVORCE&actor=RESPONDENT&pcqId=abc123&ccdCaseId=123abc&partyId=test@test.com&returnUrl=${returnUrl}&language=en&token=`
        ));
      });
    });
  });
});
