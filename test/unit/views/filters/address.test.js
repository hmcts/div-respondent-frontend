const modulePath = 'views/filters/address';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

describe(modulePath, () => {
  it('should return address formatted', () => {
    const addressToFormat = ['line 1', 'line 2', 'line 3'];
    const addressFormatted = addressToFormat.join('<br>');
    expect(filter.address(addressToFormat)).to.eql(addressFormatted);
  });

  it('should return string if not array', () => {
    const addressFormatted = 'address as string';
    expect(filter.address(addressFormatted)).to.eql(addressFormatted);
  });
});
