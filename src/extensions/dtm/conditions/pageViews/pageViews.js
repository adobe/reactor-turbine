'use strict';
var resources = require('resources');
var visitorTracking = resources.get('dtm', 'visitorTracking');
var compareNumbers = resources.get('dtm', 'compareNumbers');

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
 * @param {Object} config Condition config.
 * @param {number} config.count The number of page views to compare against.
 * @param {comparisonOperator} config.operator The comparison operator to use to
 * compare against count.
 * @param {duration} config.duration The duration of time for which to include
 * page views.
 * @returns {boolean}
 */
module.exports = function(config) {
  var methodName = config.duration === duration.LIFETIME ?
    'getLifetimePageViewCount' : 'getSessionPageViewCount';
  return compareNumbers(
    visitorTracking[methodName](),
    config.operator,
    config.count
  );
};
