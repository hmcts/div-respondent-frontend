const modulePath = 'middleware/petitionMiddleware';
const config = require('config');
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const { loadMiniPetition: petitionMiddleware } = require(modulePath);
const caseOrchestration = require('services/caseOrchestration');
// eslint-disable-next-line max-len
const completedMock = require(
  'mocks/services/case-orchestration/retrieve-aos-case/case-progressed/not-defended'
);
const coRespondentMock = require(
  'mocks/services/case-orchestration/retrieve-aos-case/mock-co-respondent'
);

const coRespondentNotDefendingMock = require(
  'mocks/services/case-orchestration/retrieve-aos-case/mock-coRespNotDefending'
);
const CaptureCaseAndPin = require('steps/capture-case-and-pin/CaptureCaseAndPin.step');
const ProgressBar = require('steps/respondent/progress-bar/ProgressBar.step');
const crProgressBar = require('steps/co-respondent/cr-progress-bar/CrProgressBar.step');
const crRespond = require('steps/co-respondent/cr-respond/CrRespond.step');
const httpStatus = require('http-status-codes');

const authTokenString = '__auth-token';

describe(modulePath, () => {
  afterEach(() => {
    caseOrchestration.getPetition.restore();
  });

  it('redirects to capture case and pin if no case is found', done => {
    const req = sinon.stub();
    const res = {
      redirect: sinon.spy()
    };
    const next = sinon.stub();

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: httpStatus.NOT_FOUND
      });

    // when
    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.withArgs(CaptureCaseAndPin.path).calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('redirects to capture case and pin if case found, state: AosAwaiting', done => {
    const req = {
      cookies: { '__auth-token': 'test' },
      get: sinon.stub(),
      session: {}
    };
    const res = {
      redirect: sinon.spy()
    };
    const next = sinon.stub();

    const response = {
      statusCode: 200,
      body: {
        state: 'AosAwaiting',
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

    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.withArgs(CaptureCaseAndPin.path).calledOnce).to.be.true;
      })
      .then(done, done);
  });


  it('redirects to Decree Absolute FE if case found, state: DivorceGranted', done => {
    const req = {
      cookies: { '__auth-token': 'test' },
      get: sinon.stub(),
      session: {}
    };
    const res = {
      redirect: sinon.spy()
    };
    const next = sinon.stub();

    const response = {
      statusCode: 200,
      body: {
        state: 'DivorceGranted',
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

    const daAppLandingPage = `${config.services.daFrontend.url}${config.services.daFrontend.landing}`;
    const daQueryString = `?${authTokenString}=${req.cookies[authTokenString]}`;
    const expectedUrl = `${daAppLandingPage}${daQueryString}`;

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves(response);

    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.calledWith(expectedUrl)).to.equal(true);
      })
      .then(done, done);
  });

  it('should redirect to Co-respondent respond page if user is Co-respondent', done => {
    const email = 'user@email.com';
    const req = {
      cookies: { '__auth-token': 'authToken' },
      idam: {
        userDetails: { email }
      }
    };
    const res = {
      redirect: sinon.spy()
    };

    const next = sinon.stub();
    req.session = {};

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: httpStatus.OK,
        body: coRespondentMock
      });

    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.withArgs(crRespond.path).calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('To Co-resp progress page if CoResp user submitted response', done => {
    const email = 'user@email.com';
    const req = {
      cookies: { '__auth-token': 'authToken' },
      idam: {
        userDetails: { email }
      }
    };
    const res = {
      redirect: sinon.spy()
    };
    const next = sinon.stub();
    req.session = {};

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: httpStatus.OK,
        body: coRespondentNotDefendingMock
      });

    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.withArgs(crProgressBar.path).calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('calls correct methods based on caseOrchestration service calls', done => {
    const req = sinon.stub();
    const res = {
      redirect: sinon.spy()
    };
    const next = sinon.stub();
    req.session = {};

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: httpStatus.OK,
        body: completedMock
      });

    petitionMiddleware(req, res, next)
      .then(() => {
        expect(res.redirect.withArgs(ProgressBar.path).calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('throws an error on unexpected response', done => {
    const req = sinon.stub();
    const res = sinon.stub();
    const next = sinon.spy();

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR
      });

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
        caseReference: 'LV17D80999',
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