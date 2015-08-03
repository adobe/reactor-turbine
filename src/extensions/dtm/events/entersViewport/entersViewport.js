'use strict';

var poll = require('poll');
var createDataStash = require('createDataStash');
var bubbly = require('bubbly')();
var TIMEOUT_ID = 'timeoutId';
var COMPLETE = 'complete';

var dataStashByDelay = Object.create(null);
var listeners = [];

/**
 * Gets the offset of the element.
 * @param elem
 * @returns {{top: number, left: number}}
 */
var offset = function(elem) {
  var box;

  try {
    box = elem.getBoundingClientRect();
  } catch (e) {
    // ignore
  }

  var doc = document;
  var docElem = doc.documentElement;
  var body = doc.body;
  var win = window;
  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;
  var scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop;
  var scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft;
  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return {
    top: top,
    left: left
  };
};

/**
 * Viewport height.
 * @returns {Number}
 */
var getViewportHeight = function() {
  var height = window.innerHeight; // Safari, Opera
  var mode = document.compatMode;

  if (mode) { // IE, Gecko
    height = (mode === 'CSS1Compat') ?
      document.documentElement.clientHeight : // Standards
      document.body.clientHeight; // Quirks
  }

  return height;
};

/**
 * Scroll top.
 * @returns {number}
 */
var getScrollTop = function() {
  return document.documentElement.scrollTop ?
    document.documentElement.scrollTop :
    document.body.scrollTop;
};

/**
 * Whether an element is in the viewport.
 * @param element The element to evaluate.
 * @param viewportHeight The viewport height. Passed in for optimization purposes.
 * @param scrollTop The scroll top. Passed in for optimization purposes.
 * @returns {boolean}
 */
var elementIsInView = function(element, viewportHeight, scrollTop) {
  var top = offset(element).top;
  var height = element.offsetHeight;
  return !(scrollTop > (top + height) || scrollTop + viewportHeight < top);
};

/**
 * Gets an event type specific to the delay to use in the pseudo event.
 * @param {number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 * @returns {string}
 */
function getPseudoEventType(delay) {
  delay = delay || 0;
  return 'inview(' + delay + ')';
}

/**
 * Notifies that an element as having been in the viewport for the specified delay.
 * @param {HTMLElement} element The element that is in the viewport.
 * @param {Number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 */
function triggerCompleteEvent(element, delay) {
  var event = {
    type: getPseudoEventType(delay),
    target: element,
    // If the user did not configure a delay, inviewDelay should be undefined. Probably not
    inviewDelay: delay
  };

  bubbly.evaluateEvent(event);
}

/**
 * Retrieves the data stash for a given delay
 * @param {Number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 * @returns {Object}
 */
function getDataStashForDelay(delay) {
  delay = delay || 0;

  var dataStash = dataStashByDelay[delay];

  if (!dataStash) {
    dataStash = dataStashByDelay[delay] = createDataStash('entersViewport');
  }

  return dataStash;
}

/**
 * Gets the timeout ID for a particular element + delay combo.
 * @param {HTMLElement} element
 * @param {Number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 * @returns {number}
 */
function getTimeoutId(element, delay) {
  return getDataStashForDelay(delay)(element, TIMEOUT_ID);
}

/**
 * Stored a timeout ID for ar particular element + delay combo.
 * @param {HTMLElement} element
 * @param {Number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 * @param {number} timeoutId
 */
function storeTimeoutId(element, delay, timeoutId) {
  getDataStashForDelay(delay)(element, TIMEOUT_ID, timeoutId);
}

/**
 * Returns whether the process is complete for detecting when the element has entered the
 * viewport for a particular element + delay combo.
 * @param {HTMLElement} element
 * @param {Number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 * @returns {boolean}
 */
function isComplete(element, delay) {
  return getDataStashForDelay(delay)(element, COMPLETE);
}

/**
 * Stores that the process has been completed for detecting when the element has entered the
 * viewport for a particular element + delay combo.
 * @param element
 * @param delay
 */
