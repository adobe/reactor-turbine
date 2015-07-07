/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(config) {
  corePromise.then(function() {
    FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
        FB.login(function() {
        }, {scope: config.integrationConfigs[0].scope});
      }
    });
  });
};
