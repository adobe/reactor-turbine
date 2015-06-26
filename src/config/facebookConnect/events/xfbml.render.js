/*global FB*/
'use strict';

var connect = require('extensions').getOne('facebookConnect');

module.exports = function(trigger) {
  connect.then(function() {
    FB.Event.subscribe('xfbml.render', function() {
      trigger();
    });
  });
};
