/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(settings) {
  corePromise.then(function() {
    if (settings.actionSettings.hasOwnProperty('selector')) {
      FB.XFBML.parse(document.querySelector(settings.actionSettings.selector));
    } else {
      FB.XFBML.parse();
    }
  });
};
