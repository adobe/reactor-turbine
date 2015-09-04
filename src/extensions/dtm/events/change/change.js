'use strict';

var bubbly = require('dtm/createBubbly')();
var textMatch = require('textMatch');

document.addEventListener('change', bubbly.evaluateEvent, true);

/**
 * The change event. This event occurs when a change to an element's value is committed by the user.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is targeting.
 * @param {string|RegExp} [config.eventConfig.value] What the new value must be for the rule
 * to fire.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  var matchValue = config.eventConfig.value;
  bubbly.addListener(config.eventConfig, function(event, relatedElement) {
    if (matchValue === undefined || textMatch(event.target.value, matchValue)) {
      trigger(event, relatedElement);
    } else {
      return false;
    }
  });
};
