const steps = require('steps')(false);
const { custom, expect } = require('@hmcts/one-per-page-test-suite');
const a11y = require('./a11y');
const resolveTemplate = require('@hmcts/one-per-page/src/middleware/resolveTemplate');

const languages = ['en', 'cy'];

const excludedSteps = ['Equality', 'AvayaWebchat'];

// ensure a step has a template - if it doesnt no need to test it
const filterSteps = step => {
  const stepInstance = new step({ journey: {} });
  return stepInstance.middleware.includes(resolveTemplate) && !excludedSteps.includes(step.name);
};

// ensure step has parse function - if it does then test POST requests
const stepIsPostable = step => {
  const stepInstance = new step({ journey: {} });
  return typeof stepInstance.parse === 'function';
};

// Ignored Errors
const excludedErrors = [ 'WCAG2AA.Principle1.Guideline1_3.1_3_1.F92,ARIA4, WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail' ];
const filteredErrors = r => {
  return !excludedErrors.includes(r.code);
};

// Ignored Warnings
const excludedWarnings = [ 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48.2, WCAG2AA.Principle1.Guideline1_1.1_1_1.H67.2' ];
const filteredWarnings = r => {
  return !excludedWarnings.includes(r.code);
};

// set up step with valid idam creds
const session = { IdamLogin: { success: 'yes' } };
const getAgent = step => {
  return custom(step)
    .withSession(session)
    .withGlobal('feedbackLink', 'https://github.com/hmcts/one-per-page/issues/new')
    .asServer();
};

const validateAccessibility = (step, method, language = 'en') => {
  return new Promise((resolve, reject) => {
    const agent = getAgent(step);
    const url = `${step.path}?lng=${language}`;

    a11y(agent.get(url).url, method)
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


const runTests = (step, language = 'en') => {
  describe(`Validate HTML accessibility for the page ${step.name} - ${language}`, () => {
    let errors = [];
    let warnings = [];

    describe('GET Requests', () => {
      before(() => {
        return validateAccessibility(step, 'GET', language)
          .then(results => {
            errors = results.errors
              .filter(filteredErrors);
            warnings = results.warnings
              .filter(filteredWarnings);
          })
          .catch(error => {
            expect(error)
              .to
              .eql(false, `Error when validating HTML accessibility: ${error}`);
          });
      });

      it('should not generate any errors', () => {
        expect(errors.length)
          .to
          .equal(0, JSON.stringify(errors, null, 2));
      });

      it('should not generate any warnings', () => {
        expect(warnings.length)
          .to
          .equal(0, JSON.stringify(warnings, null, 2));
      });
    });

    if (stepIsPostable(step)) {
      describe('POST Requests', () => {
        before(() => {
          return validateAccessibility(step, 'POST', language)
            .then(results => {
              errors = results.errors
                .filter(filteredErrors);
              warnings = results.warnings
                .filter(filteredWarnings);
            })
            .catch(error => {
              expect(error)
                .to
                .eql(false, `Error when validating HTML accessibility: ${error}`);
            });
        });

        it('should not generate any errors', () => {
          expect(errors.length)
            .to
            .equal(0, JSON.stringify(errors, null, 2));
        });

        it('should not generate any warnings', () => {
          expect(warnings.length)
            .to
            .equal(0, JSON.stringify(warnings, null, 2));
        });
      });
    }
  });
};

languages
  .forEach(language => {
    steps
      .filter(filterSteps)
      .forEach(step => {
        runTests(step, language);
      });
  });
