'use strict';

var bubbly = require('bubbly');
var addLiveEventListener = require('addLiveEventListener');

var clickBubbly = bubbly();

/**
 * Click event. This event occurs when a user has clicked an element.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is targeting.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire if
 * the eventoriginated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on @param {ruleTrigger} trigger The trigger callback.
 * ancestor elements.
 */
module.exports = function(config, trigger) {
  clickBubbly.addListener(config.eventConfig, trigger);

  if (config.eventConfig.eventHandlerOnElement) {
    addLiveEventListener(config.eventConfig.selector, 'click', clickBubbly.evaluateEvent);
  } else {
    document.addEventListener('click', clickBubbly.evaluateEvent);
  }
};
