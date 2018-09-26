const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

const modulePath = 'middleware/authenticated.js';
const middleware = require(modulePath);

describe(modulePath, () => {
  it('calls next', done => {
    const next = sinon.stub();
    middleware.captureCaseAndPin({}, {}, next);

    expect(next.calledOnce)
      .to
      .eq(true);

    done();
  });
});