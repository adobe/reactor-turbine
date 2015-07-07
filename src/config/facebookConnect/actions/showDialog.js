/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(settings) {
  corePromise.then(function() {
    FB.ui(settings.actionSettings);
  });
};
