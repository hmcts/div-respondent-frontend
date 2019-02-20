const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const Respond = require('steps/respondent/respond/Respond.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'landingPage').callsFake(middleware.nextMock);
    });

    afterEach(() => {
      idam.landingPage.restore();
    });

    it('to respond page', () => {
      return redirect.navigatesToNext(Authenticated, Respond);
    });
  });
});
