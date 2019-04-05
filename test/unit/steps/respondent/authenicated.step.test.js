const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const Respond = require('steps/respondent/respond/Respond.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');
const config = require('config');
const SystemMessage = require('steps/system-message/SystemMessage.step');

describe(modulePath, () => {
  const sandbox = sinon.createSandbox();

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

    describe('showSystemMessage feature off', () => {
      before(() => {
        sandbox.replace(config.features, 'showSystemMessage', false);
      });

      after(() => {
        sandbox.restore();
      });

      it('to respond page', () => {
        return redirect.navigatesToNext(Authenticated, Respond);
      });
    });

    describe('showSystemMessage feature on', () => {
      before(() => {
        sandbox.replace(config.features, 'showSystemMessage', true);
      });

      after(() => {
        sandbox.restore();
      });

      it('to respond page', () => {
        return redirect.navigatesToNext(Authenticated, SystemMessage);
      });
    });
  });
});
