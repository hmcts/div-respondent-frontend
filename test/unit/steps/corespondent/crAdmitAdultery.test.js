const modulePath = 'steps/corespondent/cr-admit-adultery/CrAdmitAdultery.step.js';
const CrAdmitAdultery = require(modulePath);
const CrChooseAResponse = require(
  'steps/corespondent/cr-choose-a-response/CrChooseAResponse.step'
);
const CrAdmitAdulteryContent = require(
  'steps/corespondent/cr-admit-adultery/CrAdmitAdultery.content'
);
const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');

const admit = 'admit';
const doNotAdmit = 'doNotAdmit';

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(CrAdmitAdultery, [idam.protect()]);
  });

  it('redirects to the ChooseAResponse page on admission', () => {
    const fields = { response: 'admit' };
    return question.redirectWithField(CrAdmitAdultery, fields, CrChooseAResponse);
  });

  it('redirects to back to choose a response page on not admitting adultery', () => {
    const fields = { response: 'doNotAdmit' };
    return question.redirectWithField(CrAdmitAdultery, fields, CrChooseAResponse);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(CrAdmitAdultery);
  });

  it('should have the answer object set correctly', () => {
    const req = {
      journey: {},
      session: {
        CrAdmitAdultery: {
          response: admit
        }
      }
    };
    const step = new CrAdmitAdultery(req, {});
    step.retrieve()
      .validate();

    const answer = step.answers();
    expect(answer.answer).to.equal(CrAdmitAdulteryContent.en.fields.admit.label);
    expect(answer.question).to.equal(CrAdmitAdulteryContent.en.title);
  });

  it('renders all the content', () => {
    const session = {
      originalPetition: {
        reasonForDivorce: 'adultery',
        reasonForDivorceAdulteryKnowWhere: 'Yes',
        reasonForDivorceAdulteryKnowWhen: 'Yes',
        reasonForDivorceAdulteryDetails: 'details'
      }
    };
    return content(CrAdmitAdultery, session, { ignoreContent: ['info'],
      specificContent: ['whereAdultery.heading', 'whenAdultery.heading', 'details.heading'] });
  });

  it('renders only the content available', () => {
    const session = {
      originalPetition: {
        reasonForDivorce: 'adultery',
        reasonForDivorceAdulteryKnowWhere: 'No',
        reasonForDivorceAdulteryKnowWhen: 'Yes',
        reasonForDivorceAdulteryDetails: ''
      }
    };
    return content(CrAdmitAdultery, session, { ignoreContent: ['info'],
      specificContent: ['whenAdultery.heading'] });
  });

  it('returns the correct values object, with yes for admitting adultery', () => {
    const req = {
      journey: {},
      session: {
        CrAdmitAdultery: {
          response: admit
        }
      }
    };
    const step = new CrAdmitAdultery(req, {});
    step.retrieve()
      .validate();
    const values = step.values();
    expect(values.coRespAdmitToAdultery).to.equal('Yes');
  });

  it('returns the correct values object, with no for disputing adultery', () => {
    const req = {
      journey: {},
      session: {
        CrAdmitAdultery: {
          response: doNotAdmit
        }
      }
    };
    const step = new CrAdmitAdultery(req, {});
    step.retrieve()
      .validate();
    const values = step.values();
    expect(values.coRespAdmitToAdultery).to.equal('No');
  });

  it('returns the correct session based data', () => {
    const req = {
      journey: {},
      session: {
        response: admit,
        originalPetition: {
          caseRef: '000111222'
        }
      }
    };
    const step = new CrAdmitAdultery(req, {});
    const session = step.session;
    const caseData = step.caseData;
    expect(session.response).to.equal(admit);
    expect(caseData.caseRef).to.equal('000111222');
  });
});
