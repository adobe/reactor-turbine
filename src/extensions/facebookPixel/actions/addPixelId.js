'use strict';

module.exports = function(config) {
  var _fbq = window._fbq || (window._fbq = []);
  _fbq.push(['addPixelId', config.actionConfig.pixelId]);
};
