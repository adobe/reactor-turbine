var addEventListener = require('addEventListener');
var poll = require('poll');
var forEach = require('forEach');
var covertData = require('covertData');
var bubbly = require('bubbly');
var bubblyByDelay = {};
var configs = [];

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
 * Mark an element as having been in the viewport for the specified delay.
 * @param {HTMLElement} element The element that is in the viewport.
 * @param {Number} delay The amount of time, in milliseconds, the element was required to be in
 * the viewport.
 * @param {String} completeDataKey Identifier string to use for storing completion information on
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

  forEach(configs, function(config) {
    var elements = document.querySelectorAll(config.settings.selector);
    forEach(elements, function(element) {
      if (covertData(element, config.completeDataKey)) {
        return;
      }

      if (elementIsInView(element, viewportHeight, scrollTop)) {
        if (config.settings.delay) { // Element is in view, has delay
          if (!covertData(element, config.timeoutDataKey)) {
            timeoutId = setTimeout(function() {
              if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
                markEntersViewportComplete(element, config.settings.delay, config.completeDataKey);
              }
            }, config.settings.delay);

            covertData(element, config.timeoutDataKey, timeoutId);
          }
        } else { // Element is in view, has no delay
          markEntersViewportComplete(element, config.settings.delay, config.completeDataKey);
        }
      } else if (config.settings.delay) { // Element is not in view, has delay
        timeoutId = covertData(element, config.timeoutDataKey);
        if (timeoutId) {
          clearTimeout(timeoutId);
          covertData(element, config.timeoutDataKey, null);
        }
      }
    });
  });
};

// TODO: Add debounce to the scroll event handling?
addEventListener(window, 'scroll', checkIfElementsInViewport);
addEventListener(window, 'load', checkIfElementsInViewport);
poll('enters viewport event delegate', checkIfElementsInViewport);

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

  configs.push({
    // These strings are created and stored here for optimization purposes only. It avoids
    // having to recreate the strings a bunch of times in the above functions as they are
    // polled repeatedly.
    timeoutDataKey: 'dtm.entersViewport.timeoutId.' + delay,
    completeDataKey: 'dtm.entersViewport.complete.' + delay,
    settings: settings
  });
};
