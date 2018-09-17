const modulePath = 'steps/start/Start.step';

const Start = require(modulePath);
const { middleware, content, expect } = require('@hmcts/one-per-page-test-suite');

const idam = require('services/idam');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    return content(Start, {}, { ignoreContent: [
      'continue',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'backLink'
    ] });
  });

  it('ignores pa11y warnings', () => {
    expect(Start.ignorePa11yWarnings).to.include('WCAG2AA.Principle1.Guideline1_3.1_3_1.H48');
  });

  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Start, [ idam.setRedirectUri ]);
  });
});
