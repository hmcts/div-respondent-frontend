const modulePath = 'steps/invalid-case-state/InvalidCaseState.step';

const InvalidCaseState = require(modulePath);
const { middleware, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has no middleware', () => {
    return middleware.hasMiddleware(InvalidCaseState, []);
  });

  it('renders the page on GET', () => {
    return content(InvalidCaseState, {}, {
      ignoreContent: [
        'continue',
        'backLink'
      ]
    });
  });
});
