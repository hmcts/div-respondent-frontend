const glob = require('glob');

const getFilters = () => {
  const filters = {};

  glob.sync('views/filters/**/*.js').forEach(file => {
    const filter = require(file); // eslint-disable-line global-require

    Object.keys(filter).forEach(filterName => {
      filters[filterName] = filter[filterName];
    });
  });

  return filters;
};

module.exports = getFilters;
