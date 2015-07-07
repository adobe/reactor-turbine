/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function() {
  corePromise.then(function() {
    FB.logout();
  });
};
