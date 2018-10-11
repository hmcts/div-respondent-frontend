const hypenate = input => {
  if (!input || (typeof input !== 'number' && typeof input !== 'string')) {
    return input;
  }
  return `${input}`.match(/.{1,4}/g).join(' &#8208; ');
};

module.exports.hypenate = hypenate;