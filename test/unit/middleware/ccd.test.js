const modulePath = 'middleware/ccd';

const { getUserData } = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const mockData = require('resources/mock');

describe(modulePath, () => {
  it('setts mock data on the session', () => {
    const next = sinon.stub();
    const req = { session: {} };
    getUserData(req, {}, next);

    expect(next.calledOnce).to.eql(true);
    expect(req.session).to.eql(mockData);
  });
});