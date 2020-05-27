const modulePath = 'steps/terms-and-conditions/TermsAndConditions.step';

const TermsAndConditions = require(modulePath);
const { middleware, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has no middleware', () => {
    return middleware.hasMiddleware(TermsAndConditions, []);
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

      return content(TermsAndConditions, {}, { ignoreContent });
    });
  });
});
