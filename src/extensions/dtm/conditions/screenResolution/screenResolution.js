'use strict';

var window = require('window');
var compareNumbers = require('dtm/compareNumbers');

/**
 * Screen resolution condition. Determines if the current screen resolution matches constraints.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.width The window width to compare against.
 * @param {comparisonOperator} config.conditionConfig.widthOperator The comparison operator to use
 * to compare against width.
 * @param {number} config.conditionConfig.height The window height to compare against.
 * @param {comparisonOperator} config.conditionConfig.heightOperator The comparison operator to use
 * to compare against height.
 * @returns {boolean}
 */
module.exports = function(config) {
  var widthInRange = compareNumbers(
    window.screen.width,
    config.conditionConfig.widthOperator,
    config.conditionConfig.width);

  var heightInRange = compareNumbers(
    window.screen.height,
    config.conditionConfig.heightOperator,
    config.conditionConfig.height);

  return widthInRange && heightInRange;
};

