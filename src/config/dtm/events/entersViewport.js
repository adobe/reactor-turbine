var addEventListener = require('addEventListener');
var poll = require('poll');
var forEach = require('forEach');
var dataOnElement = require('dataOnElement');

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

var elementIsInView = function(el) {
  var vpH = getViewportHeight();
  var scrollTop = getScrollTop();
  var top = offset(el).top;
  var height = el.offsetHeight;
  return !(scrollTop > (top + height) || scrollTop + vpH < top);
};

var checkForDomChanges = function() {
  forEach(configs, function(config) {
    var elements = document.querySelectorAll(config.selector);
    forEach(elements, function(element) {
      var hasBeenInView = dataOnElement(element, 'inview');
      if (elementIsInView(element)) {
        if (!hasBeenInView) {
          dataOnElement(element, 'inview', true);
          // TODO: If multiple elements match the selector and they both come into view should the rule fire multiple times?
          forEach(config.triggers, function(trigger) {
            trigger();
          });
        }
      } else if (hasBeenInView) {
        dataOnElement(element, 'inview', false);
      }
    });
  });
};

addEventListener(window, 'scroll', checkForDomChanges);
addEventListener(window, 'load', checkForDomChanges);
poll('enters viewport event delegate', checkForDomChanges);

// TODO: Add support for a delay option (how long the element must be in view)
module.exports = function(trigger, eventSettings) {
  var config;

  for (var i = 0; i < configs.length; i++) {
    var candidate = configs[i];
    if (candidate.selector === eventSettings.selector) {
      config = candidate;
    }
  }

  if (!config) {
    config = {
      selector: eventSettings.selector,
      triggers: []
    }
  }

  config.triggers.push(trigger);
  configs.push(config);
};
