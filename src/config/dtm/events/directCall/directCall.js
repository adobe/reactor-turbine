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

module.exports = function(trigger, settings) {
  var triggers = triggersByCallName[settings.name];

  if (!triggers) {
    triggers = triggersByCallName[settings.name] = [];
  }

  triggers.push(trigger);
};
