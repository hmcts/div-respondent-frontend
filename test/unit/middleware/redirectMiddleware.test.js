const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const config = require('config');
const crRespond = require('steps/corespondent/cr-respond/CrRespond.step');

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


  it('should redirect to Corespondent respond page if user is Corespondent', () => {
    const email = 'some@email.address';
    const req = {
      cookies: { '__auth-token': 'authToken' },
      session: {
        originalPetition: {
          coRespEmailAddress: email
        }
      },
      idam: {
        userDetails: { email }
      }
    };

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(res.redirect.withArgs(crRespond.path).calledOnce).to.be.true;
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
});
