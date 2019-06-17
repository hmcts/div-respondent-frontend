import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';

$(document).ready(() => {
  const showHideContent = new ShowHideContent();
  showHideContent.init();

  $('input.button[type="submit"]').click(event => {
    const $el = $(event.target);
    setTimeout(() => {
      $el.attr('disabled', true);
      $el.attr('aria-disabled', true);
    });
  });
});