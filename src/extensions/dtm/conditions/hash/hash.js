'use strict';

var textMatch = require('textMatch');

/**
 * Hash condition. Determines if the current hash (URL fragment identifier) is a matching hash.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {(RegEx|string)[]} [config.conditionConfig.include] An array of hashes. If specified,
 * the current hash must match at least one of the listed hashes.
 * @param {(RegEx|string)[]} [config.conditionConfig.exclude] An array of hashes. If specified,
 * the current domain must not match any of the listed hashes.
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

