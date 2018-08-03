const modulePath = 'steps/respond/Respond.step';

const Respond = require(modulePath);
const End = require('steps/end/End.step.js');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Respond, [ idam.protect() ]);
  });

  it('renders the page on GET', () => {
    return content(End);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'protect').returns(middleware.nextMock);
    });

    afterEach(() => {
      idam.protect.restore();
    });

    it('to end page', () => {
      return interstitial.navigatesToNext(Respond, End);
    });
  });
});
