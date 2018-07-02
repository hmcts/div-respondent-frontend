'use strict';
const requireDirectory = require('require-directory');

const steps = requireDirectory(module);
const actions = {};

const getActors = () => {
  const stepsKeys = Object.keys(steps);
  for (const step in stepsKeys) {
    if (stepsKeys[step]) {
      const sectionKeys = Object.keys(steps[stepsKeys[step]]);
      sectionKeys.forEach(sectionKey => {
        actions[sectionKey] = steps[stepsKeys[step]][sectionKey];
      });
    }
  }
  return actor(actions);
};

module.exports = getActors();
