'use strict';

var document = require('document');

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
 * Window size condition. Determines if the current window size is within a given
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
    document.documentElement.clientWidth,
    config.conditionConfig.width,
    config.conditionConfig.widthOperator);

  var heightInRange = isInRange(
    document.documentElement.clientHeight,
    config.conditionConfig.height,
    config.conditionConfig.heightOperator);

  return widthInRange && heightInRange;
};

