const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const caseOrchestration = require('services/caseOrchestration');

const modulePath = 'middleware/captureCaseAndPin.js';
const middleware = require(modulePath);

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(caseOrchestration, 'linkCase')
      .resolves({});
  });

  afterEach(() => {
    caseOrchestration.linkCase.restore();
  });

  describe('linkCaseOnSubmit', () => {
    it('calls next if request is not case/pin submit', done => {
      // given
      const req = {
        method: 'GET'
      };
      const next = sinon.stub();

      // when
      middleware.linkCaseOnSubmit(req, {}, next);

      // then
      expect(next.calledOnce).to.be.true;
      done();
    });

    it('links case if request is a case/pin submit', done => {
      // given
      const req = {
        method: 'POST'
      };
      const next = sinon.stub();


      // when
      middleware.linkCaseOnSubmit(req, {}, next)
        .then(() => {
          expect(caseOrchestration.linkCase.calledOnce).to.be.true;
          expect(next.calledOnce).to.be.true;
        })
        .then(done, done);
    });
  });
});
