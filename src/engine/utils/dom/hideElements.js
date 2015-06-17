var querySelectorAll = require('./querySelectorAll');
var isString = require('./../isType/isString');
var forEach = require('./../array/forEach');
var addClass = require('./addClass');
var removeClass = require('./removeClass');
var covertData = require('./../covertData');
var hideStyleAdded = false;
var dataKey = 'dtm.hideElements.numLocks';

/**
 * Hides one or more elements and returns a show function. The elements will not be shown
 * until the show function has been called. If multiple actors request that an element be
 * hidden, the element will not be shown until all actors have requested that it be shown again.
 * @param selectorOrElements A CSS selector or array of DOM elements.
 * @returns {Function} The function to call when the elements should be shown.
 */
module.exports = function(selectorOrElements) {
  // Only make the CSS class available once.
  if (!hideStyleAdded) {
    var headElement = document.getElementsByTagName('head')[0];
    headElement.insertAdjacentHTML('beforeend', '<style>.dtm-hidden{visibility:hidden}</style>');
    hideStyleAdded = true;
  }

  var elements = isString(selectorOrElements) ?
      querySelectorAll(selectorOrElements) : selectorOrElements;

  forEach(elements, function(element) {
    var numLocks = covertData(element, dataKey);

    if (numLocks === undefined) {
      numLocks = 1;
    } else {
      numLocks++;
    }

    covertData(element, dataKey, numLocks);

    addClass(element, 'dtm-hidden');
  });

  var showCalled = false;
  function show() {
    // Don't allow this function to be called multiple times.
    if (showCalled) {
      return;
    }

    forEach(elements, function(element) {
      var numLocks = covertData(element, dataKey);
      covertData(element, dataKey, --numLocks);

      if (numLocks === 0) {
        removeClass(element, 'dtm-hidden');
      }
    });

    showCalled = true;
  }

  return show
};
