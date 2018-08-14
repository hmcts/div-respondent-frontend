const modulePath = 'middleware/setLocalsMiddleware';

const { idamLoggedin } = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {

  it('checks if user is logged in', () => {
    const next = sinon.stub();
    const res = { 
      locals : {
        isLoggedIn : true
      }
    }
    const req = { idam : {} };
    idamLoggedin(req, res, next);
    expect(next.calledOnce).to.eql(true);
  });
});
