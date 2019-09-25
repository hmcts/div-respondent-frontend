const modulePath = 'views/filters/lineBreakToComma';

const { expect } = require('@hmcts/one-per-page-test-suite');
const lineBreakToComma = require(modulePath);

describe(modulePath, () => {
  it('replace line breaks with commas', () => {
    const string = 'this is\r\nsome\r\ntext';
    const stringFormatted = string.replace(/\r\n/gi, ', ');
    expect(lineBreakToComma.lineBreakToComma(string)).to.eql(stringFormatted);
  });
});
