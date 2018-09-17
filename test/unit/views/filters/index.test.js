const modulePath = 'views/filters/index';

const glob = require('glob');
const getFilters = require(modulePath);
const { expect } = require('@hmcts/one-per-page-test-suite');

const getFiltersNames = () => {
  const filters = [];

  glob.sync('views/filters/**/*.js').forEach(file => {
    const filter = require(file); // eslint-disable-line global-require

    Object.keys(filter).forEach(filterName => {
      filters.push(filterName);
    });
  });

  return filters;
};

describe(modulePath, () => {
  it('finds all filters and return as object', () => {
    const filters = getFilters();
    const filterNames = getFiltersNames();

    filterNames.forEach(name => {
      expect(filters.hasOwnProperty(name)).to.eql(true);
    });
  });
});
