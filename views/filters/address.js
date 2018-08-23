const address = input => {
  if (Array.isArray(input)) {
    return input.join('<br>');
  }
  return input;
};

module.exports.address = address;
