const modulePath = 'steps/equality/Equality.step';
const rewire = require('rewire');

const Equality = rewire(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  let req = {};
  let res = {};
  beforeEach(() => {
    req = {
      journey: {},
      idam: { userDetails: { email: 'test@test.com' } },
      headers: { host: 'localhost' }
    };
    res = {
      redirect: sinon.spy()
    };
  });
  describe('Respondent', () => {
    it('redirects to PCQ with the correct parameters', () => {
      req.session = {
        entryPoint: 'Respond',
        referenceNumber: '123abc'
      };

      Equality.__set__('uuidv4', () => {
        return 'r123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      expect(res.redirect.calledOnce).to.equal(true);
      expect(res.redirect.args[0][0]).to.satisfy(str => str.startsWith(
        // eslint-disable-next-line max-len
        'http://localhost:4000/service-endpoint?serviceId=DIVORCE&actor=RESPONDENT&pcqId=r123&ccdCaseId=123abc&partyId=test@test.com&returnUrl=localhost/check-your-answers&language=en&token='
      ));
    });

    it('values() returns the correct pcqId', () => {
      req.session = {
        entryPoint: 'Respond',
        referenceNumber: '123abc'
      };

      Equality.__set__('uuidv4', () => {
        return 'r123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      expect(step.values()).to.deep.equal({
        respondentPcqId: 'r123'
      });
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
    it('redirects to PCQ with the correct parameters', () => {
      req.session = {
        entryPoint: 'CrRespond',
        referenceNumber: '123abc'
      };

      Equality.__set__('uuidv4', () => {
        return 'cr123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      expect(res.redirect.calledOnce).to.equal(true);
      expect(res.redirect.args[0][0]).to.satisfy(str => str.startsWith(
        // eslint-disable-next-line max-len
        'http://localhost:4000/service-endpoint?serviceId=DIVORCE&actor=RESPONDENT&pcqId=cr123&ccdCaseId=123abc&partyId=test@test.com&returnUrl=localhost/co-respondent/check-your-answers&language=en&token='
      ));
    });

    it('values() returns the correct pcqId', () => {
      req.session = {
        entryPoint: 'CrRespond',
        referenceNumber: '123abc'
      };

      Equality.__set__('uuidv4', () => {
        return 'cr123';
      });

      const step = new Equality(req, res);
      step.handler(req, res);

      expect(step.values()).to.deep.equal({
        coRespondentPcqId: 'cr123'
      });
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
