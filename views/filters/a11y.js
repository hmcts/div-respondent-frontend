const a11yCharSeparator = input => {
  if (typeof input === 'string') {
    return input.split('').join(' ');
  }
  return input;
};

module.exports = a11yCharSeparator;
