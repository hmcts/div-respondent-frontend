const modulePath = 'steps/respondent/jurisdiction/Jurisdiction.step';
const Jurisdiction = require(modulePath);
const LegalProceedings = require('steps/respondent/legal-proceedings/LegalProceedings.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const JurisdictionContent = require('steps/respondent/jurisdiction/Jurisdiction.content');

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
    return middleware.hasMiddleware(Jurisdiction, [idam.protect()]);
  });

  it('shows error if question is not answered', () => {
    const onlyErrors = ['required'];
    return question.testErrors(Jurisdiction, defaultSession, {}, { onlyErrors });
  });

  it('shows errors when no jurisdiction and when both reason and country are not supplied', () => {
    const fields = { 'jurisdiction.agree': 'No' };

    const onlyErrors = ['reasonRequired', 'countryRequired' ];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('shows error when no jurisdiction and reason not supplied', () => {
    const fields = { 'jurisdiction.agree': 'No', 'jurisdiction.country': 'country' };

    const onlyErrors = ['reasonRequired'];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('shows error when no jurisdiction and country not supplied', () => {
    const fields = { 'jurisdiction.agree': 'No', 'jurisdiction.reason': 'reason' };

    const onlyErrors = ['countryRequired'];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('redirects to next page on jurisdiction is no and details are supplied', () => {
    const fields = {
      'jurisdiction.agree': 'No',
      'jurisdiction.reason': 'reason',
      'jurisdiction.country': 'country'
    };

    return question.redirectWithField(Jurisdiction, fields, LegalProceedings);
  });

  it('redirects to next page on jurisdiction is yes', () => {
    const fields = { 'jurisdiction.agree': 'Yes' };
    return question.redirectWithField(Jurisdiction, fields, LegalProceedings);
  });

  it('jurisdiction is no, value should contain reason and country', () => {
    const respJurisdictionAgree = 'No';
    const respJurisdictionDisagreeReason = 'Disagree Proceedings';
    const respJurisdictionRespCountryOfResidence = 'Country';

    const fields = {
      jurisdiction: {
        agree: respJurisdictionAgree,
        reason: respJurisdictionDisagreeReason,
        country: respJurisdictionRespCountryOfResidence
      }
    };

    const req = {
      journey: {},
      session: { Jurisdiction: fields }
    };

    const res = {};
    const step = new Jurisdiction(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respJurisdictionAgree', respJurisdictionAgree);
    expect(_values).to.have.property('respJurisdictionDisagreeReason',
      respJurisdictionDisagreeReason);
    expect(_values).to.have.property('respJurisdictionRespCountryOfResidence',
      respJurisdictionRespCountryOfResidence);
  });

  it('jurisdiction is yes, value should contain reason and country', () => {
    const respJurisdictionAgree = 'Yes';
    const respJurisdictionDisagreeReason = 'Disagree Proceedings';
    const respJurisdictionRespCountryOfResidence = 'Country';

    const fields = {
      jurisdiction: {
        agree: respJurisdictionAgree,
        reason: respJurisdictionDisagreeReason,
        country: respJurisdictionRespCountryOfResidence
      }
    };

    const req = {
      journey: {},
      session: { Jurisdiction: fields }
    };

    const res = {};
    const step = new Jurisdiction(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values).to.have.property('respJurisdictionAgree', respJurisdictionAgree);
    expect(_values).to.not.have.property('respJurisdictionDisagreeReason');
    expect(_values).to.not.have.property('respJurisdictionRespCountryOfResidence');
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      JurisdictionContent.en.cya.agree,
      JurisdictionContent.en.fields.agree.answer
    ];

    const stepData = {
      jurisdiction: {
        agree: 'Yes'
      }
    };

    return question.answers(Jurisdiction, stepData, expectedContent, defaultSession);
  });

  it('returns correct answers if answered no', () => {
    const reason = 'reason';
    const country = 'country';

    const expectedContent = [
      JurisdictionContent.en.cya.agree,
      JurisdictionContent.en.fields.disagree.answer,
      JurisdictionContent.en.cya.reason,
      reason,
      JurisdictionContent.en.cya.country,
      country
    ];

    const stepData = {
      jurisdiction: {
        agree: 'No',
        reason,
        country
      }
    };

    return question.answers(Jurisdiction, stepData, expectedContent, defaultSession);
  });

  it('shows error if question is not answered', () => {
    const onlyErrors = ['required'];
    return question.testErrors(Jurisdiction, defaultSession, {}, { onlyErrors });
  });

  it('shows errors when no jurisdiction and when both reason and country are not supplied', () => {
    const fields = { 'jurisdiction.agree': 'No' };

    const onlyErrors = ['reasonRequired', 'countryRequired' ];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('shows error when no jurisdiction and reason not supplied', () => {
    const fields = { 'jurisdiction.agree': 'No', 'jurisdiction.country': 'country' };

    const onlyErrors = ['reasonRequired'];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('shows error when no jurisdiction and country not supplied', () => {
    const fields = { 'jurisdiction.agree': 'No', 'jurisdiction.reason': 'reason' };

    const onlyErrors = ['countryRequired'];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('redirects to next page on jurisdiction is no and details are supplied', () => {
    const fields = {
      'jurisdiction.agree': 'No',
      'jurisdiction.reason': 'reason',
      'jurisdiction.country': 'country'
    };

    return question.redirectWithField(Jurisdiction, fields, LegalProceedings);
  });

  it('redirects to next page on jurisdiction is yes', () => {
    const fields = { 'jurisdiction.agree': 'Yes' };
    return question.redirectWithField(Jurisdiction, fields, LegalProceedings);
  });

  it('renders the content', () => {
    return content(Jurisdiction, defaultSession,
      { ignoreContent: [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'info',
        'cya',
        'jurisdictionConnectionBothDomiciled',
        'jurisdictionConnectionPetDomiciled',
        'jurisdictionConnectionResDomiciled',
        'jurisdictionConnectionNewPolicyOther',
        'jurisdictionConnectionPetitioner',
        'jurisdictionConnectionRespondent',
        'jurisdictionConnectionPetitionerSixMonths',
        'jurisdictionConnectionOther',
        'signIn',
        'signOut',
        'languageToggle',
        'thereWasAProblem',
        'change',
        'husband',
        'wife'
      ] });
  });

  it('does not render connection C when all connections are selected ', () => {
    const session = {
      originalPetition: {
        jurisdictionConnection: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      }
    };

    return content(Jurisdiction, session,
      { ignoreContent: [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'info',
        'cya',
        'jurisdictionConnectionPetDomiciled',
        'jurisdictionConnectionResDomiciled',
        'jurisdictionConnectionNewPolicyOther',
        'jurisdictionConnectionRespondent',
        'signIn',
        'signOut',
        'languageToggle',
        'thereWasAProblem',
        'change',
        'husband',
        'wife'
      ] });
  });
});
