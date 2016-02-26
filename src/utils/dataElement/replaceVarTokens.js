var getVar = require('./getVar');
var state = require('../../state');
var undefinedVarsReturnEmpty = state.getPropertySettings().undefinedVarsReturnEmpty;

/**
 * Perform variable substitutions to a string where tokens are specified in the form %foo%.
 * @param str {string} The string to which substitutions should be applied.
 * @param element {HTMLElement} The element to use for tokens in the form of %this.property%.
 * @param event {Object} The event object to use for tokens in the form of %target.property%.
 * @returns {string}
 */
module.exports = function(str, element, event) {
  if (typeof str !== 'string') {
    return str;
  }
  return str
    .replace(/%(.*?)%/g, function(m, variable) {
      var val = getVar(variable, element, event);
      if (val == null) {
        return undefinedVarsReturnEmpty ? '' : m;
      } else {
        return val;
      }
    });
};
