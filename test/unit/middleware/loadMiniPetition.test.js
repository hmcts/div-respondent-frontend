const request = require('request-promise-native');

const modulePath = 'middleware/loadMiniPetition';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const loadMiniPetition = require(modulePath);

let res = {}; // eslint-disable-line no-unused-vars

describe(modulePath, () => {
  beforeEach(() => {
    res = {
      redirect: sinon.stub()
    };
  });

  afterEach(() => {
    request.get.restore();
  });

  it('sets the oposite divorceWho if NOT same sex couple', done => {
    const req = {
      cookies: { '__auth-token': 'test' },
      get: sinon.stub(),
      session: {}
    };

    sinon.stub(request, 'get')
      .resolves({
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
      );

    const next = () => {
      expect(req.session.divorceWho)
        .to
        .eql('wife');
      done();
    };

    loadMiniPetition(req, {}, next);
  });
  it('sets the case id and court name', done => {
    const req = {
      cookies: { '__auth-token': 'test' },
      get: sinon.stub(),
      session: {}
    };

    sinon.stub(request, 'get')
      .resolves({
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
      );

    const next = () => {
      expect(req.session.referenceNumber)
        .to
        .eql(324234342342);
      expect(req.session.divorceCenterName)
        .to
        .eql('East Midlands Regional Divorce Centre');
      done();
    };

    loadMiniPetition(req, {}, next);
  });
});