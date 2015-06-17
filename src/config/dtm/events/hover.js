var bubbly = require('bubbly');
var addLiveEventListener = require('addLiveEventListener');
var covertData = require('covertData');

var TIMEOUT_DATA_KEY = 'dtm.hover.timeoutIds';

/**
 * After a mouseenter has occurred, waits a given amount of time before declaring that a hover
 * has occurred.
 * @param {Event} event The mouseenter event.
 * @param {Number} delay The amount of delay in milliseconds.
 * @param {Function} handler The function that should be called
 */
function delayHover(event, delay, handler) {
  var timeoutIds = covertData(event.target, TIMEOUT_DATA_KEY);

  if (!timeoutIds) {
    timeoutIds = [];
    covertData(event.target, TIMEOUT_DATA_KEY, timeoutIds);
  }

  var timeoutId = setTimeout(function() {
    handler(event);
  }, delay);

  timeoutIds.push(timeoutId);
}

/**
 * Clears setTimeouts that may be running for a mouseleave event target. This will prevent
 * rules from running when they have not yet had their configured delay met.
 * @param {Event} event The mouseleave event.
 */
function clearHoverDelay(event) {
  var timeoutIds = covertData(event.target, TIMEOUT_DATA_KEY);

  if (timeoutIds && timeoutIds.length) {
    timeoutIds.forEach(function(timeoutId) {
      clearTimeout(timeoutId);
    });

    covertData(event.target, TIMEOUT_DATA_KEY, null);
  }
}

var bubblyByDelay = {};

/**
 * Hover event. This event occurs when a user has moved the pointer to be on top of an element.
 * @param {Function} trigger The trigger callback.
 * @param {Object} settings The event settings object.
 * @param {String} settings.selector The CSS selector for elements the rule is targeting.
 * @param {Number} [settings.delay] The number of milliseconds the pointer must be on top of the
 * element before declaring that a hover has occurred.
 * @param {Boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire if the event
 * originated from a descendant element.
 * @param {Boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should fire if the
 * same event has already triggered a rule targeting a descendant element.
 * @param {Boolean} [settings.bubbleStop=false] Whether the event should not trigger rules on
 * ancestor elements.
 */
module.exports = function(trigger, settings) {
  // Bubbling for the hover event is dependent upon the hover delay configured for rules.
  // A hover event can "bubble up" to other rules with the same hover delay but not to rules with
  // different hover delays. See the tests for how this plays out.
  var delay = settings.hasOwnProperty('delay') ? settings.delay : 0;

  var delayBubbly = bubblyByDelay[delay];

  if (!delayBubbly) {
    delayBubbly = bubblyByDelay[delay] = bubbly();
  }

  delayBubbly.addListener(trigger, settings);

  addLiveEventListener(settings.selector, 'mouseenter', function(event) {
    if (settings.delay) {
      delayHover(event, settings.delay, delayBubbly.evaluateEvent);
    } else {
      delayBubbly.evaluateEvent(event);
    }
  });

  if (settings.delay) {
    addLiveEventListener(settings.selector, 'mouseleave', clearHoverDelay);
  }
};
