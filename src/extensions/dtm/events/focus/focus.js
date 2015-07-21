'use strict';

var bubbly = require('bubbly');
var addLiveEventListener = require('addLiveEventListener');
var focusBubbly = bubbly();

/**
 * Focus event. This event occurs when an element has received focus.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is targeting.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  focusBubbly.addListener(config.eventConfig, trigger);

  if (config.eventConfig.eventHandlerOnElement) {
    addLiveEventListener(config.eventConfig.selector, 'focus', focusBubbly.evaluateEvent);
  } else {
    // The event doesn't bubble but it does have a capture phase.
    document.addEventListener('focus', focusBubbly.evaluateEvent, true);
  }
};
