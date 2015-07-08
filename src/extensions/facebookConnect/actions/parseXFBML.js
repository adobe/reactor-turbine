/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(config) {
  corePromise.then(function() {
    if (config.actionConfig.hasOwnProperty('selector')) {
      FB.XFBML.parse(document.querySelector(config.actionConfig.selector));
    } else {
      FB.XFBML.parse();
    }
  });
};
