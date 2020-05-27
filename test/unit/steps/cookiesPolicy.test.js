const modulePath = 'steps/cookies-policy/CookiesPolicy.step';

const CookiesPolicy = require(modulePath);
const { middleware, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has no middleware', () => {
    return middleware.hasMiddleware(CookiesPolicy, []);
  });

  describe('values', () => {
    it('displays correct details', () => {
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
        'backLink',
        'signIn',
        'signOut',
        'languageToggle',
        'thereWasAProblem'
      ];

      return content(CookiesPolicy, {}, { ignoreContent });
    });
  });
});
