var poll = require('poll');
var forEach = require('forEach');

var listeners = [];

poll('element exists event delegate', function() {
  for (var i = listeners.length - 1; i >= 0; i--) {
    var listener = listeners[i];
    if (document.querySelector(listener.selector)) {
      forEach(listener.triggers, function(trigger) {
        trigger();
      });
      // Triggers should only be called once so no need to keep watching for the selector.
      listeners.splice(i, 1);
    }
  }
});

module.exports = function(trigger, settings) {
  var listener;

  for (var i = 0; i < listeners.length; i++) {
    var candidate = listeners[i];
    if (candidate.selector === settings.selector) {
      listener = candidate;
    }
  }

  if (!listener) {
    listener = {
      selector: settings.selector,
      triggers: []
    };
  }

  listener.triggers.push(trigger);
  listeners.push(listener);
};
