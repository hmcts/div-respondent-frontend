const modulePath = 'middleware/feesAndPaymentsMiddleware';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const { getFeeFromFeesAndPayments } = require(modulePath);


describe(modulePath, () => {
  it('gets the application fee from the service', done => {
    const next = sinon.stub();
    const res = {
      locals: { applicationFee: {} }
    };
    const req = sinon.stub();
    const appFeeIssue = {
      issue: {
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      }
    };

    getFeeFromFeesAndPayments('issue')(req, res, next).then(() => {
      expect(res.locals.applicationFee).to.eql(appFeeIssue);
      expect(next.calledOnce).to.eql(true);
      done();
    }).catch(error => {
      done(error);
    });
  });
});