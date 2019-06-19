const a11yCharSeparator = input => {
  if (typeof input === 'string') {
    // Regex replace to remove all excess whitespace (e.g. '  a      b ' -> 'ab')
    const returnString = input.replace(/\s+/g, '');
    // split each character of the no whitespace string and join with 1 whitespace character
    return returnString.split('').join(' ');
  }
  return input;
};

module.exports.a11yCharSeparator = a11yCharSeparator;
