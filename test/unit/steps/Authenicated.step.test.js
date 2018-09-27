const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const authenticatedMiddleware = require('middleware/authenticated');
const Respond = require('steps/respond/Respond.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'landingPage')
      .returns(middleware.nextMock);
    sinon.stub(authenticatedMiddleware, 'captureCaseAndPin')
      .callsFake(middleware.nextMock);
  });

  afterEach(() => {
    idam.landingPage.restore();
    authenticatedMiddleware.captureCaseAndPin.restore();
  });

  it('has idam.landingPage and captureCaseAndPin middleware', () => {
    return middleware.hasMiddleware(Authenticated, [
      idam.landingPage(),
      authenticatedMiddleware.captureCaseAndPin
    ]);
  });

  context('navigation', () => {
    it('to respond page', () => {
      return redirect.navigatesToNext(Authenticated, Respond);
    });
  });
});
