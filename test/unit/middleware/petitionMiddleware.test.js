const modulePath = 'middleware/petitionMiddleware';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const { loadMiniPetition: petitionMiddleware } = require(modulePath);
const caseOrchestration = require('services/caseOrchestration');

describe(modulePath, () => {
  afterEach(() => {
    caseOrchestration.getPetition.restore();
  });

  it('redirects to capture case and pin if no case is found', done => {
    // given
    const req = sinon.stub();
    const res = {
      redirect: sinon.stub()
    };
    const next = sinon.stub();

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: 404
      });

    // when
    petitionMiddleware(req, res, next)
      .then(() => {
        expect(caseOrchestration.getPetition.calledOnce).to.be.true;
        expect(res.redirect.calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('redirects to invalid case state page if case state is not AosStarted', done => {
    // given
    const req = sinon.stub();
    const res = {
      redirect: sinon.stub()
    };
    const next = sinon.stub();

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: 200,
        body: {
          state: 'AosCompleted'
        }
      });

    // when
    petitionMiddleware(req, res, next)
      .then(() => {
        expect(caseOrchestration.getPetition.calledOnce).to.be.true;
        expect(res.redirect.calledOnce).to.be.true;
      })
      .then(done, done);
  });

  it('throws an error on unexpected response', done => {
    // given
    const req = sinon.stub();
    const res = sinon.stub();
    const next = sinon.stub();

    sinon.stub(caseOrchestration, 'getPetition')
      .resolves({
        statusCode: 500
      });

    // when
    petitionMiddleware(req, res, next)
      .then(() => {
        expect(caseOrchestration.getPetition.calledOnce).to.be.true;
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
  it('sets the case id and court name', done => {
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
      expect(req.session.referenceNumber)
        .to
        .eql(1234);
      expect(req.session.divorceCenterName)
        .to
        .eql('East Midlands Regional Divorce Centre');
      done();
    };

    petitionMiddleware(req, {}, next);
  });
});