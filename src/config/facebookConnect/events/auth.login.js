/*global FB*/
'use strict';

var connect = require('extensionCores').get('facebookConnect');

module.exports = function(settings, trigger) {
  connect.then(function() {
    FB.Event.subscribe('auth.login', function(response) {
      trigger(response);
    });
  });
};
