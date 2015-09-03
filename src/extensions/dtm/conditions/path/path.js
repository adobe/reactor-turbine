'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Path condition. Determines if the actual path matches at least one acceptable path and does not
 * match any unacceptable path.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {(RegEx|string)[]} [config.conditionConfig.include] An array of acceptable paths.
 * @param {(RegEx|string)[]} [config.conditionConfig.exclude] An array of unacceptable paths.
 * @returns {boolean}
 */
module.exports = function(config) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  var include = config.conditionConfig.include;
  var exclude = config.conditionConfig.exclude;

  var compare = function(pathCriterion) {
    return textMatch(path, pathCriterion);
  };

  return (!include || include.some(compare)) && (!exclude || !exclude.some(compare));
};

