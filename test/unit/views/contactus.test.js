const ProgressBar = require('steps/respondent/progress-bar/ProgressBar.step');
const idam = require('services/idam');
const { middleware, sinon, content, custom, expect } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const { get } = require('lodash');

const session = {
  caseState: 'AwaitingLegalAdvisorReferral',
  originalPetition: {
    respWillDefendDivorce: null
  }
};

describe('Test contact us for help', () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('shows email and phone content', () => {
    const specificContent = [
      'phoneTitle',
      'phoneToCallIfProblems',
      'emailTitle',
      'emailIfProblems',
      'responseTime'
    ];
    return content(ProgressBar, session, { specificContent });
  });

  it('shows webchat content', () => {
    return custom(ProgressBar)
      .withSession(session)
      .get()
      .expect(httpStatus.OK)
      .text((pageContent, contentKeys) => {
        const webChatTitle = get(contentKeys, 'webChatTitle');

        expect(pageContent).to.include(webChatTitle);
      });
  });
});