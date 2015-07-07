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
 * @oaran {Object} settings
 * @param {Object} settings.eventSettings The event settings object.
 * @param {string} settings.eventSettings.name The string identifier of the direct-call rule.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var triggers = triggersByCallName[settings.eventSettings.name];

  if (!triggers) {
    triggers = triggersByCallName[settings.eventSettings.name] = [];
  }

  triggers.push(trigger);
};
