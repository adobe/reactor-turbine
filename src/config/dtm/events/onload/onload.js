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

module.exports = function(trigger) {
  triggers.push(trigger);
};
