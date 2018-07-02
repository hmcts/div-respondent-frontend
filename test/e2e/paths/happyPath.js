Feature('Happy path');

Scenario('View example page', I => {
  I.amOnLoadedPage('/');
  I.seeExamplePage();
});
