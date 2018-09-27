const modulePath = 'steps/jurisdiction/Jurisdiction.step';
const Jurisdiction = require(modulePath);
const LegalProceedings = require('steps/legal-proceedings/LegalProceedings.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

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
    const fields = { 'jurisdiction-agree': 'no' };

    const onlyErrors = ['reasonRequired', 'countryRequired' ];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('shows error when no jurisdiction and reason not supplied', () => {
    const fields = { 'jurisdiction-agree': 'no', 'jurisdiction-country': 'country' };

    const onlyErrors = ['reasonRequired'];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('shows error when no jurisdiction and country not supplied', () => {
    const fields = { 'jurisdiction-agree': 'no', 'jurisdiction-reason': 'reason' };

    const onlyErrors = ['countryRequired'];

    return question.testErrors(Jurisdiction, defaultSession, fields, { onlyErrors });
  });

  it('redirects to next page on jurisdiction is no and details are supplied', () => {
    const fields = {
      'jurisdiction-agree': 'no',
      'jurisdiction-reason': 'reason',
      'jurisdiction-country': 'country'
    };

    return question.redirectWithField(Jurisdiction, fields, LegalProceedings);
  });

  it('redirects to next page on jurisdiction is yes', () => {
    const fields = { 'jurisdiction-agree': 'yes' };
    return question.redirectWithField(Jurisdiction, fields, LegalProceedings);
  });

  it('renders the content', () => {
    return content(Jurisdiction, defaultSession,
      { ignoreContent: [
        'info',
        'cya',
        'jurisdictionConnectionBothDomiciled',
        'jurisdictionConnectionPetitioner',
        'jurisdictionConnectionRespondent',
        'jurisdictionConnectionPetitionerSixMonths',
        'jurisdictionConnectionOther'
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
        'info',
        'cya',
        'jurisdictionConnectionRespondent'
      ] });
  });
});
