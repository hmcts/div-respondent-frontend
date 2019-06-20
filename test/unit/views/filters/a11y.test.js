const modulePath = 'views/filters/a11y';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

describe(modulePath, () => {
  describe('a11yCharSeparator', () => {
    it('should return string formatted', () => {
      const stringToFormat = 'ABC1234';
      const stringFormatted = 'A B C 1 2 3 4';
      expect(filter.a11yCharSeparator(stringToFormat)).to.eql(stringFormatted);
    });
    it('should return string formatted correctly when there is whitespace in the string', () => {
      const stringToFormat = '  ABC1    234        ';
      const stringFormatted = 'A B C 1 2 3 4';
      expect(filter.a11yCharSeparator(stringToFormat)).to.eql(stringFormatted);
    });
    it('should handle an empty string', () => {
      const stringToFormat = '';
      const stringFormatted = '';
      expect(filter.a11yCharSeparator(stringToFormat)).to.eql(stringFormatted);
    });
    it('should handle a null value', () => {
      const stringToFormat = null;
      const stringFormatted = null;
      expect(filter.a11yCharSeparator(stringToFormat)).to.eql(stringFormatted);
    });
    it('should handle a number value', () => {
      const stringToFormat = 1234;
      const stringFormatted = 1234;
      expect(filter.a11yCharSeparator(stringToFormat)).to.eql(stringFormatted);
    });
  });
});
