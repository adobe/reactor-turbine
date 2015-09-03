'use strict';

var textMatch = require('textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) matches at least one
 * acceptable hash and does not match any unacceptable hash.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {(RegEx|string)[]} [config.conditionConfig.include] An array of acceptable hashes.
 * @param {(RegEx|string)[]} [config.conditionConfig.exclude] An array of unacceptable hashes.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hash = document.location.hash;
  var include = config.conditionConfig.include;
  var exclude = config.conditionConfig.exclude;

  var compare = function(hashOption) {
    return textMatch(hash, hashOption);
  };

  return (!include || include.some(compare)) && (!exclude || !exclude.some(compare));
};

