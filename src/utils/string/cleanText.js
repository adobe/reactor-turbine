// `cleanText(str)`
// ================
//
// "Cleans" text by trimming the string and removing spaces and newlines.
module.exports = function(str) {
  if (str == null) {
    return null;
  }

  return str.replace(/\s+/g, ' ').trim();
};
