const request = require('request-promise-native');

const modulePath = 'services/caseOrchestration.js';
const caseOrcestration = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  before(() => {
    sinon.stub(request, 'post')
      .resolves({});
  });

  after(() => {
    request.post.restore();
  });

  it('can link respondent to petition', done => {
    // given
    const req = {
      cookies: { '__auth-token': 'test' },
      body: {
        referenceNumber: '1234567890123456',
        securityAccessCode: '1234'
      }
    };

    // when
    caseOrcestration.linkCase(req)
      .then(() => {
        expect(request.post.calledOnce).to.be.true;

        expect(request.post.getCall(0).args[0])
          .to
          .eql({
            headers: {
              Authorization: 'Bearer test'
            },
            uri: 'https://localhost:3001/link-respondent/1234567890123456/1234'
          });
      })
      .then(done, done);
  });
});
