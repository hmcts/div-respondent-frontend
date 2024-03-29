const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { redirectTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text, object, errorFor } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const idam = require('services/idam');
const config = require('config');
const content = require('./LegalProceedings.content');
const i18next = require('i18next');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

const yes = 'Yes';
const no = 'No';

class LegalProceedings extends Question {
  static get path() {
    return config.paths.respondent.legalProceedings;
  }

  get form() {
    const answers = [yes, no];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const validateCaseDetails = ({ exists = '', details = '' }) => {
      if (exists === yes && !details.trim().length) {
        return false;
      }

      return true;
    };

    const fields = {
      exists: text.joi(this.content.errors.required, validAnswers),
      details: text
    };

    const legalProceedings = object(fields)
      .check(
        errorFor('details', this.content.errors.requireCaseDetails),
        validateCaseDetails
      );

    return form({ legalProceedings });
  }

  values() {
    const exists = this.fields.legalProceedings.exists.value;
    const details = this.fields.legalProceedings.details.value;

    const values = { respLegalProceedingsExist: exists };

    if (exists === yes) {
      values.respLegalProceedingsDescription = details;
    }

    return values;
  }

  answers() {
    const answers = [];
    const sessionLanguage = i18next.language;

    answers.push(answer(this, {
      question: content[sessionLanguage].cya.question,
      answer: this.fields.legalProceedings.exists.value === yes ? content[sessionLanguage].fields.yes.answer : content[sessionLanguage].fields.no.answer
    }));

    if (this.fields.legalProceedings.exists.value === yes) {
      answers.push(answer(this, {
        question: content[sessionLanguage].cya.details,
        answer: this.fields.legalProceedings.details.value
      }));
    }

    return answers;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.protect()
    ];
  }

  next() {
    const costClaim = this.req.session.originalPetition.claimsCostsFrom;

    const condition = costClaim && costClaim.includes('respondent');

    return branch(
      redirectTo(this.journey.steps.AgreeToPayCosts).if(condition),
      redirectTo(this.journey.steps.ContactDetails)
    );
  }
}

module.exports = LegalProceedings;
