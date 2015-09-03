'use strict';

var window = require('window');
var compareNumbers = require('dtm/compareNumbers');

/**
 * Screen resolution condition. Determines if the current screen resolution matches constraints.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.width
 * @param {comparisonOperator} config.conditionConfig.widthOperator
 * @param {number} config.conditionConfig.height
 * @param {comparisonOperator} config.conditionConfig.heightOperator
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

