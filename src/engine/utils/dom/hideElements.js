var isString = require('./../isType/isString');
var classList = require('./classList');
var dataStash = require('./../createDataStash')('hideElements');
var NUM_LOCKS = 'numLocks';
var hideStyleAdded = false;

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
    document.querySelectorAll(selectorOrElements) : selectorOrElements;

  elements.forEach(function(element) {
    var numLocks = dataStash(element, NUM_LOCKS);

    if (numLocks === undefined) {
      numLocks = 1;
    } else {
      numLocks++;
    }

    dataStash(element, NUM_LOCKS, numLocks);

    classList.add(element, 'dtm-hidden');
  });

  var showCalled = false;

  function show() {
    // Don't allow this function to be called multiple times.
    if (showCalled) {
      return;
    }

    elements.forEach(function(element) {
      var numLocks = dataStash(element, NUM_LOCKS);
      dataStash(element, NUM_LOCKS, --numLocks);

      if (numLocks === 0) {
        classList.remove(element, 'dtm-hidden');
      }
    });

    showCalled = true;
  }

  return show;
};
