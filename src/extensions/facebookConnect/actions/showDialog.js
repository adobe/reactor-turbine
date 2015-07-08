/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(config) {
  corePromise.then(function() {
    FB.ui(config.actionConfig);
  });
};
