// `trim(str)`
// -----------
//
// Trims a string.
//
// Parameters:
//
// `str` - the input string to be trimmed.
module.exports = function(str) {
  if (str == null) {
    return null;
  }
  if (str.trim) {
    return str.trim();
  } else {
    return str.replace(/^ */, '').replace(/ *$/, '');
  }
};
