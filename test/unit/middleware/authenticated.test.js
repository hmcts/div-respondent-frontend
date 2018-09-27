const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const caseOrchestration = require('services/caseOrchestration');

const modulePath = 'middleware/authenticated.js';
const middleware = require(modulePath);

describe(modulePath, () => {
  afterEach(() => {
    caseOrchestration.getPetition.restore();
  });

  describe('captureCaseAndPin', () => {
    it('calls next if case is found', done => {
      // given
      const req = sinon.stub();
      const res = sinon.stub();
      const next = sinon.stub();

      sinon.stub(caseOrchestration, 'getPetition')
        .resolves({
          statusCode: 200
        });

      // when
      middleware.captureCaseAndPin(req, res, next)
        .then(() => {
          expect(caseOrchestration.getPetition.calledOnce).to.be.true;
          expect(next.calledOnce).to.be.true;
        })
        .then(done, done);
    });

    it('redirects to capture case and pin if no case is found', done => {
      // given
      const req = sinon.stub();
      const res = {
        redirect: sinon.stub()
      };
      const next = sinon.stub();

      sinon.stub(caseOrchestration, 'getPetition')
        .resolves({
          statusCode: 404
        });

      // when
      middleware.captureCaseAndPin(req, res, next)
        .then(() => {
          expect(caseOrchestration.getPetition.calledOnce).to.be.true;
          expect(res.redirect.calledOnce).to.be.true;
        })
        .then(done, done);
    });
  });
});
