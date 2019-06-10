const modulePath = 'steps/respondent/solicitor-representation/SolicitorRepresentation.step';
const SolicitorRepresentation = require(modulePath);
const SolRepContent = require(
  'steps/respondent/solicitor-representation/SolicitorRepresentation.content');
const ChooseAResponse = require('steps/respondent/choose-a-response/ChooseAResponse.step');
const ConsentDecree = require('steps/respondent/consent-decree/ConsentDecree.step');
const AdmitAdultery = require('steps/respondent/admit-adultery/AdmitAdultery.step');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');

const yes = 'yes';
const no = 'no';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(SolicitorRepresentation, [idam.protect()]);
  });

  it('redirects to the admit adultery step if not being represented and is adultery case', () => {
    const fields = { response: no };
    const session = {
      originalPetition: {
        reasonForDivorce: 'adultery'
      }
    };
    return question.redirectWithField(SolicitorRepresentation, fields, AdmitAdultery, session);
  });

  it('redirects to consent decree step if not being represented for 2yr separation case', () => {
    const fields = { response: no };
    const session = {
      originalPetition: {
        reasonForDivorce: 'separation-2-years'
      }
    };
    return question.redirectWithField(SolicitorRepresentation, fields, ConsentDecree, session);
  });

  it('redirects to choose a response page if not being represented', () => {
    const fields = { response: no };
    const session = {
      originalPetition: {
        reasonForDivorce: 'separation-5-years'
      }
    };
    return question.redirectWithField(SolicitorRepresentation, fields, ChooseAResponse, session);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(SolicitorRepresentation);
  });

  it('should have the answer object set correctly', () => {
    const req = {
      journey: {},
      session: {
        SolicitorRepresentation: {
          response: yes
        }
      }
    };
    const step = new SolicitorRepresentation(req, {});
    step.retrieve()
      .validate();

    const answer = step.answers();
    expect(answer.answer).to.equal(SolRepContent.en.fields.hasSolicitor.label);
    expect(answer.question).to.equal(SolRepContent.en.title);
  });

  it('renders all the content', () => {
    return content(SolicitorRepresentation, {}, { specificContent: ['title', 'subHeading'] });
  });

  it('returns the correct values object, with yes for admitting adultery', () => {
    const req = {
      journey: {},
      session: {
        SolicitorRepresentation: {
          response: yes
        }
      }
    };
    const step = new SolicitorRepresentation(req, {});
    step.retrieve()
      .validate();
    const values = step.values();
    expect(values.respondentSolicitorRepresented).to.equal(yes);
  });

  it('returns the correct values object, with no for disputing adultery', () => {
    const req = {
      journey: {},
      session: {
        SolicitorRepresentation: {
          response: no
        }
      }
    };
    const step = new SolicitorRepresentation(req, {});
    step.retrieve()
      .validate();
    const values = step.values();
    expect(values.respondentSolicitorRepresented).to.equal('no');
  });

  describe('watches', () => {
    it('removes solicitor details if changes answer to no', () => {
      const instance = new SolicitorRepresentation({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches['SolicitorRepresentation.respondentSolicitorRepresented'];
      watch(yes, no, remove);

      expect(remove).calledWith('SolicitorDetails.solicitorDetails');
    });
  });
});
