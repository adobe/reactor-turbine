/**
 * Creates a function that, when called, will return an object where keys are configuration IDs
 * and values are the respective configuration objects with data element tokens replaced.
 *
 * @param {Object} configurations
 * @returns {Function}
 */
module.exports = function(configurations) {
  // We pull in replaceVarTokens here and not at the top of the file to prevent a
  // circular reference since dependencies of replaceVarTokens requires state which requires
  // this module.
  var replaceVarTokens = require('./replaceVarTokens');

  return function() {

    return (configurations || []).map(function(configuration) {
      return {
        id: configuration.id,
        name: configuration.name,
        settings: replaceVarTokens(configuration.settings || {})
      };
    });
  };
};
