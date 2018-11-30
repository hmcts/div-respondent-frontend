const modulePath = 'middleware/feesAndPaymentsMiddleware';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const { getFeeFromFeesAndPayments } = require(modulePath);
const feesAndPaymentsService = require('services/feesAndPaymentsService');


describe(modulePath, () => {
  afterEach(() => {
    feesAndPaymentsService.get.restore();
  });

  it('gets the application fee from the service', done => {
    const next = sinon.stub();
    const res = {
      locals: { applicationFee: {} }
    };
    const req = sinon.stub();
    const appFeeIssue = {
      'petition-issue-fee': {
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      }
    };

    sinon.stub(feesAndPaymentsService, 'get').withArgs('petition-issue-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
    getFeeFromFeesAndPayments('petition-issue-fee')(req, res, next).then(() => {
      expect(res.locals.applicationFee).to.eql(appFeeIssue);
      expect(next.calledOnce).to.eql(true);
      done();
    }).catch(error => {
      done(error);
    });
  });

  it('calls next on error', done => {
    const next = sinon.stub();
    const res = {
      locals: { }
    };
    const req = sinon.stub();

    sinon.stub(feesAndPaymentsService, 'get')
      .rejects({});

    getFeeFromFeesAndPayments('petition-issue-fee')(req, res, next)
      .then(() => {
        expect(next.calledOnce).to.eql(true);
        done();
      }).catch(error => {
        done(error);
      });
  });
});