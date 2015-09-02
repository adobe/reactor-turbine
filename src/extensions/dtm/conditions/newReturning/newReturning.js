'use strict';

var visitorTracking = require('dtm/visitorTracking');

/**
 * New vs. returning visitor condition. Determines if the visitor came from a particular traffic source.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string} config.conditionConfig.isNew When true, the condition returns true if the
 * visitor is a new visitor.
 * @returns {boolean}
 */
module.exports = function(config) {
  var isNewVisitor = visitorTracking.getIsNewVisitor();
  return config.conditionConfig.isNew ? isNewVisitor : !isNewVisitor;
};