function storeCompletion(element, delay) {
  getDataStashForDelay(delay)(element, COMPLETE, true);
}

/**
 * Checks to see if a rule's target selector matches an element in the viewport. If that element
 * has not been in the viewport prior, either (a) trigger the rule immediately if the user has not
 * elected to delay for a period of time or (b) start the delay period of the user has elected
 * to delay for a period of time. After an element being in the viewport triggers a rule, it
 * can't trigger the same rule again. If another element matching the same selector comes into
 * the viewport, it may trigger the same rule again.
 */
var checkIfElementsInViewport = function() {
  // Cached and re-used for optimization.
  var viewportHeight = getViewportHeight();
  var scrollTop = getScrollTop();
  var timeoutId;

  listeners.forEach(function(listener) {
    var delay = listener.delay;
    var elements = document.querySelectorAll(listener.selector);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      if (isComplete(element, delay)) {
        continue;
      }

      if (elementIsInView(element, viewportHeight, scrollTop)) {
        if (delay) { // Element is in view, has delay
          if (!getTimeoutId(element, delay)) {
            /*eslint-disable no-loop-func*/
            timeoutId = setTimeout(function() {
              if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
                storeCompletion(element, delay);
                triggerCompleteEvent(element, delay);
              }
            }, delay);
            /*eslint-enable no-loop-func*/

            storeTimeoutId(element, delay, timeoutId);
          }
        } else { // Element is in view, has no delay
          storeCompletion(element, delay);
          triggerCompleteEvent(element, delay);
        }
      } else if (delay) { // Element is not in view, has delay
        timeoutId = getTimeoutId(element, delay)
        if (timeoutId) {
          clearTimeout(timeoutId);
          storeTimeoutId(element, delay, null);
        }
      }
    }
  });
};

// TODO: Add debounce to the scroll event handling?
window.addEventListener('scroll', checkIfElementsInViewport);
window.addEventListener('load', checkIfElementsInViewport);
poll('enters viewport event delegate', checkIfElementsInViewport);

/**
 * Enters viewport event. This event occurs when an element has entered the viewport. The rule
 * should only run once per targeted element.
 * @param {Object} config
 * @param {Object} config.eventConfig The event config object.
 * @param {string} config.eventConfig.selector The CSS selector for elements the rule is
 * targeting.
 * @param {Number} [config.eventConfig.delay] The number of milliseconds the element must be
 * within the viewport before declaring that the event has occurred.
 * @param {boolean} [config.eventConfig.bubbleFireIfParent=false] Whether the rule should fire
 * if the event originated from a descendant element.
 * @param {boolean} [config.eventConfig.bubbleFireIfChildFired=false] Whether the rule should
 * fire if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.eventConfig.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  // Bubbling for this event is dependent upon the delay configured for rules.
  // An event can "bubble up" to other rules with the same delay but not to rules with
  // different delays. See the tests for how this plays out.

  // Re-use the event config object for configuring the bubbly listener since it has most
  // everything needed. Use Object.create so we can add a type attribute without modifying the
  // original object.
  var bubblyEventConfig = Object.create(config.eventConfig);
  bubblyEventConfig.type = getPseudoEventType(config.eventConfig.delay);

  bubbly.addListener(bubblyEventConfig, function(event, relatedElement) {
    // The psuedo event going through bubbly has a type that looks like "inview(40)" so that only
    // listeners watching for a delay of 40 would be called. However, the event that gets passed
    // to the engine which later get passed to conditions don't have the parenthesis. Oddly,
    // this is different than other similar event types like hover and time played (they use the
    // parenthesis). We maintain this difference for backward compatibility in case users are
    // referencing the type in their conditions, etc.
    var eventForRule = {
      type: 'inview',
      target: event.target,
      inviewDelay: event.inviewDelay
    };
    trigger(eventForRule, relatedElement);
  });

  listeners.push(config.eventConfig);
};
