const modulePath = 'services/documentHandler.js';

const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const underTest = require(modulePath);
const config = require('config');

describe(modulePath, () => {
  it('returns `bind` function so it can bootstrap with One Per Page', () => {
    expect(underTest.hasOwnProperty('bind'));
  });

  it('adds route to app', () => {
    const app = { use: sinon.stub() };
    underTest.bind(app);
    expect(app.use.calledOnce).to.eql(true);
  });

  it('returns documentWhiteList for coRespondent', () => {
    const req = {
      idam: {
        userDetails: {
          email: 'coRespondent@email.address'
        }
      },
      session: {
        originalPetition: {
          coRespondentAnswers: {
            contactInfo: {
              emailAddress: 'coRespondent@email.address'
            }
          }
        }
      }
    };
    const whiteList = underTest.documentWhiteList(req);
    expect(whiteList).to.eql(config.filesWhiteList.coRespondent);
  });

  it('returns documentWhiteList for respondent', () => {
    const req = {
      idam: {
        userDetails: {
          email: 'respondent@email.address'
        }
      },
      session: { originalPetition: {} }
    };
    const whiteList = underTest.documentWhiteList(req);
    expect(whiteList).to.eql(config.filesWhiteList.respondent);
  });
});