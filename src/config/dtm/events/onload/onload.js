var addEventListener = require('addEventListener');
var forEach = require('forEach');

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

  forEach(triggers, function(trigger) {
    trigger(pseudoEvent, document.location);
  });
});

module.exports = function(trigger) {
  triggers.push(trigger);
};
