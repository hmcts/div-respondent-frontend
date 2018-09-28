const modulePath = 'middleware/loadMiniPetition';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const { loadMiniPetition } = require(modulePath);

describe(modulePath, () => {
  it('sets the oposite divorceWho if NOT same sex couple', done => {
    const req = {
      cookies: { '__auth-token': 'test' },
      get: sinon.stub(),
      session: {
        petition: {
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
      }
    };

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
      session: {
        petition: {
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
      }
    };

    const next = () => {
      expect(req.session.referenceNumber)
        .to
        .eql(1234);
      expect(req.session.divorceCenterName)
        .to
        .eql('East Midlands Regional Divorce Centre');
      done();
    };

    loadMiniPetition(req, {}, next);
  });
});