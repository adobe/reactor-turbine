/*global FB*/
'use strict';

var connect = require('extensionCores').get('facebookConnect');

module.exports = function(settings, trigger) {
  connect.then(function() {
    FB.Event.subscribe('comment.remove', function(event) {
      trigger(event);
    });
  });
};
