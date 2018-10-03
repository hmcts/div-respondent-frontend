const request = require('request-promise-native');

const modulePath = 'services/sendAosResponse.js';
const sendAosResponse = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const CONF = require('config');

const defaultEnv = CONF.environment;

describe(modulePath, () => {
  const userToken = 'test';
  beforeEach(() => {
    sinon.stub(request, 'post').resolves({});
    CONF.environment = 'unittest';
  });

  afterEach(() => {
    request.post.restore();
    CONF.environment = defaultEnv;
  });

  it('sends the user token and the body along with the request', () => {
    // Arrange.
    const body = { foo: 'bar' };
    const req = {
      cookies: { '__auth-token': 'test' },
      session: { referenceNumber: 123456789 }
    };
      // Act.
    sendAosResponse(req, body);
    // Assert.
    expect(request.post.args[0][0]).to.eql({
      uri: `${CONF.services.caseOrchestration.submitAosUrl}/123456789`,
      body,
      headers: { Authorization: `${userToken}` },
      json: true
    });
  });
});