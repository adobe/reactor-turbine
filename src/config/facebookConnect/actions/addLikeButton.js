/*global FB*/
'use strict';

var corePromise = require('extensionCores').get('facebookConnect');

module.exports = function(config) {
  var actionConfig = config.actionConfig;
  corePromise.then(function() {
    var container = document.querySelector(actionConfig.selector);

    if (container) {
      var div = document.createElement('div');
      div.classList.add('fb-like');
      div.setAttribute('data-action', 'like');
      div.setAttribute('data-href', actionConfig.href);
      div.setAttribute('data-layout', actionConfig.layout);
      div.setAttribute('data-show-faces', actionConfig.showFaces);
      div.setAttribute('data-share', actionConfig.share);

      if (actionConfig.hasOwnProperty('width')) {
        div.setAttribute('data-width', actionConfig.width);
      }

      container.appendChild(div);

      engine.parseXFBML({
        selector: actionConfig.selector
      });
    }
  });
};
