const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const nock = require('nock');
const CONF = require('config');
const httpStatus = require('http-status-codes');

const Equality = require('steps/equality/Equality.step');

const modulePath = 'middleware/equality';
const equalityMiddleware = require(modulePath);

const timoutMs = 100;
let req = {}, res = {}, next = {};

const testPcqSkipped = done => {
  setTimeout(() => {
    expect(req.session.invokePcq)
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
  const journeys = ['respondent', 'co-respondent'];

  beforeEach(() => {
    req = {
      session: {
        IdamLogin: { success: '' }
      },
      method: 'POST'
    };
    res = { redirect: sinon.stub() };
    next = sinon.stub();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  journeys.forEach(j => {
    describe(j, () => {
      beforeEach(() => {
        req.session.IdamLogin.success = j;
        req.session.featureToggles = { [Equality.toggleKey(req)]: true };
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
          expect(req.session.invokePcq)
            .to
            .equal(true);
          done();
        }, timoutMs);
      });

      it('skips PCQ if it\'s not enabled', done => {
        nock(pcqHost)
          .get('/health')
          .reply(httpStatus.OK, { status: 'UP' });

        req.session.featureToggles[Equality.toggleKey(req)] = false;

        equalityMiddleware(req, res, next);
        testPcqSkipped(done);
      });

      it('skips PCQ if the pcqId is already in session', done => {
        nock(pcqHost)
          .get('/health')
          .reply(httpStatus.OK, { status: 'UP' });

        req.session[Equality.pcqIdPropertyName(req)] = 'abc123';

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
  });
});
