'use strict';

var bubbly = require('createBubbly')();

var typesWatched = [];

/**
 * The custom event. When an event is seen with the specified type, the rule will be executed.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is targeting.
 * @param {string} config.eventConfig.type The custom event type.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  var type = config.eventConfig.type;

  if (typesWatched.indexOf(type) === -1) {
    typesWatched.push(type);
    document.addEventListener(type, bubbly.evaluateEvent, true);
  }

  bubbly.addListener(config.eventConfig, trigger);
};
