const modulePath = 'steps/admit-adultery/AdmitAdultery.step.js';
const AdmitAdultery = require(modulePath);
const ChooseAResponse = require('steps/choose-a-response/ChooseAResponse.step');
const AdmitAdulteryContent = require('steps/admit-adultery/AdmitAdultery.content');
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
    return middleware.hasMiddleware(AdmitAdultery, [idam.protect()]);
  });

  it('redirects to the check your answers page on admission', () => {
    const fields = { response: 'admit' };
    return question.redirectWithField(AdmitAdultery, fields, ChooseAResponse);
  });

  it('redirects to back to choose a response page on not admitting adultery', () => {
    const fields = { response: 'doNotAdmit' };
    return question.redirectWithField(AdmitAdultery, fields, ChooseAResponse);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(AdmitAdultery);
  });

  it('should have the answer object set correctly', () => {
    const req = {
      journey: {},
      session: {
        AdmitAdultery: {
          response: admit
        }
      }
    };
    const step = new AdmitAdultery(req, {});
    step.retrieve()
      .validate();

    const answer = step.answers();
    expect(answer.answer).to.equal(AdmitAdulteryContent.en.fields.admit.label);
    expect(answer.question).to.equal(AdmitAdulteryContent.en.title);
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
    return content(AdmitAdultery, session, { ignoreContent: ['info'],
      specificContent: ['whereAdultery', 'whenAdultery', 'details'] });
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
    return content(AdmitAdultery, session, { ignoreContent: ['info'],
      specificContent: ['whenAdultery'] });
  });

  it('returns the correct values object, with yes for admitting adultery', () => {
    const req = {
      journey: {},
      session: {
        AdmitAdultery: {
          response: admit
        }
      }
    };
    const step = new AdmitAdultery(req, {});
    step.retrieve()
      .validate();
    const values = step.values();
    expect(values.respAdmitOrConsentToFact).to.equal('Yes');
  });

  it('returns the correct values object, with no for disputing adultery', () => {
    const req = {
      journey: {},
      session: {
        AdmitAdultery: {
          response: doNotAdmit
        }
      }
    };
    const step = new AdmitAdultery(req, {});
    step.retrieve()
      .validate();
    const values = step.values();
    expect(values.respAdmitOrConsentToFact).to.equal('No');
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
    const step = new AdmitAdultery(req, {});
    const session = step.session;
    const caseData = step.caseData;
    expect(session.response).to.equal(admit);
    expect(caseData.caseRef).to.equal('000111222');
  });
});
