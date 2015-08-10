'use strict';

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watching = false;
function watchForWindowLoad() {
  if (!watching) {
    window.addEventListener('load', function() {
      var pseudoEvent = {
        type: 'windowload',
        target: document.location
      };

      triggers.forEach(function(trigger) {
        trigger(pseudoEvent, document.location);
      });
    }, true);
  }
  watching = true;
}

/**
 * Onload event. This event occurs at the end of the document loading process. At this point,
 * all of the objects in the document are loaded in the DOM, and all images, scripts, links,
 * and sub-frames have finished loading.
 * @param {Object} config
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  watchForWindowLoad();
  triggers.push(trigger);
};
