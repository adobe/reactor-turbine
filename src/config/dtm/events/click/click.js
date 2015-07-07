'use strict';

var bubbly = require('bubbly');
var addLiveEventListener = require('addLiveEventListener');

var clickBubbly = bubbly();

/**
 * Click event. This event occurs when a user has clicked an element.
 * @param {Object} settings
 * @param {Object} settings.eventSettings The event settings object.
 * @param {string} settings.eventSettings.selector The CSS selector for elements the rule is targeting.
 * @param {boolean} [settings.eventSettings.bubbleFireIfParent=false] Whether the rule should fire if the event
 * originated from a descendant element.
 * @param {boolean} [settings.eventSettings.bubbleFireIfChildFired=false] Whether the rule should fire if the
 * same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.eventSettings.bubbleStop=false] Whether the event should not trigger rules on
 * @param {ruleTrigger} trigger The trigger callback.
 * ancestor elements.
 */
module.exports = function(settings, trigger) {
  clickBubbly.addListener(settings.eventSettings, trigger);

  if (settings.eventSettings.eventHandlerOnElement) {
    addLiveEventListener(settings.eventSettings.selector, 'click', clickBubbly.evaluateEvent);
  } else {
    document.addEventListener('click', clickBubbly.evaluateEvent);
  }
};
