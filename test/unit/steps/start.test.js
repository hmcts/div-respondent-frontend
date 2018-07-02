const modulePath = 'steps/start/Start.step';

const example = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    return content(example);
  });
});
