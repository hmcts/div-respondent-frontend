const modulePath = 'steps/entry/Entry.step';

const Entry = require(modulePath);
const Protected = require('steps/protected/Protected.step.js');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Entry, [ idam.authenticate() ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'authenticate').returns(middleware.nextMock);
    });

    afterEach(() => {
      idam.authenticate.restore();
    });

    it('to protected page', () => {
      return redirect.navigatesToNext(Entry, Protected);
    });
  });
});
