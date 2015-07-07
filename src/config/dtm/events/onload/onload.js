'use strict';

var addEventListener = require('addEventListener');

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

addEventListener(window, 'load', function() {
  var pseudoEvent = {
    type: 'windowload',
    target: document.location
  };

  triggers.forEach(function(trigger) {
    trigger(pseudoEvent, document.location);
  });
});

/**
 * Onload event. This event occurs at the end of the document loading process. At this point,
 * all of the objects in the document are loaded in the DOM, and all images, scripts, links,
 * and sub-frames have finished loading.
 * @param {Object} config
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  triggers.push(trigger);
};
