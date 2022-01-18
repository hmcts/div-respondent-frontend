/* eslint-disable */

import $ from 'jquery';
import govukFrontend from 'govuk-frontend/all';
import './showHideContent';

window.jQuery = $;
window.$ = $;

$(document).ready(() => {
  const showHideContent = new global.GOVUK.ShowHideContent();
  showHideContent.init();

  govukFrontend.initAll();

  $('input.button[type="submit"]').click(event => {
    const $el = $(event.target);
    setTimeout(() => {
      $el.attr('disabled', true);
      $el.attr('aria-disabled', true);
    });
  });
});
