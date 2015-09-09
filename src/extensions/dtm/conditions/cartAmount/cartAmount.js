'use strict';

var compareNumbers = require('dtm/compareNumbers');

/**
 * Cart amount condition. Determines if the current cart amount matches constraints.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.dataElementName The name of the data element identifying
 * the cart amount to compare against.
 * @param {comparisonOperator} config.conditionConfig.operator The comparison operator to use
 * to compare the actual cart amount to the cart amount constraint.
 * @param {Number} config.conditionConfig.amount The cart amount constraint.
 * @returns {boolean}
 */
module.exports = function(config) {
  var amount = Number(_satellite.getVar(config.conditionConfig.dataElementName));

  if (isNaN(amount)) {
    amount = 0;
  }

  return compareNumbers(
    amount,
    config.conditionConfig.operator,
    config.conditionConfig.amount);
};
