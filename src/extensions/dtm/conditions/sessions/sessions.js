'use strict';

var resources = require('resources');
var visitorTracking = resources.get('dtm', 'visitorTracking');
var compareNumbers = resources.get('dtm', 'compareNumbers');

/**
 * Sessions condition. Determines if the number of sessions matches constraints.
 * @param {Object} config Condition config.
 * @param {number} config.count The number of sessions to compare against.
 * @param {comparisonOperator} config.operator The comparison operator to use to
 * compare against count.
 * @returns {boolean}
 */
module.exports = function(config) {
  return compareNumbers(
    visitorTracking.getSessionCount(),
    config.operator,
    config.count
  );
};

