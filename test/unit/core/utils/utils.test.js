const { expect } = require('@hmcts/one-per-page-test-suite');
const { count } = require('core/utils/utils');


describe('Utils', () => {
  describe('count()', () => {
    it('should count the number of occurences successfully', () => {
      expect(count('word', 'content word word')).to.equal(2);
    });

    it('should return 0 when no occurences found', () => {
      expect(count('word', 'content content')).to.equal(0);
    });
  });
});
