'use strict';

var triggers = [];

function handleDOMContentLoaded() {
  document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded, true);

  triggers.forEach(function(trigger) {
    var pseudoEvent = {
      type: 'domready',
      target: document.location
    };

    trigger(pseudoEvent, document.location);
  });
}

var watching = false;
function watchForContentLoaded() {
  if (!watching) {
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, true);
  }
  watching = true;
}

/**
 * DOM ready event. This event occurs as soon as HTML document has been completely loaded and
 * parsed, without waiting for stylesheets, images, and subframes to finish loading.
 * @oaran {Object} config
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  watchForContentLoaded();
  triggers.push(trigger);
};
