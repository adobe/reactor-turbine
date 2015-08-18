'use strict';

var window = require('window');

/**
 * Enum for comparison operators.
 * @readonly
 * @enum {string}
 */
var operator = {
  GREATER_THAN: '>',
  LESS_THAN: '<',
  EQUALS: '='
};

function isInRange(value, limit, op) {
  switch (op) {
    case operator.GREATER_THAN:
      return value > limit;
    case operator.LESS_THAN:
      return value < limit;
    case operator.EQUALS:
      return value === limit;
  }
}

/**
 * Screen resolution condition. Determines if the current screen resolution is within a given
 * range.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.width
 * @param {operator} config.conditionConfig.widthOperator
 * @param {number} config.conditionConfig.height
 * @param {operator} config.conditionConfig.heightOperator
 * @returns {boolean}
 */
module.exports = function(config) {
  var widthInRange = isInRange(
    window.screen.width,
    config.conditionConfig.width,
    config.conditionConfig.widthOperator);

  var heightInRange = isInRange(
    window.screen.height,
    config.conditionConfig.height,
    config.conditionConfig.heightOperator);

  return widthInRange && heightInRange;
};

