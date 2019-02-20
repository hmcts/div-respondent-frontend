'use strict';
const requireDirectory = require('require-directory');

const steps = requireDirectory(module);
const actions = {};

function setActorActions(stepKey) {
  for (const func in stepKey) {
    if (stepKey.hasOwnProperty(func)) {
      actions[func] = stepKey[func];
    }
  }
}

const getActors = () => {
  const stepDirs = Object.keys(steps);
  for (const dir in stepDirs) {
    if (stepDirs[dir]) {
      const stepsKeys = Object.keys(steps[stepDirs[dir]]);

      stepsKeys.forEach(stepKey => {
        setActorActions(steps[stepDirs[dir]][stepKey]);
      });
    }
  }
  return actor(actions);
};

module.exports = getActors();
