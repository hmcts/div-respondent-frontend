const request = require('request-promise-native');

const modulePath = 'services/feesAndPaymentsService.js';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const underTest = require(modulePath);

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(request, 'get').resolves();
  });

  afterEach(() => {
    request.get.restore();
  });

  it('should call the fee and payments service', done => {
    underTest.get({})
      .then(() => {
        expect(request.get.calledOnce).to.eql(true);
      })
      .then(done, done);
  });
});