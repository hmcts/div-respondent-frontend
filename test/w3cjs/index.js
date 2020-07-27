const w3cjs = require('w3cjs');
const steps = require('steps')(false);
const { sinon, custom, expect, middleware } = require('@hmcts/one-per-page-test-suite');
const resolveTemplate = require('@hmcts/one-per-page/src/middleware/resolveTemplate');
const httpStatus = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const petitionMiddleware = require('middleware/petitionMiddleware');
const caseOrchestration = require('services/caseOrchestration');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

// Get the mocked session from file
const filePath = path.join(__dirname, '../../resources/mock.json');
const rawdata = fs.readFileSync(filePath, 'utf8'); // eslint-disable-line no-sync
const mockedSession = JSON.parse(rawdata);

const maxHtmlValidationRetries = 3;
const htmlValidationTimeout = 5000;

// Ignored warnings
const excludedWarnings = [
  'The “type” attribute is unnecessary for JavaScript resources.',
  'The “banner” role is unnecessary for element “header”.',
  'The “main” role is unnecessary for element “main”.',
  'The “contentinfo” role is unnecessary for element “footer”.',
  'The “complementary” role is unnecessary for element “aside”.',
  'The “navigation” role is unnecessary for element “nav”.',
  'The “button” role is unnecessary for element “button”.',
  'Possible misuse of “aria-label”. (If you disagree with this warning, file an issue report or send e-mail to www-validator@w3.org.)' // eslint-disable-line
];
const filteredWarnings = r => {
  return !excludedWarnings.includes(r.message);
};
/* eslint-disable */
// FIXME - Ignored errors (temporarily)
const excludedErrors = [
  'Element “h2” not allowed as child of element “legend” in this context. (Suppressing further errors from this subtree.)',
  'Attribute “src” not allowed on element “image” at this point.',
  'Element “image” is missing required attribute “height”.',
  'Element “image” is missing required attribute “width”.',
  // Sonar doesnt allow <b> tags so <strong> tags used
  'Element “stong” not allowed as child of element “p” in this context. (Suppressing further errors from this subtree.)',
  'Bad value “presentation” for attribute “role” on element “svg”.'
];
/* eslint-enable */
const filteredErrors = r => {
  return !excludedErrors.includes(r.message);
};

const excludedSteps = ['Equality'];

// ensure step has a template - if it doesnt no need to test it
const filterSteps = step => {
  const stepInstance = new step({ journey: {} });
  return stepInstance.middleware.includes(resolveTemplate) && !excludedSteps.includes(step.name);
};

const userDetails = {
  id: 'idamUserId',
  email: 'respondent@email.address'
};

const stepHtml = step => {
  return custom(step)
    .withSession(Object.assign({ entryPoint: step.name }, mockedSession))
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
          .filter(r => r.type === 'error')
          .filter(filteredErrors);
        const warnings = res.messages
          .filter(r => r.type === 'info')
          .filter(filteredWarnings);
        return resolve({ errors, warnings });
      }
    });
  });
};

const repeatW3cjsValidate = html => {
  let retries = 0;

  return new Promise((resolve, reject) => {
    const doValidation = () => {
      const promise = w3cjsValidate(html)
        .then(results => {
          if (!promise.done) {
            resolve(results);
          }
          // set promise done so it does not resolve/reject after timeout
          promise.done = true;
        })
        .catch(error => {
          if (!promise.done) {
            reject(error);
          }
          // set promise done so it does not resolve/reject after timeout
          promise.done = true;
        });

      // catch timeouted request to w3jcs validate
      setTimeout(() => {
        retries = retries + 1;
        if (!promise.done && retries < maxHtmlValidationRetries) {
          doValidation();
        } else {
          reject(new Error('Unable to validate html'));
        }
        // set promise done so it does not resolve/reject after timeout
        promise.done = true;
      }, htmlValidationTimeout);
    };

    doValidation();
  });
};

steps
  .filter(filterSteps)
  .forEach(step => {
    describe(`Validate html for the page ${step.name}`, () => {
      let errors = [];
      let warnings = [];

      before(function beforeTests() {
        this.timeout(htmlValidationTimeout * maxHtmlValidationRetries);

        sinon.stub(petitionMiddleware, 'loadMiniPetition')
          .callsFake(middleware.nextMock);
        sinon.stub(caseOrchestration, 'getPetition')
          .resolves(middleware.nextMock);
        sinon.stub(feesAndPaymentsService, 'get')
          .resolves({
            feeCode: 'FEE0002',
            version: 4,
            amount: 550.00,
            description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
          });
        return stepHtml(step)
          .then(repeatW3cjsValidate)
          .then(results => {
            errors = results.errors;
            warnings = results.warnings;
          })
          .catch(error => {
            expect(error).to.eql(false, `Error with WC3 module: ${error}`);
          });
      });
      after(() => {
        caseOrchestration.getPetition.restore();
        petitionMiddleware.loadMiniPetition.restore();
        feesAndPaymentsService.get.restore();
      });

      it('should not have any html errors', () => {
        expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
      });

      it('should not have any html warnings', () => {
        expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
      });
    });
  });
