'use strict';

var addEventListener = require('addEventListener');
var poll = require('poll');
var covertData = require('covertData');
var bubbly = require('bubbly');

/**
 * Object where the key is the delay and the value is the bubbly instance used for that delay.
 * @type {Object}
 */
var bubblyByDelay = {};

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
 * Mark an element as having been in the viewport for the specified delay.
 * @param {HTMLElement} element The element that is in the viewport.
 * @param {Number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 * @param {string} completeDataKey Identifier string to use for storing completion information on
 * the element.
 */
function markEntersViewportComplete(element, delay, completeDataKey) {
  var event = {
    type: 'inview',
    target: element,
    // If the user did not configure a delay, inviewDelay should be undefined. Probably not
    inviewDelay: delay
  };

  var delayBubbly = bubblyByDelay[delay || 0];
  delayBubbly.evaluateEvent(event);
  covertData(element, completeDataKey, true);
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
    var elements = document.querySelectorAll(listener.settings.selector);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      if (covertData(element, listener.completeDataKey)) {
        continue;
      }

      if (elementIsInView(element, viewportHeight, scrollTop)) {
        if (listener.settings.delay) { // Element is in view, has delay
          if (!covertData(element, listener.timeoutDataKey)) {
            /*eslint-disable no-loop-func*/
            timeoutId = setTimeout(function() {
              if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
                markEntersViewportComplete(
                  element,
                  listener.settings.delay,
                  listener.completeDataKey);
              }
            }, listener.settings.delay);
            /*eslint-enable no-loop-func*/

            covertData(element, listener.timeoutDataKey, timeoutId);
          }
        } else { // Element is in view, has no delay
          markEntersViewportComplete(element, listener.settings.delay, listener.completeDataKey);
        }
      } else if (listener.settings.delay) { // Element is not in view, has delay
        timeoutId = covertData(element, listener.timeoutDataKey);
        if (timeoutId) {
          clearTimeout(timeoutId);
          covertData(element, listener.timeoutDataKey, null);
        }
      }
    }
  });
};

// TODO: Add debounce to the scroll event handling?
addEventListener(window, 'scroll', checkIfElementsInViewport);
addEventListener(window, 'load', checkIfElementsInViewport);
poll('enters viewport event delegate', checkIfElementsInViewport);

/**
 * Enters viewport event. This event occurs when an element has entered the viewport. The rule
 * should only run once per targeted element.
 * @param {ruleTrigger} trigger The trigger callback.
 * @param {Object} settings The event settings object.
 * @param {string} settings.selector The CSS selector for elements the rule is targeting.
 * @param {Number} [settings.delay] The number of milliseconds the element must be within the
 * viewport before declaring that the event has occurred.
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
  var delay = settings.delay || 0;

  var delayBubbly = bubblyByDelay[delay];

  if (!delayBubbly) {
    delayBubbly = bubblyByDelay[delay] = bubbly();
  }

  delayBubbly.addListener(settings, trigger);

  listeners.push({
    // These strings are created and stored here for optimization purposes only. It avoids
    // having to recreate the strings a bunch of times in the above functions as they are
    // polled repeatedly.
    timeoutDataKey: 'dtm.entersViewport.timeoutId.' + delay,
    completeDataKey: 'dtm.entersViewport.complete.' + delay,
    settings: settings
  });
};
