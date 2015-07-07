/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(settings) {
  corePromise.then(function() {
    FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
        FB.login(function() {
        }, {scope: settings.integrationsSettings[0].scope});
      }
    });
  });
};
