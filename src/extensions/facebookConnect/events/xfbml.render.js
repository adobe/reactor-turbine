/*global FB*/
'use strict';

var connect = require('extensionCores').get('facebookConnect');

module.exports = function(config, trigger) {
  connect.then(function() {
    FB.Event.subscribe('xfbml.render', function() {
      trigger();
    });
  });
};
