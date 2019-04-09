const modulePath = 'views/filters/hypenate';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

const Entities = require('html-entities').AllHtmlEntities;

describe(modulePath, () => {
  it('number should be hypenated', () => {
    const hypenatedNumber = '1234 ‐ 5678 ‐ 9090 ‐ 8908';
    const number = '1234567890908908';
    const filteredNumber = new Entities().decode(filter.hypenate(number));
    expect(filteredNumber).to.eql(hypenatedNumber);
  });
});