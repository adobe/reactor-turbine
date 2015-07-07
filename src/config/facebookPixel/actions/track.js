'use strict';

module.exports = function(config) {
  var _fbq = window._fbq || (window._fbq = []);
  _fbq.push(['track', config.actionSettings.eventName, config.actionSettings.customData]);
};
