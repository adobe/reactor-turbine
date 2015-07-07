/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(settings) {
  var actionSettings = settings.actionSettings;
  corePromise.then(function() {
    var container = document.querySelector(actionSettings.selector);

    if (container) {
      var div = document.createElement('div');
      div.classList.add('fb-like');
      div.setAttribute('data-action', 'like');
      div.setAttribute('data-href', actionSettings.href);
      div.setAttribute('data-layout', actionSettings.layout);
      div.setAttribute('data-show-faces', actionSettings.showFaces);
      div.setAttribute('data-share', actionSettings.share);

      if (actionSettings.hasOwnProperty('width')) {
        div.setAttribute('data-width', actionSettings.width);
      }

      container.appendChild(div);

      engine.parseXFBML({
        selector: actionSettings.selector
      });
    }
  });
};
