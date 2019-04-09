const modulePath = 'services/documentHandler.js';

const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const underTest = require(modulePath);

describe(modulePath, () => {
  it('returns `bind` function so it can bootstrap with One Per Page', () => {
    expect(underTest.hasOwnProperty('bind'));
  });

  it('adds route to app', () => {
    const app = { use: sinon.stub() };
    underTest.bind(app);
    expect(app.use.calledOnce).to.eql(true);
  });
});