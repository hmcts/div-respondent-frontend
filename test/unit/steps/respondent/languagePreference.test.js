const modulePath = 'steps/respondent/language-preference/LanguagePreference.step';
const LanguagePreference = require(modulePath);
//  const ChooseAResponse = require('steps/respondent/choose-a-response/ChooseAResponse.step');
const idam = require('services/idam');
const checkWelshToggle = require('middleware/checkWelshToggle');
const { middleware, question, sinon } = require('@hmcts/one-per-page-test-suite');
const LanguagePreferenceContent = require('steps/respondent/language-preference/LanguagePreference.content');

const defaultSession = {
  originalPetition: {
    jurisdictionConnection: ['A', 'B']
  }
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(LanguagePreference, [idam.protect()]);
  });

  it('has checkWelshToggle middleware', () => {
    return middleware.hasMiddleware(LanguagePreference, [checkWelshToggle]);
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      LanguagePreferenceContent.en.cya.agree,
      LanguagePreferenceContent.en.fields.agree.answer
    ];

    const stepData = {
      languagePreferenceWelsh: 'Yes'
    };

    return question.answers(LanguagePreference, stepData, expectedContent, defaultSession);
  });

//  it('redirects to next page', () => {
//    const fields = { languagePreferenceWelsh: 'Yes' };
//    return question.redirectWithField(LanguagePreference, fields, ChooseAResponse);
//  });
});
