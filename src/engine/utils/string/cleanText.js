var trim = require('./trim');

// `cleanText(str)`
// ================
//
// "Cleans" the text from an element's innerText by removing non-ASCII characters, replacing
// double or more spaces with a single space, and removing leading and trailing spaces. This is
// used directly by the @cleanText special property.
module.exports = function(str) {
  if (str == null) {
    return null;
  }
  return trim(str
    // Removes non-ASCII characters
    .replace(/[^\000-\177]*/g, '')
    // Replaces any double or more spaces with a single space
    .replace(/\s{2,}/g, ' '));
};
