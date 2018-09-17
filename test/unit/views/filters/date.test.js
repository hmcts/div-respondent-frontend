const modulePath = 'views/filters/date';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

describe(modulePath, () => {
  it('should return date formatted', () => {
    const dateString = '2016-01-01T00:00:00-06:00';
    const dateFormatted = '01 January 2016';
    expect(filter.date(dateString)).to.eql(dateFormatted);
  });

  it('should return input if input not valid date', () => {
    const dateString = 'not a valid date';
    expect(filter.date(dateString)).to.eql(dateString);
  });
});
