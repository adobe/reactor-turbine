var addEventListener = require('addEventListener');
var poll = require('poll');
var forEach = require('forEach');
var covertData = require('covertData');
var bubbly = require('bubbly');

var listeners = [];

var offset = function(elem) {
  var box;

  try {
    box = elem.getBoundingClientRect();
  } catch (e) {}

  var doc = document,
    docElem = doc.documentElement;

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

var getViewportHeight = function() {
  var height = window.innerHeight; // Safari, Opera
  var mode = document.compatMode;

  if (mode) { // IE, Gecko
    height = (mode == 'CSS1Compat') ?
      document.documentElement.clientHeight : // Standards
      document.body.clientHeight; // Quirks
  }

  return height;
};

var getScrollTop = function() {
  return document.documentElement.scrollTop ?
    document.documentElement.scrollTop :
    document.body.scrollTop;
};

var elementIsInView = function(element, viewportHeight, scrollTop) {
  var top = offset(element).top;
  var height = element.offsetHeight;
  return !(scrollTop > (top + height) || scrollTop + viewportHeight < top);
};

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

  forEach(listeners, function(listener) {
    // Notice that if there are multiple listeners configured with the same delay (or no delay)
    // targeting the same element that the callback from only first listener will be called.
    // This is actually desired.

    var elements = document.querySelectorAll(listener.settings.selector);
    forEach(elements, function(element) {
      if (covertData(element, listener.completeDataKey)) {
        return;
      }

      if (elementIsInView(element, viewportHeight, scrollTop)) {
        if (listener.settings.delay) { // Element is in view, has delay
          if (!covertData(element, listener.timeoutDataKey)) {
            timeoutId = setTimeout(function() {
              if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
                listener.callback(element);
                covertData(element, listener.completeDataKey, true);
              }
            }, listener.settings.delay);

            covertData(element, listener.timeoutDataKey, timeoutId);
          }
        } else { // Element is in view, has no delay
          listener.callback(element);
          covertData(element, listener.completeDataKey, true);
        }
      } else if (listener.settings.delay) { // Element is not in view, has delay
        timeoutId = covertData(element, listener.timeoutDataKey);
        if (timeoutId) {
          clearTimeout(timeoutId);
          covertData(element, listener.timeoutDataKey, null);
        }
      }
    });
  });
};

addEventListener(window, 'scroll', checkIfElementsInViewport);
addEventListener(window, 'load', checkIfElementsInViewport);
poll('enters viewport event delegate', checkIfElementsInViewport);

var bubblyByDelay = {};

module.exports = function(trigger, settings) {
  // Bubbling for this event is dependent upon the delay configured for rules.
  // An event can "bubble up" to other rules with the same delay but not to rules with
  // different delays. See the tests for how this plays out.
  var delay = settings.hasOwnProperty('delay') ? settings.delay : 0;

  var delayBubbly = bubblyByDelay[delay];

  if (!delayBubbly) {
    delayBubbly = bubblyByDelay[delay] = bubbly();
  }

  delayBubbly.addListener(settings, trigger);

  listeners.push({
    timeoutDataKey: 'dtm.entersViewport.timeoutId.' + settings.delay,
    completeDataKey: 'dtm.entersViewport.complete.' + settings.delay,
    settings: settings,
    callback: function(element) {
      delayBubbly.evaluateEvent({
        type: 'inview',
        target: element,
        // If the user did not configure a delay, inviewDelay should be undefined.
        inviewDelay: settings.delay
      });
    }
  });
};
