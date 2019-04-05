const modulePath = 'steps/system-message/SystemMessage.step';

const SystemMessage = require(modulePath);
const Respond = require('steps/respondent/respond/Respond.step');
const { content, navigatesToNext } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
    const ignoreContent = ['continue', 'serviceName', 'signOut'];
    return content(SystemMessage, {}, { ignoreContent });
  });

  it('redirects to PetitionProgressBar page', () => {
    return navigatesToNext(SystemMessage, Respond);
  });
});
