const modulePath = 'steps/equality/Equality.step';
const nock = require('nock');
const rewire = require('rewire');
const config = require('config');
const httpStatus = require('http-status-codes');

const Equality = rewire(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  let req = {};
  let res = {};
  const pcqHost = config.services.equalityAndDiversity.url;

  beforeEach(() => {
    req = {
      journey: {},
      idam: { userDetails: { email: 'test+test@test.com' } },
      headers: { host: 'localhost' }
    };
    res = {
      redirect: sinon.spy()
    };
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe.skip('Respondent', () => {
    it('redirects to PCQ with the correct parameters', done => {
      nock(pcqHost)
        .get('/health')
        .reply(httpStatus.OK, { status: 'UP' });

      req.session = {
        entryPoint: 'Respond',
        referenceNumber: '123abc'
      };

      Equality.__set__('uuidv4', () => {
        return 'r123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.args[0][0]).to.satisfy(str => str.startsWith(
          // eslint-disable-next-line max-len
          'http://localhost:4000/service-endpoint?serviceId=DIVORCE&actor=RESPONDENT&pcqId=r123&ccdCaseId=123abc&partyId=test%2Btest%40test.com&returnUrl=localhost/check-your-answers&language=en&token='
        ));
        done();
      }, 100);
    });

    it('values() returns the correct pcqId', done => {
      nock(pcqHost)
        .get('/health')
        .reply(httpStatus.OK, { status: 'UP' });

      req.session = {
        entryPoint: 'Respond',
        referenceNumber: 'refNumber'
      };

      Equality.__set__('uuidv4', () => {
        return 'r123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(step.values()).to.deep.equal({
          respondentPcqId: 'r123'
        });
        done();
      }, 100);
    });

    it('skips PCQ if it is unhealthy', done => {
      nock(pcqHost)
        .get('/health')
        .reply(httpStatus.OK, { status: 'DOWN' });

      req.session = {
        entryPoint: 'Respond',
        referenceNumber: '123abc'
      };

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(false);
        done();
      }, 100);
    });

    it('skips PCQ if there is an error retrieving the PCQ health', done => {
      req.session = {
        entryPoint: 'Respond',
        referenceNumber: '123abc'
      };

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(false);
        done();
      }, 100);
    });

    it('answers() returns an empty array', () => {
      req.session = {
        entryPoint: 'Respond',
        referenceNumber: '123abc'
      };

      const step = new Equality(req, res);
      step.handler(req, res);

      expect(step.answers()).to.deep.equal([]);
    });
  });

  describe('Co-Respondent', () => {
    it('redirects to PCQ with the correct parameters', done => {
      nock(pcqHost)
        .get('/health')
        .reply(httpStatus.OK, { status: 'UP' });

      req.session = {
        entryPoint: 'CrRespond',
        referenceNumber: '123abc'
      };

      Equality.__set__('uuidv4', () => {
        return 'cr123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.args[0][0]).to.satisfy(str => str.startsWith(
          // eslint-disable-next-line max-len
          'http://localhost:4000/service-endpoint?serviceId=DIVORCE&actor=CORESPONDENT&pcqId=cr123&ccdCaseId=123abc&partyId=test%2Btest%40test.com&returnUrl=localhost/co-respondent/check-your-answers&language=en&token='
        ));
        done();
      }, 100);
    });

    it('values() returns the correct pcqId', done => {
      nock(pcqHost)
        .get('/health')
        .reply(httpStatus.OK, { status: 'UP' });

      req.session = {
        entryPoint: 'CrRespond',
        referenceNumber: 'refNumber'
      };

      Equality.__set__('uuidv4', () => {
        return 'cr123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(step.values()).to.deep.equal({
          coRespondentPcqId: 'cr123'
        });
        done();
      }, 100);
    });

    it('skips PCQ if it is unhealthy', done => {
      nock(pcqHost)
        .get('/health')
        .reply(httpStatus.OK, { status: 'DOWN' });

      req.session = {
        entryPoint: 'CrRespond',
        referenceNumber: '123abc'
      };

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(false);
        done();
      }, 100);
    });

    it('skips PCQ if there is an error retrieving the PCQ health', done => {
      req.session = {
        entryPoint: 'CrRespond',
        referenceNumber: '123abc'
      };

      const step = new Equality(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(false);
        done();
      }, 100);
    });

    it('answers() returns an empty array', () => {
      req.session = {
        entryPoint: 'CrRespond',
        referenceNumber: '123abc'
      };

      const step = new Equality(req, res);
      step.handler(req, res);

      expect(step.answers()).to.deep.equal([]);
    });
  });
});
