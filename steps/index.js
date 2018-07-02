const glob = require('glob');
const config = require('config');

const getSteps = () => {
  const steps = [];

  glob.sync('steps/**/*.step.js').forEach(file => {
    const step = require(file); // eslint-disable-line global-require

    steps.push(step);
  });

  if (['development'].includes(config.environment)) {
    glob.sync('mocks/steps/**/*.step.js').forEach(file => {
      const step = require(file); // eslint-disable-line global-require

      steps.push(step);
    });
  }

  return steps;
};

module.exports = getSteps;
