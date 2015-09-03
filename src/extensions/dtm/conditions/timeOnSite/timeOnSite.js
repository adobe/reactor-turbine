'use strict';

var visitorTracking = require('dtm/visitorTracking');
var compareNumbers = require('dtm/compareNumbers');

/**
 * Time on site condition. Determines if the user has been on the site for a certain amount
 * of time.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.minutes The number of minutes to compare against.
 * @param {comparisonOperator} config.conditionConfig.operator The comparison operator to use to
 * compare against minutes.
 * @returns {boolean}
 */
module.exports = function(config) {
  return compareNumbers(
    visitorTracking.getMinutesOnSite(),
    config.conditionConfig.operator,
    config.conditionConfig.minutes
  );
};
