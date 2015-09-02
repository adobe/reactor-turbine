'use strict';

var visitorTracking = require('dtm/visitorTracking');
var compareNumbers = require('dtm/compareNumbers');

/**
 * Enum for duration.
 * @readonly
 * @enum {string}
 */
var duration = {
  LIFETIME: 'lifetime',
  SESSION: 'session'
};

/**
 * Page views condition. Determines if the number of page views matches constraints.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.count The number of page views to compare against.
 * @param {comparisonOperator} config.conditionConfig.operator The comparison operator to use to
 * compare against count.
 * @param {duration} config.conditionConfig.duration The duration of time for which to include
 * page views.
 * @returns {boolean}
 */
module.exports = function(config) {
  var methodName = config.conditionConfig.duration === duration.LIFETIME ?
    'getLifetimePageViewCount' : 'getSessionPageViewCount';
  return compareNumbers(
    visitorTracking[methodName](),
    config.conditionConfig.operator,
    config.conditionConfig.count
  );
};
