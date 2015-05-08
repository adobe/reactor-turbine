var poll = require('poll');
var forEach = require('forEach');

var configs = [];

poll('element exists event delegate', function() {
  for (var i = configs.length - 1; i >= 0; i--) {
    var config = configs[i];
    if (document.querySelector(config.selector)) {
      forEach(config.triggers, function(trigger) {
        trigger();
      });
      // Triggers should only be called once so no need to keep watching for the selector.
      configs.splice(i, 1);
    }
  }
});

module.exports = function(trigger, settings) {
  var config;

  for (var i = 0; i < configs.length; i++) {
    var candidate = configs[i];
    if (candidate.selector === settings.selector) {
      config = candidate;
    }
  }

  if (!config) {
    config = {
      selector: settings.selector,
      triggers: []
    }
  }

  config.triggers.push(trigger);
  configs.push(config);
};
