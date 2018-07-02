const modulePath = 'mocks/steps/idamLogin/IdamLogin.step';

const IdamLogin = require(modulePath);
const Authenticated = require('steps/authenticated/Authenticated.step');
const { question, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    return content(IdamLogin);
  });

  it('redirects to Authenticated if answer is no', () => {
    const fields = { success: 'no' };
    return question.redirectWithField(IdamLogin, fields, Authenticated);
  });

  it('redirects to Authenticated if answer is yes', () => {
    const fields = { success: 'yes' };
    return question.redirectWithField(IdamLogin, fields, Authenticated);
  });

  it('loads fields from the session', () => {
    const sessionData = { success: 'yes' };
    return question.rendersValues(IdamLogin, sessionData);
  });
});
