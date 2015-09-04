'use strict';

var visitorTracking = require('dtm/visitorTracking');
var compareNumbers = require('dtm/compareNumbers');

/**
 * Sessions condition. Determines if the number of sessions matches constraints.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.count The number of sessions to compare against.
 * @param {comparisonOperator} config.conditionConfig.operator The comparison operator to use to
 * compare against count.
 * @returns {boolean}
 */
module.exports = function(config) {
  return compareNumbers(
    visitorTracking.getSessionCount(),
    config.conditionConfig.operator,
    config.conditionConfig.count
  );
};

