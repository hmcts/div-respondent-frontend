const modulePath = 'steps/respondent/language-preference/LanguagePreference.step';
const LanguagePreference = require(modulePath);
const ChooseAResponse = require('steps/respondent/choose-a-response/ChooseAResponse.step');
const AdmitAdultery = require('steps/respondent/admit-adultery/AdmitAdultery.step');
const ConsentDecree = require('steps/respondent/consent-decree/ConsentDecree.step');
const idam = require('services/idam');
const { middleware, question, sinon } = require('@hmcts/one-per-page-test-suite');
const LanguagePreferenceContent = require('steps/respondent/language-preference/LanguagePreference.content');

const defaultSession = {
  originalPetition: {
    jurisdictionConnection: ['A', 'B']
  }
};

describe(modulePath, () => {
  const session = {};

  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(LanguagePreference, [idam.protect()]);
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

  it('redirects to admit adultery page if case is adultery', () => {
    const fields = { languagePreferenceWelsh: 'Yes' };
    session.originalPetition = { reasonForDivorce: 'adultery' };
    return question.redirectWithField(LanguagePreference, fields, AdmitAdultery, session);
  });

  it('redirects to consent decree page if case is 2 year separation', () => {
    const fields = { languagePreferenceWelsh: 'Yes' };
    session.originalPetition = { reasonForDivorce: 'separation-2-years' };
    return question.redirectWithField(LanguagePreference, fields, ConsentDecree, session);
  });

  it('redirects to choose a response page if reason is not adultery or 2 year separation', () => {
    const fields = { languagePreferenceWelsh: 'No' };
    session.originalPetition = { reasonForDivorce: 'separation-5-years' };
    return question.redirectWithField(LanguagePreference, fields, ChooseAResponse, session);
  });
});
