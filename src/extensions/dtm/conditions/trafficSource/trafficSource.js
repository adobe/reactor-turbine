'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('dtm/visitorTracking');

/**
 * Traffic source condition. Determines if the actual traffic source matches at least one
 * acceptable traffic source.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {(RegEx|string)[]} config.conditionConfig.sources An array of traffic sources. The
 * condition will return true if the actual traffic source matches one of the sources in
 * the array.
 * @returns {boolean}
 */
module.exports = function(config) {
  var source = visitorTracking.getTrafficSource();
  return config.conditionConfig.sources.some(function(acceptableSource) {
    return textMatch(source, acceptableSource);
  });
};

