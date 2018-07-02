const w3cjs = require('w3cjs');
const steps = require('steps')();
const { custom, expect } = require('@hmcts/one-per-page-test-suite');
const resolveTemplate = require('@hmcts/one-per-page/src/middleware/resolveTemplate');
const httpStatus = require('http-status-codes');

// Ignored warnings
const excludedWarnings = [
  'The “type” attribute is unnecessary for JavaScript resources.',
  'The “banner” role is unnecessary for element “header”.',
  'The “main” role is unnecessary for element “main”.',
  'The “contentinfo” role is unnecessary for element “footer”.',
  'The “complementary” role is unnecessary for element “aside”.',
  'The “navigation” role is unnecessary for element “nav”.'
];
const filteredWarnings = r => {
  if (excludedWarnings.includes(r.message)) {
    return false;
  }
  return true;
};

// ensure step has a template - if it doesnt no need to test it
const filterSteps = step => {
  const stepInstance = new step({ journey: {} });
  return stepInstance.middleware.includes(resolveTemplate);
};

const userDetails = {
  id: 'idamUserId',
  email: 'user@email.com'
};

const stepHtml = step => {
  return custom(step)
    .withSession()
    .withCookie('mockIdamUserDetails', JSON.stringify(userDetails))
    .get()
    .expect(httpStatus.OK)
    .text(html => html);
};

const w3cjsValidate = html => {
  return new Promise((resolve, reject) => {
    w3cjs.validate({
      input: html,
      callback: (error, res) => { // eslint-disable-line id-blacklist
        if (error) {
          return reject(error);
        }

        const errors = res.messages
          .filter(r => r.type === 'error');
        const warnings = res.messages
          .filter(r => r.type === 'info')
          .filter(filteredWarnings);
        return resolve({ errors, warnings });
      }
    });
  });
};

steps
  .filter(filterSteps)
  .forEach(step => {
    describe(`Validate html for the page ${step.name}`, () => {
      let errors = [];
      let warnings = [];

      before(() => {
        return stepHtml(step)
          .then(html => w3cjsValidate(html))
          .then(results => {
            errors = results.errors;
            warnings = results.warnings;
          })
          .catch(error => {
            expect(error).to.eql(false, `Error with WC3 module: ${error}`);
          });
      });

      it('should not have any html errors', () => {
        expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
      });

      it('should not have any html warnings', () => {
        expect(warnings.length).to.equal(0, JSON.stringify(filteredWarnings, null, 2));
      });
    });
  });
