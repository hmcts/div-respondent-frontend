const modulePath = 'middleware/petitionMiddleware';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const { loadMiniPetition: petitionMiddleware } = require(modulePath);
const caseOrchestration = require('services/caseOrchestration');
// eslint-disable-next-line max-len
const completedMock = require('mocks/services/case-orchestration/retrieve-aos-case/case-progressed/not-defended');
const CaptureCaseAndPin = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const ProgressBar = require('steps/progress-bar/ProgressBar.step');

describe(modulePath, () => {
  afterEach(() => {
    caseOrchestration.getPetition.restore();
  });

  it('redirects to capture case and pin if no case is found', done => {
    // given
    const req = sinon.stub();
    const res = {
      redirect: sinon.spy()
    };
    const next = sinon.stub();

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: 404
      });

    // when
    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.withArgs(CaptureCaseAndPin.path).calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('calls correct methods based on caseOrchestration service calls', done => {
    // given
    const req = sinon.stub();
    const res = {
      redirect: sinon.spy()
    };
    const next = sinon.stub();
    req.session = {};

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: 200,
        body: completedMock
      });

    // when
    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.withArgs(ProgressBar.path).calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('throws an error on unexpected response', done => {
    // given
    const req = sinon.stub();
    const res = sinon.stub();
    const next = sinon.spy();

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: 500
      });

    // when
    petitionMiddleware(req, res, next)
      .then(() => {
        expect(next.calledOnce).to.be.true;
        expect(next.getCall(0).args[0])
          .to
          .be
          .an('Error');
      })
      .then(done, done);
  });

  it('sets the opposite divorceWho if NOT same sex couple', done => {
    const req = {
      cookies: { '__auth-token': 'test' },
      get: sinon.stub(),
      session: {}
    };

    const response = {
      statusCode: 200,
      body: {
        state: 'AosStarted',
        caseId: 1234,
        data: { // eslint-disable-line id-blacklist
          marriageIsSameSexCouple: 'No',
          divorceWho: 'husband',
          courts: 'eastMidlands',
          court: {
            eastMidlands: {
              divorceCentre: 'East Midlands Regional Divorce Centre'
            }
          }
        }
      }
    };
    sinon.stub(caseOrchestration, 'getPetition')
      .resolves(response);

    const next = () => {
      expect(req.session.divorceWho)
        .to
        .eql('wife');
      done();
    };

    petitionMiddleware(req, {}, next);
  });
  it('sets the case id, court name, po box, city, post code and street', done => {
    const req = {
      cookies: { '__auth-token': 'test' },
      get: sinon.stub(),
      session: {}
    };

    const response = {
      statusCode: 200,
      body: {
        state: 'AosStarted',
        caseId: 1234,
        data: { // eslint-disable-line id-blacklist
          marriageIsSameSexCouple: 'No',
          divorceWho: 'husband',
          courts: 'eastMidlands',
          court: {
            eastMidlands: {
              divorceCentre: 'East Midlands Regional Divorce Centre',
              poBox: 'PO Box 10447',
              courtCity: 'Nottingham',
              postCode: 'NG2 9QN',
              street: '21 Jump Street'
            }
          }
        }
      }
    };
    sinon.stub(caseOrchestration, 'getPetition')
      .resolves(response);

    const next = () => {
      expect(req.session.referenceNumber)
        .to
        .eql(1234);
      expect(req.session.divorceCenterName)
        .to
        .eql('East Midlands Regional Divorce Centre');
      expect(req.session.divorceCenterPoBox)
        .to
        .eql('PO Box 10447');
      expect(req.session.divorceCenterCourtCity)
        .to
        .eql('Nottingham');
      expect(req.session.divorceCenterPostCode)
        .to
        .eql('NG2 9QN');
      expect(req.session.divorceCenterStreet)
        .to
        .eql('21 Jump Street');
      done();
    };

    petitionMiddleware(req, {}, next);
  });
});