'use strict';

var visitorTracking = require('dtm/visitorTracking');

/**
 * New vs. returning visitor condition. Determines if the visitor is a new or returning visitor.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string} config.conditionConfig.isNew When true, the condition returns true if the
 * visitor is a new visitor. When false, the condition returns true if the visitor is a returning
 * visitor.
 * @returns {boolean}
 */
module.exports = function(config) {
  var isNewVisitor = visitorTracking.getIsNewVisitor();
  return config.conditionConfig.isNew ? isNewVisitor : !isNewVisitor;
};

