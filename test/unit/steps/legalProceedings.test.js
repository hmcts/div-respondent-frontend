const modulePath = 'steps/legal-proceedings/LegalProceedings.step';
const LegalProceedings = require(modulePath);
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(LegalProceedings, [idam.protect()]);
  });

  it('shows error when legal proceedings is yes and case details not supplied', () => {
    const fields = { 'legalProceedings-exists': 'yes' };

    const onlyErrors = ['requireCaseDetails'];

    return question.testErrors(LegalProceedings, {}, fields, { onlyErrors });
  });

  it('redirects to next page on legal proceedings is yes and case details supplied', () => {
    const fields = {
      'legalProceedings-exists': 'yes',
      'legalProceedings-details': 'Legal Proceedings'
    };

    return question.redirectWithField(LegalProceedings, fields, CheckYourAnswers);
  });

  it('redirects to next page on legal proceedings is no', () => {
    const fields = { 'legalProceedings-exists': 'no' };
    return question.redirectWithField(LegalProceedings, fields, CheckYourAnswers);
  });

  it('shows error if question is not answered', () => {
    const onlyErrors = ['required'];
    return question.testErrors(LegalProceedings, {}, {}, { onlyErrors });
  });

  it('renders the content', () => {
    return content(LegalProceedings, {}, { ignoreContent: ['info', 'cya'] });
  });
});
