var createDataStash = require('./../createDataStash');
var globalPoll = require('../communication/globalPoll')
var SEEN = 'seen';

// Create a naked object with no prototype so we can safely use it as a map.
var callbacksBySelector = Object.create(null);
var pollingInitialized = false;

function findElements() {
  // Using for loops instead of forEach and functions because this will process a lot and we want
  // to be as efficient as possible.
  for (var selector in callbacksBySelector) {
    var callbacks = callbacksBySelector[selector];

    for (var i = 0; i < callbacks.length; i++) {
      var callback = callbacks[i];
      var elements = document.querySelectorAll(selector);

      for (var j = 0; j < elements.length; j++) {
        callback(elements[j]);
      }
    }
  }
}

function initializePolling() {
  if (!pollingInitialized) {
    globalPoll('liveFindElements', findElements);
    pollingInitialized = true;
  }
}

/**
 * Polls for elements added to the DOM matching a given selector.
 * @param {String} selector The CSS selector used to find elements.
 * @param {Function} callback A function that will be called for each element found. The element
 * will be passed to the callback.
 */
module.exports = function(selector, callback) {
  var dataStash = createDataStash('liveQuery');
  var callbacks = callbacksBySelector[selector];

  if (!callbacks) {
    callbacks = callbacksBySelector[selector] = [];
  }

  // This function will be called for every element found matching the selector but we will only
  // call the consumer's callback if it has not already been called for the element.
  callbacks.push(function(element) {
    if (!dataStash(element, SEEN)) {
      dataStash(element, SEEN, true);
      callback(element);
    }
  });

  initializePolling();
};
