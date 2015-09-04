'use strict';

var textMatch = require('textMatch');
var visitorTracking = require('dtm/visitorTracking');

/**
 * Landing page condition. Determines if the actual landing page matches at least one acceptable
 * landing page.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {RegEx[]} config.conditionConfig.pages An array of acceptable landing pages.
 * @returns {boolean}
 */
module.exports = function(config) {
  var landingPage = visitorTracking.getLandingPage();

  return config.conditionConfig.pages.some(function(landingPageCriterion) {
    return textMatch(landingPage, landingPageCriterion);
  });
};

