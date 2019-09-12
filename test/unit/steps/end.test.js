const modulePath = 'steps/end/End.step';

const End = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(End, [ idam.protect(), idam.logout() ]);
  });

  describe('values', () => {
    it('displays Correct details', () => {
      const ignoreContent = [
        'continue',
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'serviceName',
        'backLink'
      ];

      return content(End, {}, { ignoreContent });
    });
  });
});
