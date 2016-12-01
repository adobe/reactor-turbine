/**
 * Creates a function that, when called, will return an object where keys are configuration IDs
 * and values are the respective configuration objects with data element tokens replaced.
 *
 * @param {Object} configurations
 * @returns {Function}
 */
module.exports = function(configurations) {
  // We pull in replaceTokens here and not at the top of the file to prevent a
  // circular reference since dependencies of replaceTokens requires state which requires
  // this module.
  var replaceTokens = require('./public/replaceTokens');

  return function() {

    return (configurations || []).map(function(configuration) {
      return {
        id: configuration.id,
        name: configuration.name,
        settings: replaceTokens(configuration.settings || {})
      };
    });
  };
};
