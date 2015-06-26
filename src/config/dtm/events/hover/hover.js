'use strict';

var bubbly = require('bubbly');
var addLiveEventListener = require('addLiveEventListener');

/**
 * After a mouseenter has occurred, waits a given amount of time before declaring that a hover
 * has occurred.
 * @param {Event} event The mouseenter event.
 * @param {Number} delay The amount of delay in milliseconds. If delay = 0, the handler will be
 * called immediately.
 * @param {Function} handler The function that should be called
 */
function delayHover(event, delay, handler) {
  if (delay === 0) {
    handler(event);
  }

  var timeoutId;
  var removeMouseLeaveListener;
  var handleMouseLeave;

  removeMouseLeaveListener = function() {
    event.target.removeEventListener('mouseleave', handleMouseLeave);
  };

  handleMouseLeave = function() {
    clearTimeout(timeoutId);
    removeMouseLeaveListener();
  };

  timeoutId = setTimeout(function() {
    handler(event);
    removeMouseLeaveListener();
  }, delay);

  event.target.addEventListener('mouseleave', handleMouseLeave);
}

var bubblyByDelay = {};

/**
 * Hover event. This event occurs when a user has moved the pointer to be on top of an element.
 * @param {ruleTrigger} trigger The trigger callback.
 * @param {Object} settings The event settings object.
 * @param {string} settings.selector The CSS selector for elements the rule is targeting.
 * @param {Number} [settings.delay] The number of milliseconds the pointer must be on top of the
 * element before declaring that a hover has occurred.
 * @param {boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire if the event
 * originated from a descendant element.
 * @param {boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should fire if the
 * same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger rules on
 * ancestor elements.
 */
module.exports = function(trigger, settings) {
  // Bubbling for this event is dependent upon the delay configured for rules.
  // An event can "bubble up" to other rules with the same delay but not to rules with
  // different delays. See the tests for how this plays out.
  var delay = settings.hasOwnProperty('delay') ? settings.delay : 0;

  var delayBubbly = bubblyByDelay[delay];

  if (!delayBubbly) {
    delayBubbly = bubblyByDelay[delay] = bubbly();
  }

  delayBubbly.addListener(settings, function(event, relatedElement) {
    var pseudoEvent = {
      // The parenthesis is a bit odd and inconsistent with the enters viewport event
      // but is maintained for backward-compatibility since custom conditions may be expecting it.
      // Note that if the user did not configure a delay, it should be hover(0)
      type: 'hover(' + delay + ')',
      target: event.target
    };
    trigger(pseudoEvent, relatedElement);
  });

  addLiveEventListener(settings.selector, 'mouseenter', function(event) {
    delayHover(event, delay, delayBubbly.evaluateEvent);
  });
};
