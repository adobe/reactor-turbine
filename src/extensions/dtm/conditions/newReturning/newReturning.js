'use strict';

var document = require('document');
var getCookie = require('getCookie');
var setCookie = require('setCookie');
var textMatch = require('textMatch');

var dtm = require('extensions/dtm');

/**
 * New vs. returning visitor condition. Determines if the visitor came from a particular traffic source.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string} config.conditionConfig.isNew When true, the condition returns true if the
 * visitor is a new visitor.
 * @returns {boolean}
 */
module.exports = function(config) {
  if (dtm) {
    if (config.conditionConfig.isNew) {
      return dtm.visitor.isNew();
    } else {
      return !dtm.visitor.isNew();
    }
  } else {
    return false;
  }
};

