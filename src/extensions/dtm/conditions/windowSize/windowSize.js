'use strict';

var document = require('document');
var compareNumbers = require('dtm/compareNumbers');

/**
 * Window size condition. Determines if the current window size matches constraints.
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
    document.documentElement.clientWidth,
    config.conditionConfig.widthOperator,
    config.conditionConfig.width);

  var heightInRange = compareNumbers(
    document.documentElement.clientHeight,
    config.conditionConfig.heightOperator,
    config.conditionConfig.height);

  return widthInRange && heightInRange;
};

