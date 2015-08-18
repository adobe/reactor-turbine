'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Path condition. Determines if the current location is an matching path.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {(RegEx|string)[]} [config.conditionConfig.include] An array of paths. If specified,
 * the current path must match at least one of the listed paths.
 * @param {(RegEx|string)[]} [config.conditionConfig.exclude] An array of paths. If specified,
 * the current path must not match any of the listed paths.
 * @returns {boolean}
 */
module.exports = function(config) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  var include = config.conditionConfig.include;
  var exclude = config.conditionConfig.exclude;

  var compare = function(pathOption) {
    return textMatch(path, pathOption);
  };

  return (!include || include.some(compare)) && (!exclude || !exclude.some(compare));
};

