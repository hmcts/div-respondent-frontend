const lineBreakToComma = (input = '') => {
  return input.replace(/\r\n/gi, ', ');
};

module.exports.lineBreakToComma = lineBreakToComma;