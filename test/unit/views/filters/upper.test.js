const modulePath = 'views/filters/upper';

const { expect } = require('@hmcts/one-per-page-test-suite');
const upper = require(modulePath);

describe(modulePath, () => {
  it('should the string in upper case', () => {
    const string = 'this is some text';
    const stringFormatted = string.toUpperCase();
    expect(upper.upper(string)).to.eql(stringFormatted);
  });
});
