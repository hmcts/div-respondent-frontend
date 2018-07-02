const steps = require('steps')();
const { custom, expect } = require('@hmcts/one-per-page-test-suite');
const a11y = require('./a11y');
const resolveTemplate = require('@hmcts/one-per-page/src/middleware/resolveTemplate');

// ensure step has a template - if it doesnt no need to test it
const filterSteps = step => {
  const stepInstance = new step({ journey: {} });
  return stepInstance.middleware.includes(resolveTemplate);
};

// ensure step has parse function - if it does then test POST requests
const stepIsPostable = step => {
  const stepInstance = new step({ journey: {} });
  return typeof stepInstance.parse === 'function';
};

// set up step with valid idam creds
const session = { IdamLogin: { success: 'yes' } };
const getAgent = step => {
  return custom(step)
    .withSession(session)
    .withGlobal('feedbackLink', 'https://github.com/hmcts/one-per-page/issues/new')
    .asServer();
};

const validateAccessibility = (step, method) => {
  return new Promise((resolve, reject) => {
    const agent = getAgent(step);
    a11y(agent.get(step.path).url, method)
      .then(results => {
        const errors = results
          .filter(result => result.type === 'error')
          .filter(error => {
            if (step.ignorePa11yErrors) {
              return !step.ignorePa11yErrors.includes(error.code);
            }
            return true;
          });
        const warnings = results
          .filter(result => result.type === 'warning')
          .filter(warning => {
            if (step.ignorePa11yWarnings) {
              return !step.ignorePa11yWarnings.includes(warning.code);
            }
            return true;
          });
        return resolve({ errors, warnings });
      })
      .catch(reject);
  });
};

steps
  .filter(filterSteps)
  .forEach(step => {
    describe(`Validate HTML accessibility for the page ${step.name}`, () => {
      let errors = [];
      let warnings = [];

      describe('GET Requests', () => {
        before(() => {
          return validateAccessibility(step, 'GET')
            .then(results => {
              errors = results.errors;
              warnings = results.warnings;
            })
            .catch(error => {
              expect(error).to.eql(false, `Error when validating HTML accessibility: ${error}`);
            });
        });

        it('should not generate any errors', () => {
          expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
        });

        it('should not generate any warnings', () => {
          expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
        });
      });

      if (stepIsPostable(step)) {
        describe('POST Requests', () => {
          before(() => {
            return validateAccessibility(step, 'POST')
              .then(results => {
                errors = results.errors;
                warnings = results.warnings;
              })
              .catch(error => {
                expect(error).to.eql(false, `Error when validating HTML accessibility: ${error}`);
              });
          });

          it('should not generate any errors', () => {
            expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
          });

          it('should not generate any warnings', () => {
            expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
          });
        });
      }
    });
  });
