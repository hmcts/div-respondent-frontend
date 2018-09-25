const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const RespondWithPin = require('steps/respond-with-pin/RespondWithPin.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage() ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'landingPage').returns(middleware.nextMock);
    });

    afterEach(() => {
      idam.landingPage.restore();
    });

    it('to respond page', () => {
      return redirect.navigatesToNext(Authenticated, RespondWithPin);
    });
  });
});
