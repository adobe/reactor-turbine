/*global FB*/
'use strict';

var connect = require('extensionCores').getOne('facebookConnect');

module.exports = function(settings, trigger) {
  connect.then(function() {
    FB.Event.subscribe('auth.authResponseChanged', function(response) {
      trigger(response);
    });
  });
};
