/*global FB*/
'use strict';

var loadScript = require('loadScript');


var Promise = require('Promise');

module.exports = function(config) {
  if (!config.integrationConfigs.length) {
    return;
  }

  // Only a single integration is supported primarily because the Facebook SDK only supports
  // a single app ID per page.
  var integrationConfig = config.integrationConfigs[0];

  return new Promise(function(resolve, reject) {
    // TODO: Implement timeout.
    loadScript('//connect.facebook.net/en_US/sdk.js', function(error) {
      if (error) {
        reject();
      } else {
        FB.init({
          appId: integrationConfig.appId,
          xfbml: !integrationConfig.hasOwnProperty('xfbml') || integrationConfig.xfbml === true,
          version: integrationConfig.version || 'v2.3'
        });
        resolve();
      }
    });
  });
};
