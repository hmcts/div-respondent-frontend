const request = require('request-promise-native');

const modulePath = 'services/caseOrchestration.js';
const caseOrcestration = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  afterEach(() => {
    request.get.restore();
  });

  it('can get petition', done => {
    const req = {
      cookies: { '__auth-token': 'test' }
    };

    sinon.stub(request, 'get')
      .resolves({});

    caseOrcestration.getPetition(req);

    expect(request.get.calledOnce)
      .to
      .eq(true);

    done();
  });
});