const request = require('request-promise-native');

const modulePath = 'services/caseOrchestration.js';
const caseOrcestration = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

describe(modulePath, () => {
  afterEach(() => {
    request.post.restore();
  });

  it('can link respondent to petition', done => {
    // given
    const req = {
      cookies: { '__auth-token': 'test' },
      body: {
        referenceNumber: '1234567890123456',
        securityAccessCode: '1234'
      },
      session: {}
    };

    sinon.stub(request, 'post')
      .resolves({});

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
            uri: 'http://localhost:3001/case-orchestration/link-respondent/1234567890123456/1234'
          });
      })
      .then(done, done);
  });

  it('authError is set in session if response is 403', done => {
    // given
    const req = {
      cookies: { '__auth-token': 'test' },
      body: {
        referenceNumber: '1234567890123456',
        securityAccessCode: '1234'
      },
      session: {}
    };

    sinon.stub(request, 'post')
      .rejects({ statusCode: 403 });

    // when
    caseOrcestration.linkCase(req)
      .then(() => {
        expect(req.session.authError).to.be.true;
      })
      .then(() => {
        done();
      }, () => {
        done();
      });
  });

  it('sends the user token and the body along with the request', () => {
    // Arrange.
    const body = { foo: 'bar' };
    const req = {
      cookies: { '__auth-token': 'test' },
      session: { referenceNumber: 123456789 }
    };

    sinon.stub(request, 'post')
      .resolves({});

    // Act.
    caseOrcestration.sendAosResponse(req, body);
    // Assert.
    expect(request.post.args[0][0]).to.eql({
      uri: `${config.services.caseOrchestration.baseUrl}/submit-aos/123456789`,
      body,
      headers: { Authorization: 'test' },
      json: true
    });
  });

  it('throws error when send response fails', done => {
    // Arrange.
    const body = { foo: 'bar' };
    const req = {
      cookies: { '__auth-token': 'test' },
      session: { referenceNumber: 123456789 }
    };

    sinon.stub(request, 'post')
      .rejects({});

    // Act.
    caseOrcestration.sendAosResponse(req, body)
      .then(() => {
        Promise.reject(new Error('should not come here'));
      }, () => {
        done();
      });
  });

  it('can  co-respondent send the petition', done => {
    // given
    const req = {
      cookies: { '__auth-token': 'Bearer test' },
      session: { referenceNumber: 123456789 }
    };
    const body = { foo: 'bar' };

    sinon.stub(request, 'post')
      .resolves({});

    // when
    caseOrcestration.sendCoRespondentResponse(req, body)
      .then(() => {
        expect(request.post.calledOnce).to.be.true;

        expect(request.post.getCall(0).args[0])
          .to
          .eql({
            headers: {
              Authorization: 'Bearer test'
            },
            body,
            json: true,
            uri: 'http://localhost:3001/case-orchestration/submit-co-respondent-aos'
          });
      })
      .then(done, done);
  });

  it('throws error when co-respondent response fails', done => {
    const body = { foo: 'bar' };
    const req = {
      cookies: { '__auth-token': 'test' },
      session: { referenceNumber: 123456789 }
    };

    sinon.stub(request, 'post')
      .rejects({});

    // Act.
    caseOrcestration.sendCoRespondentResponse(req, body)
      .then(() => {
        Promise.reject(new Error('should not come here'));
      }, () => {
        done();
      });
  });
});
