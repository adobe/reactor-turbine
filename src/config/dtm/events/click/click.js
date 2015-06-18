var bubbly = require('bubbly');
var addLiveEventListener = require('addLiveEventListener');

var clickBubbly = bubbly();

/**
 * Click event. This event occurs when a user has clicked an element.
 * @param {ruleTrigger} trigger The trigger callback.
 * @param {Object} settings The event settings object.
 * @param {string} settings.selector The CSS selector for elements the rule is targeting.
 * @param {boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire if the event
 * originated from a descendant element.
 * @param {boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should fire if the
 * same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger rules on
 * ancestor elements.
 */
module.exports = function(trigger, settings) {
  clickBubbly.addListener(settings, trigger);

  if (settings.eventHandlerOnElement) {
    addLiveEventListener(settings.selector, 'click', clickBubbly.evaluateEvent);
  } else {
    document.addEventListener('click', clickBubbly.evaluateEvent);
  }
};
