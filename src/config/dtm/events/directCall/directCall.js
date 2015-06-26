'use strict';

/**
 * Object where the key is the call name and the value is an array of all rule trigger functions
 * for that call name.
 * @type {Object}
 */
var triggersByCallName = {};

/**
 * Public function intended to be called by the user.
 * @param {string} name The string matching a string configured for a rule.
 */
window._satellite.track = function(name) {
  var triggers = triggersByCallName[name];
  if (triggers) {
    triggers.forEach(function(trigger) {
      trigger();
    });
  }
};

/**
 * Direct call event. This event occurs as soon as the user calls _satellite.track().
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(trigger, settings) {
  var triggers = triggersByCallName[settings.name];

  if (!triggers) {
    triggers = triggersByCallName[settings.name] = [];
  }

  triggers.push(trigger);
};
