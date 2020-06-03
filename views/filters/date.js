const moment = require('moment');
const i18next = require('i18next');

const date = input => {
  moment.locale(i18next.language);
  const dateAsMoment = moment(input);
  if (dateAsMoment.isValid()) {
    return dateAsMoment.format('DD MMMM YYYY');
  }
  return input;
};

module.exports.date = date;
