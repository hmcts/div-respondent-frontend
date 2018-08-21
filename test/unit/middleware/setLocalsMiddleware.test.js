const modulePath = 'middleware/setLocalsMiddleware';
const { idamLoggedin } = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('checks if user is logged in', () => {
    const next = sinon.stub();
    const res = {
      locals: {}
    };
    const req = { idam: {} };
    idamLoggedin(req, res, next);
    expect(res.locals.isLoggedIn).to.eql(true);
    expect(next.calledOnce).to.eql(true);
  });
  it('checks if user is NOT logged in', () => {
    const next = sinon.stub();
    const res = {};
    const req = {};
    idamLoggedin(req, res, next);
    expect(next.calledOnce).to.eql(true);
    expect(res.locals.isLoggedIn).to.eql(false);
  });
});