const modulePath = 'views/filters/date';

const moment = require('moment');
const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

describe(modulePath, () => {
  const defaultSuppressDeprecationWarnings = moment.suppressDeprecationWarnings;

  it('should return date formatted', () => {
    const dateString = '2016-01-01T00:00:00-06:00';
    const dateFormatted = '01 January 2016';
    expect(filter.date(dateString)).to.eql(dateFormatted);
  });

  it('should return input if input not valid date', () => {
    // We are expecting this warning, so hide it specifically for this test
    moment.suppressDeprecationWarnings = true;

    const dateString = 'not a valid date';
    expect(filter.date(dateString)).to.eql(dateString);

    // Restore default warnings options
    moment.suppressDeprecationWarnings = defaultSuppressDeprecationWarnings;
  });
});
