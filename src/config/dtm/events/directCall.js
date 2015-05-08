var forEach = require('forEach');

var triggersByCallName = {};

window._satellite.runRule = function(name) {
  var triggers = triggersByCallName[name];
  if (triggers) {
    forEach(triggers, function(trigger) {
      trigger();
    });
  }
};

module.exports = function(trigger, eventSettings) {
  var triggers = triggersByCallName[eventSettings.name];

  if (!triggers) {
    triggers = triggersByCallName[eventSettings.name] = [];
  }

  triggers.push(trigger);
};
