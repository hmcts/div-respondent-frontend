const request = require('request-promise-native');

const modulePath = 'services/getCcdData.js';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

let res = {}; // eslint-disable-line no-unused-vars

describe(modulePath, () => {
  beforeEach(() => {
    res = {
      redirect: sinon.stub()
    };
  });

  afterEach(() => {
    request.get.restore();
  });

  it('', done => {
    const req = {
      cookies: { '__auth-token': 'test' }
    };

    sinon.stub(request, 'get')
      .resolves({});

    request.get(req);

    expect(request.get.calledOnce)
      .to
      .eq(true);

    done();
  });
});