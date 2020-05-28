const { Question } = require('@hmcts/one-per-page/steps');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { parseBool } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const content = require('./ReviewApplication.content');
const { getFeeFromFeesAndPayments } = require('middleware/feesAndPaymentsMiddleware');

const { replace, endsWith } = require('lodash');

const values = {
  yes: 'Yes',
  adultery: 'adultery',
  twoYearSeparation: 'separation-2-years'
};

/**
 *  Review Application content should be same for DN, AOS Respondent and co-respondent journey.
 *  Any change to Mini petition should be made across all the Apps
 */
class ReviewApplication extends Question {
  handler(req, res, next) {
    super.handler(req, res, next);
  }
  static get path() {
    return config.paths.respondent.reviewApplication;
  }

  get const() {
    return values;
  }

  get session() {
    return this.req.session;
  }

  get feesIssueApplication() {
    return this.res.locals.applicationFee['petition-issue-fee'].amount;
  }

  get feesFinancialConsentOrder() {
    return this.res.locals.applicationFee['general-application-fee'].amount;
  }

  get feesDivorceSubmitFormA() {
    return this.res.locals.applicationFee['application-financial-order-fee'].amount;
  }

  get isRespondentSolEnabled() {
    return parseBool(config.features.respSolicitorDetails);
  }

  get claimsCostsFromArray() {
    return this.req.session.originalPetition.claimsCostsFrom || [];
  }

  get form() {
    const answers = [this.const.yes];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const respConfirmReadPetition = text
      .joi(this.content.errors.required, validAnswers);

    return form({ respConfirmReadPetition });
  }

  alignSections(details) {
    let arrLength = details.length;
    return details // eslint-disable-line max-len
      .filter(item => {
        if (item.length > 0 && item !== '\r') {
          return true;
        }
        // Reduce array length by 1 if item is filtered
        arrLength -= 1;
        return false;
      })
      .map((item, index) => {
        let value = item;
        if (endsWith(item, '\r')) {
          value = replace(item, '\r', '');
        } else if (arrLength !== index + 1) {
          value = item.concat('<br>');
        }
        return value;
      });
  }

  answers() {
    let sessionLanguage = '';
    if (this.req.cookies.i18n === 'cy') {
      sessionLanguage = 'cy';
    } else {
      sessionLanguage = 'en';
    }
    if (sessionLanguage === 'cy') {
      return answer(this, {
        question: content.cy.readConfirmationQuestion,
        answer: this.fields.respConfirmReadPetition.value === this.const.yes ? content.cy.readConfirmationYes : content.cy.readConfirmationNo
      });
    }
    return answer(this, {
      question: content.en.readConfirmationQuestion,
      answer: this.fields.respConfirmReadPetition.value === this.const.yes ? content.en.readConfirmationYes : content.en.readConfirmationNo
    });
  }

  next() {
    // Here If user selection language is no, than show langugae preference page otherwise skip it
    let returnPage = this.journey.steps.ChooseAResponse;
    if (this.req.session.languagePreferenceWelsh === 'No') {
      returnPage = this.journey.steps.languagePreference;
    }
    return goTo(returnPage);

    // if (this.isRespondentSolEnabled) {
    // }
    // const petition = this.session.originalPetition;
    // const isAdulteryCase = petition.reasonForDivorce === this.const.adultery;
    // const twoYrSep = petition.reasonForDivorce === this.const.twoYearSeparation;
    // return branch(
    //   goTo(this.journey.steps.AdmitAdultery).if(isAdulteryCase),
    //   goTo(this.journey.steps.ConsentDecree).if(twoYrSep),
    //   goTo(this.journey.steps.ChooseAResponse)
    // );
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      getFeeFromFeesAndPayments('petition-issue-fee'),
      getFeeFromFeesAndPayments('general-application-fee'),
      getFeeFromFeesAndPayments('application-financial-order-fee')
    ];
  }
}

module.exports = ReviewApplication;
