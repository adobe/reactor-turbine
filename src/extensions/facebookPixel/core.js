'use strict';

var loadScript = require('loadScript');

module.exports = function(config) {
  // Can only have one integration.
  var integrationConfig = config.integrationConfigs[0];

  var _fbq = window._fbq || (window._fbq = []);

  // Not sure why we need to use the loaded property but that's Facebook's documented way.
  if (!_fbq.loaded) {
    var locale = integrationConfig.locale || 'en_US';
    loadScript('//connect.facebook.net/' + locale + '/fbds.js');
    _fbq.loaded = true;
  }
};
