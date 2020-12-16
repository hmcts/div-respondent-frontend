const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

const modulePath = 'middleware/redirectMiddleware';

const redirectMiddleware = require(modulePath);

const authTokenString = '__auth-token';
const dnFrontend = config.services.dnFrontend;
const queryString = `?${authTokenString}=authToken`;
const expectedUrl = `${dnFrontend.url}${dnFrontend.landing}${queryString}`;

describe(modulePath, () => {
  let res = {}, next = {};

  beforeEach(() => {
    res = {
      redirect: sinon.stub(),
      set: sinon.stub()
    };
    next = sinon.stub();
  });

  it('should call next when there is no session', () => {
    const req = {};

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(true);
  });

  it('should call next when there is no petition', () => {
    const req = {
      session: {}
    };

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(true);
  });

  it('should call next when user is respondent', () => {
    const email = 'some@email.address';
    const req = {
      cookies: { '__auth-token': 'authToken' },
      session: {
        originalPetition: { respEmailAddress: email }
      },
      idam: {
        userDetails: { email }
      }
    };

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(true);
  });

  it('should direct to DN if user is not respondent', () => {
    const email = 'some@email.address';
    const req = {
      cookies: { '__auth-token': 'authToken' },
      session: {
        originalPetition: {
          petitionerEmail: email
        }
      },
      idam: {
        userDetails: { email }
      }
    };

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(false);
    expect(res.redirect.calledWith(expectedUrl)).to.eql(true);
  });

  describe('Redirections to DN app', () => {
    const stateToRedirectToDn = ['AwaitingGeneralReferralPayment', 'GeneralConsiderationComplete'];

    stateToRedirectToDn.forEach(caseState => {
      it(`should redirect to DN when state is ${caseState}`, () => {
        const email = 'user@email.com';
        const req = {
          cookies: { '__auth-token': 'authToken' },
          session: {
            caseState,
            originalPetition: {
              respEmailAddress: email
            }
          },
          idam: {
            userDetails: { email }
          }
        };

        redirectMiddleware.redirectOnCondition(req, res, next);

        expect(next.calledOnce).to.eql(false);
        expect(res.redirect.calledWith(expectedUrl)).to.eql(true);
      });
    });
  });
});
