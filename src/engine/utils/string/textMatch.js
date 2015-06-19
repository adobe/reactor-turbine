// `textMatch(str, str_or_regex)`
// ------------------------------
//
// Perform a string match based on another string or a regex.
//
// Parameters:
//
// `str` - the input string to be matched
// `str_or_regex` - the pattern to match against, if this is a string, it requires exact match, if
//      it's a regex, then it will do regex match
module.exports = function(str, pattern) {
  if (pattern == null) {
    throw new Error('Illegal Argument: Pattern is not present');
  }
  if (str == null) {
    return false;
  }
  if (typeof pattern === 'string') {
    return str === pattern;
  } else if (pattern instanceof RegExp) {
    return pattern.test(str);
  } else {
    return false;
  }
};
