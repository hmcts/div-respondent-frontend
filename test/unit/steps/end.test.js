const modulePath = 'steps/end/End.step';

const End = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    return content(End);
  });
});
