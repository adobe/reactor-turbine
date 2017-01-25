/**
 * Creates a function that, when called, will return a configuration object with data element
 * tokens replaced.
 *
 * @param {Object} settings
 * @returns {Function}
 */
module.exports = function(settings) {
  // We pull in replaceVarTokens here and not at the top of the file to prevent a
  // circular reference since dependencies of replaceVarTokens requires state which requires
  // this module.
  var replaceVarTokens = require('./public/replaceTokens');

  return function() {
    return settings ? replaceVarTokens(settings) : {};
  };
};
