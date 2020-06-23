const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const nock = require('nock');
const CONF = require('config');
const httpStatus = require('http-status-codes');

const modulePath = 'middleware/equality';
const equalityMiddleware = require(modulePath);

const timoutMs = 100;
let req = {}, res = {}, next = {};

const testPcqSkipped = done => {
  setTimeout(() => {
    expect(req.session.pcq.invoke)
      .to
      .equal(false);
    expect(next.calledOnce)
      .to
      .equal(true);
    done();
  }, timoutMs);
};

describe(modulePath, () => {
  const pcqHost = CONF.services.equalityAndDiversity.url;

  beforeEach(() => {
    req = {
      session: {
        pcq: {},
        featureToggles: { ft_pcq: true }
      }
    };
    res = { redirect: sinon.stub() };
    next = sinon.stub();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls next if PCQ is enabled, pcqId is not set and PCQ is healthy', done => {
    nock(pcqHost)
      .get('/health')
      .reply(httpStatus.OK, { status: 'UP' });

    equalityMiddleware(req, res, next);

    setTimeout(() => {
      expect(next.calledOnce)
        .to
        .equal(true);
      expect(res.redirect.calledOnce)
        .to
        .equal(false);
      expect(req.session.pcq.invoke)
        .to
        .equal(true);
      done();
    }, timoutMs);
  });

  it('skips PCQ if it\'s not enabled', done => {
    nock(pcqHost)
      .get('/health')
      .reply(httpStatus.OK, { status: 'UP' });

    req.session.featureToggles.ft_pcq = false;

    equalityMiddleware(req, res, next);
    testPcqSkipped(done);
  });

  it('skips PCQ if the pcqId is already in session', done => {
    nock(pcqHost)
      .get('/health')
      .reply(httpStatus.OK, { status: 'UP' });

    req.session.pcq.id = 'abc123';

    equalityMiddleware(req, res, next);
    testPcqSkipped(done);
  });

  it('skips PCQ if PCQ is unhealthy', done => {
    nock(pcqHost)
      .get('/health')
      .reply(httpStatus.OK, { status: 'DOWN' });

    equalityMiddleware(req, res, next);
    testPcqSkipped(done);
  });

  it('skips PCQ if there is an error retrieving the PCQ health', done => {
    equalityMiddleware(req, res, next);
    testPcqSkipped(done);
  });
});
