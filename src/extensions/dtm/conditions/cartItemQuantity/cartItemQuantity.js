'use strict';

var compareNumbers = require('dtm/compareNumbers');

/**
 * Cart item quantity condition. Determines if the current cart item quantity matches constraints.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {number} config.conditionConfig.dataElementName The name of the data element identifying
 * the cart item quantity to compare against.
 * @param {comparisonOperator} config.conditionConfig.operator The comparison operator to use
 * to compare the actual cart item quantity to the cart item quantity constraint.
 * @param {Number} config.conditionConfig.quantity The car item quantity constraint.
 * @returns {boolean}
 */
module.exports = function(config) {
  var quantity = Number(_satellite.getVar(config.conditionConfig.dataElementName));

  if (isNaN(quantity)) {
    quantity = 0;
  }

  return compareNumbers(
    quantity,
    config.conditionConfig.operator,
    config.conditionConfig.quantity);
};

