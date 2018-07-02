const modulePath = 'services/rateLimiter';

const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const proxyquire = require('proxyquire');

const previousRateLimiterEnbaled = config.services.rateLimiter.enabled;

describe(modulePath, () => {
  let limiter = {};
  let expressLimiterStub = null;
  let stubbedJourney = {};

  beforeEach(() => {
    limiter = sinon.stub();
    expressLimiterStub = sinon.stub().returns(limiter);
    stubbedJourney = proxyquire(
      modulePath,
      { 'express-limiter': expressLimiterStub }
    );
  });

  after(() => {
    config.services.rateLimiter.enabled = previousRateLimiterEnbaled;
  });

  it('should add the rater limiter', () => {
    config.services.rateLimiter.enabled = true;

    stubbedJourney = proxyquire(
      modulePath,
      { 'express-limiter': expressLimiterStub }
    );

    stubbedJourney();
    expect(expressLimiterStub.calledOnce).to.eql(true);
    expect(limiter.calledOnce).to.eql(true);
  });

  it('should not add the rater limiter', () => {
    config.services.rateLimiter.enabled = false;

    stubbedJourney = proxyquire(
      modulePath,
      { 'express-limiter': expressLimiterStub }
    );

    stubbedJourney();
    expect(expressLimiterStub.calledOnce).to.eql(false);
    expect(limiter.calledOnce).to.eql(false);
  });
});
