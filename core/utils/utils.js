
const count = (textToCount, content) => {
  const result = content.match(new RegExp(textToCount, 'g'));
  if (result) {
    return result.length;
  }
  return 0;
};

module.exports = {
  count
};
