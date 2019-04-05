const modulePath = 'steps/entry/Entry.step';

const Entry = require(modulePath);
const Respond = require('steps/respondent/respond/Respond.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');
const SystemMessage = require('steps/system-message/SystemMessage.step');
const config = require('config');

describe(modulePath, () => {
  const sandbox = sinon.createSandbox();

  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Entry, [ idam.authenticate ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'authenticate').callsFake(middleware.nextMock);
    });

    afterEach(() => {
      idam.authenticate.restore();
    });

    describe('showSystemMessage feature off', () => {
      before(() => {
        sandbox.replace(config.features, 'showSystemMessage', false);
      });

      after(() => {
        sandbox.restore();
      });

      it('to respond page', () => {
        return redirect.navigatesToNext(Entry, Respond);
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
        return redirect.navigatesToNext(Entry, SystemMessage);
      });
    });

    it('to respond page', () => {
      return redirect.navigatesToNext(Entry, Respond);
    });
  });
});
