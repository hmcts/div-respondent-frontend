const { CheckYourAnswers: CYA } = require('@hmcts/one-per-page/checkYourAnswers');

class SetLanguageQuestion extends CYA {
  handler(req, res, next) {
    if (req.method === 'POST') {
      req.body.languagePreferenceWelsh = 'No';

      if (req.cookies.i18n === 'cy') {
        req.body.languagePreferenceWelsh = 'Yes';
      }
    }

    super.handler(req, res, next);
  }
}

module.exports = SetLanguageQuestion;
