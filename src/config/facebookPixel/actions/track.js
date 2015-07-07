'use strict';

module.exports = function(config) {
  var _fbq = window._fbq || (window._fbq = []);
  _fbq.push(['track', config.actionConfig.eventName, config.actionConfig.customData]);
};
