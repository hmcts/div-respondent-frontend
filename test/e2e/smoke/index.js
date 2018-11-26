Feature('Smoke test', { retries: 2 });

Scenario('Can see index page', I => {
  I.amOnLoadedPage('/');
});
